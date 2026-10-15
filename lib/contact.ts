import { z } from "zod";
import { CAPABILITIES } from "@/lib/constants";

export const TOPICS = [
  ...CAPABILITIES.map((c) => ({ value: c.slug, label: c.title })),
  { value: "research-partnership", label: "Research partnership" },
  { value: "other", label: "Something else" },
] as const;

export type TopicValue = (typeof TOPICS)[number]["value"];

export const TOPIC_VALUES = TOPICS.map((t) => t.value) as [string, ...string[]];

export const CONTACT_PAGE = {
  hero: {
    eyebrow: "CONTACT",
    title: "Tell us the problem",
    lead: "Describe what has to run, and where. We reply within two working days, usually sooner.",
  },
  form: {
    eyebrow: "START A PROJECT",
    headline: "Send us a message",
    labels: {
      name: "Name",
      email: "Email",
      company: "Company",
      companyHint: "Optional",
      topic: "What is this about",
      message: "Message",
      messageHint: "What are you trying to build, and where does it have to run?",
    },
    submit: "Send message",
    sending: "Sending",
    privacy: "We use your details only to reply to this message.",
    success: {
      title: "Message sent",
      text: "Thank you. We will reply within two working days.",
      ref: "Reference",
      again: "Send another message",
    },
    error: {
      title: "That did not go through",
      text: "Please try again, or write to us directly.",
      retry: "Try again",
    },
  },
  next: {
    eyebrow: "WHAT HAPPENS NEXT",
    headline: "From message to first call",
    lead: "No sales script. Someone who does the work reads your message.",
  },
  direct: {
    label: "WRITE DIRECTLY",
    response: "We reply within two working days.",
    booking: "Book a call",
    whatsapp: "WhatsApp",
  },
} as const;

export const NEXT_STEPS = [
  {
    name: "We read it",
    text: "Someone from the research team reads your message and checks it against what we have built before.",
    time: "Day 1",
  },
  {
    name: "We reply",
    text: "You get an honest answer: yes, no, or what we would need to know first.",
    time: "Within 2 days",
  },
  {
    name: "A short call",
    text: "If it fits, we set up a 30 minute call to agree the question and the test.",
    time: "Week 1",
  },
] as const;

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  email: z.string().trim().email("Please enter a valid email").max(120),
  company: z.string().trim().max(120).optional().default(""),
  topic: z.enum(TOPIC_VALUES),
  message: z.string().trim().min(20, "Please write at least 20 characters").max(4000),
  website: z.string().max(0).optional().default(""), // honeypot: must stay empty
  startedAt: z.number().int(), // epoch ms when the form was first shown
});

export type ContactInput = z.infer<typeof contactSchema>;
