import { Resend } from "resend";
import { contactSchema, TOPICS } from "@/lib/contact";
import { CONTACT } from "@/lib/constants";
import { rateLimit } from "@/lib/rate-limit";



// In-memory tracker for duplicate submissions within 10 minutes
const recentSubmissions = new Map<string, { message: string; timestamp: number }>();

function generateReferenceId(): string {
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  const num = ((bytes[0] << 24) | (bytes[1] << 16) | (bytes[2] << 8) | bytes[3]) >>> 0;
  return `MB-${(num % 2176782336).toString(36).padStart(6, "0").toUpperCase()}`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(req: Request): Promise<Response> {
  // 1. Content-Type and payload size check (max 10 KB)
  const contentType = req.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return new Response(JSON.stringify({ ok: false, error: "Unsupported Media Type" }), {
      status: 415,
      headers: { "Content-Type": "application/json" },
    });
  }

  const contentLength = req.headers.get("content-length");
  if (contentLength && parseInt(contentLength, 10) > 10240) {
    return new Response(JSON.stringify({ ok: false, error: "Payload too large" }), {
      status: 413,
      headers: { "Content-Type": "application/json" },
    });
  }

  let rawText = "";
  try {
    rawText = await req.text();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: "Failed to read request body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (rawText.length > 10240) {
    return new Response(JSON.stringify({ ok: false, error: "Payload too large" }), {
      status: 413,
      headers: { "Content-Type": "application/json" },
    });
  }

  let body: unknown;
  try {
    body = JSON.parse(rawText);
  } catch {
    return new Response(JSON.stringify({ ok: false, error: "Malformed JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // 2. Origin check
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (origin && host) {
    try {
      const originHost = new URL(origin).host;
      const allowedHosts = [host];
      if (process.env.NEXT_PUBLIC_SITE_URL) {
        try {
          allowedHosts.push(new URL(process.env.NEXT_PUBLIC_SITE_URL).host);
        } catch {
          // ignore malformed site URL
        }
      }
      if (!allowedHosts.includes(originHost)) {
        return new Response(JSON.stringify({ ok: false, error: "Forbidden origin" }), {
          status: 403,
          headers: { "Content-Type": "application/json" },
        });
      }
    } catch {
      return new Response(JSON.stringify({ ok: false, error: "Invalid origin" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  // 3. Rate limiting by IP (x-forwarded-for first value, fallback "unknown")
  const forwardedFor = req.headers.get("x-forwarded-for");
  const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "unknown";
  const rateLimitResult = rateLimit(ip);
  if (!rateLimitResult.success) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: "Too many messages. Please try again later or write to us directly.",
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(rateLimitResult.retryAfter ?? 60),
          "Cache-Control": "no-store",
        },
      }
    );
  }

  // 4. Honeypot pre-check: if bot filled honeypot, return 200 silent discard immediately so bots learn nothing
  if (
    typeof body === "object" &&
    body !== null &&
    "website" in body &&
    typeof (body as Record<string, unknown>).website === "string" &&
    ((body as Record<string, unknown>).website as string).length > 0
  ) {
    if (process.env.NODE_ENV !== "production") {
      console.log("[contact-api] Honeypot triggered (silent 200 discard)");
    }
    const silentId = generateReferenceId();
    return new Response(JSON.stringify({ ok: true, id: silentId }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    });
  }

  // 4b. Schema validation
  const validation = contactSchema.safeParse(body);
  if (!validation.success) {
    const errors: Record<string, string> = {};
    for (const issue of validation.error.issues) {
      const field = issue.path[0];
      if (typeof field === "string" && !errors[field]) {
        errors[field] = issue.message;
      }
    }
    return new Response(JSON.stringify({ ok: false, errors }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    });
  }

  const { name, email, company, topic, message, website, startedAt } = validation.data;
  const now = Date.now();
  const timeTaken = now - startedAt;

  // Cleanup old duplicate tracker entries (> 10m)
  for (const [k, v] of recentSubmissions.entries()) {
    if (now - v.timestamp > 10 * 60 * 1000) {
      recentSubmissions.delete(k);
    }
  }

  // 5. Anti-spam checks (silent discard returning 200 with id)
  const isHoneypot = Boolean(website && website.length > 0);
  const isTooFast = timeTaken < 2500;
  const isInvalidTimestamp = startedAt > now || now - startedAt > 24 * 60 * 60 * 1000;
  const urlCount = (message.match(/(https?:\/\/|www\.)[^\s]+/gi) || []).length;
  const hasExcessiveUrls = urlCount > 3;

  const dupKey = `${ip}:${email.toLowerCase()}`;
  const prevSubmission = recentSubmissions.get(dupKey);
  const isDuplicate = Boolean(
    prevSubmission &&
      now - prevSubmission.timestamp < 10 * 60 * 1000 &&
      prevSubmission.message === message
  );

  if (isHoneypot || isTooFast || isInvalidTimestamp || hasExcessiveUrls || isDuplicate) {
    if (process.env.NODE_ENV !== "production") {
      console.log("[contact-api] Spam check triggered (silently discarded):", {
        isHoneypot,
        isTooFast,
        timeTakenMs: timeTaken,
        isInvalidTimestamp,
        hasExcessiveUrls,
        isDuplicate,
      });
    }
    const silentId = generateReferenceId();
    return new Response(JSON.stringify({ ok: true, id: silentId }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    });
  }

  // Track submission for duplicate detection
  recentSubmissions.set(dupKey, { message, timestamp: now });

  // 6. Build email
  const referenceId = generateReferenceId();
  const topicMatch = TOPICS.find((t) => t.value === topic);
  const topicLabel = topicMatch ? topicMatch.label : topic;

  // Header injection protection: strip CR/LF and cap at 120 chars
  const cleanName = name.replace(/[\r\n]+/g, " ").trim();
  const cleanTopic = topicLabel.replace(/[\r\n]+/g, " ").trim();
  const rawSubject = `[minibyte] ${cleanTopic}: ${cleanName}`;
  const subject = rawSubject.slice(0, 120);

  const referer = req.headers.get("referer") || "Unknown";
  const timestampUtc = new Date(now).toUTCString();

  const textBody = [
    `Reference: ${referenceId}`,
    `Topic: ${topicLabel}`,
    `Name: ${name}`,
    `Email: ${email}`,
    company ? `Company: ${company}` : "",
    `Sent at: ${timestampUtc}`,
    `Referer: ${referer}`,
    "",
    "Message:",
    message,
    "",
    "---",
    `minibyte website contact submission [${referenceId}]`,
  ]
    .filter(Boolean)
    .join("\n");

  const escapedName = escapeHtml(name);
  const escapedEmail = escapeHtml(email);
  const escapedCompany = company ? escapeHtml(company) : "—";
  const escapedTopic = escapeHtml(topicLabel);
  const escapedMessage = escapeHtml(message).replace(/\n/g, "<br />");
  const escapedReferer = escapeHtml(referer);
  const escapedId = escapeHtml(referenceId);
  const escapedTime = escapeHtml(timestampUtc);

  const htmlBody = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:24px;background-color:#F3F4F1;color:#0C0E12;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;line-height:1.5;">
  <div style="max-width:600px;margin:0 auto;background-color:#FFFFFF;border:1px solid #D9DCD6;border-radius:12px;padding:32px;">
    <div style="border-bottom:1px solid #D9DCD6;padding-bottom:16px;margin-bottom:24px;">
      <p style="margin:0;font-size:12px;letter-spacing:0.08em;font-weight:600;color:#5A606B;text-transform:uppercase;">minibyte &middot; Contact Submission</p>
      <h1 style="margin:8px 0 0 0;font-size:22px;color:#0C0E12;font-weight:600;">${escapedTopic}</h1>
    </div>

    <table style="width:100%;border-collapse:collapse;margin-bottom:24px;font-size:14px;">
      <tr>
        <td style="padding:8px 0;color:#5A606B;width:110px;vertical-align:top;font-family:monospace;font-size:12px;">NAME</td>
        <td style="padding:8px 0;color:#0C0E12;font-weight:500;">${escapedName}</td>
      </tr>
      <tr>
        <td style="padding:8px 0;color:#5A606B;vertical-align:top;font-family:monospace;font-size:12px;">EMAIL</td>
        <td style="padding:8px 0;color:#0C0E12;"><a href="mailto:${escapedEmail}" style="color:#0C0E12;text-decoration:underline;">${escapedEmail}</a></td>
      </tr>
      <tr>
        <td style="padding:8px 0;color:#5A606B;vertical-align:top;font-family:monospace;font-size:12px;">COMPANY</td>
        <td style="padding:8px 0;color:#0C0E12;">${escapedCompany}</td>
      </tr>
      <tr>
        <td style="padding:8px 0;color:#5A606B;vertical-align:top;font-family:monospace;font-size:12px;">TOPIC</td>
        <td style="padding:8px 0;color:#0C0E12;">${escapedTopic}</td>
      </tr>
    </table>

    <div style="background-color:#F3F4F1;border:1px solid #D9DCD6;border-radius:8px;padding:20px;margin-bottom:24px;">
      <p style="margin:0 0 8px 0;font-size:11px;font-family:monospace;color:#5A606B;letter-spacing:0.06em;text-transform:uppercase;">MESSAGE</p>
      <div style="font-size:15px;color:#0C0E12;white-space:normal;line-height:1.6;">${escapedMessage}</div>
    </div>

    <div style="border-top:1px solid #D9DCD6;padding-top:16px;font-size:12px;color:#5A606B;font-family:monospace;">
      <p style="margin:4px 0;">REFERENCE: <strong style="color:#0C0E12;">${escapedId}</strong></p>
      <p style="margin:4px 0;">TIMESTAMP: ${escapedTime}</p>
      <p style="margin:4px 0;">SOURCE: ${escapedReferer}</p>
    </div>
  </div>
</body>
</html>`;

  // Note: No automated confirmation email is sent to the sender in this version.
  // Sender auto-replies require a verified domain in Resend to prevent spoofing and delivery penalties.

  const resendApiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL || CONTACT.email;
  const fromEmail = process.env.CONTACT_FROM_EMAIL || "minibyte <onboarding@resend.dev>";

  // 7. Missing API key fallback
  if (!resendApiKey) {
    if (process.env.NODE_ENV !== "production") {
      console.log("\n=======================================================");
      console.log("[DEV CONTACT EMAIL COMPOSED - RESEND_API_KEY UNSET]");
      console.log(`Reference ID: ${referenceId}`);
      console.log(`From:         ${fromEmail}`);
      console.log(`To:           ${toEmail}`);
      console.log(`Reply-To:     ${email}`);
      console.log(`Subject:      ${subject}`);
      console.log("-------------------------------------------------------");
      console.log(textBody);
      console.log("=======================================================\n");

      return new Response(JSON.stringify({ ok: true, id: referenceId }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
      });
    }

    console.error("[contact-api] RESEND_API_KEY is unset in production environment");
    return new Response(JSON.stringify({ ok: false }), {
      status: 503,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    });
  }

  // 8. Send with Resend
  try {
    const resend = new Resend(resendApiKey);
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      replyTo: email,
      subject,
      text: textBody,
      html: htmlBody,
    });

    if (error) {
      // Security: never log message content or sensitive client data
      console.error("[contact-api] Resend email delivery failed:", {
        id: referenceId,
        topic,
        errorName: error.name || "ResendError",
        errorMessage: error.message,
      });
      return new Response(JSON.stringify({ ok: false }), {
        status: 502,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
      });
    }
  } catch (err: unknown) {
    const errorName = err instanceof Error ? err.name : "UnknownError";
    console.error("[contact-api] Resend execution threw an error:", {
      id: referenceId,
      topic,
      errorName,
    });
    return new Response(JSON.stringify({ ok: false }), {
      status: 502,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    });
  }

  // 9. Success response
  return new Response(JSON.stringify({ ok: true, id: referenceId }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}

export async function GET(): Promise<Response> {
  return new Response(null, { status: 405, headers: { Allow: "POST" } });
}

export async function PUT(): Promise<Response> {
  return new Response(null, { status: 405, headers: { Allow: "POST" } });
}

export async function DELETE(): Promise<Response> {
  return new Response(null, { status: 405, headers: { Allow: "POST" } });
}
