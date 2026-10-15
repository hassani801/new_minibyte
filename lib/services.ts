import { type Capability } from "@/lib/constants";

/**
 * Service details indexed by capability slug.
 * Derives key types from Capability so TypeScript enforces exhaustiveness.
 */
export const SERVICE_DETAILS: Record<
  Capability["slug"],
  {
    summary: string;
    deliverables: string[];
    fitWhen: string[];
    format: string;
  }
> = {
  "autonomous-robotics": {
    summary:
      "We design autonomous navigation, obstacle avoidance, and control architectures for uncrewed ground and aerial platforms running ROS2 on embedded silicon.",
    deliverables: [
      "ROS2 navigation, perception, and trajectory control packages",
      "Hardware-in-the-loop simulation benchmarks and safety validation data",
      "Full source code, deployment scripts, and operational technical documentation",
    ],
    fitWhen: [
      "Platforms must navigate reliably in GPS-denied or contested environments",
      "Airframe or ground chassis payloads demand lightweight compute execution",
      "Custom drive-by-wire and sensor arrays require specialized autonomy integration",
    ],
    format: "Typically 12 weeks, four phases",
  },
  "ai-ml-services": {
    summary:
      "We engineer on-device models, fine-tuned RAG pipelines, and computer vision systems accelerated with CUDA and optimized for NVIDIA Jetson hardware.",
    deliverables: [
      "Quantized on-device models tailored to specific edge silicon constraints",
      "Domain-specific fine-tuned RAG pipelines and evaluation harnesses",
      "CUDA-accelerated computer vision runtime for embedded NVIDIA Jetson platforms",
    ],
    fitWhen: [
      "Sensitive telemetry and operational data cannot leave the local device",
      "Inference latency and power budgets require hardware-level quantization",
      "High-throughput computer vision must execute locally in real time",
    ],
    format: "Typically 12 weeks, four phases",
  },
  "automotive-tech": {
    summary:
      "We build automotive drive-by-wire interfaces, in-vehicle computer vision analytics, and rugged edge compute software for fleet and ground mobility.",
    deliverables: [
      "Drive-by-wire control logic, failsafe routines, and CAN bus integration",
      "In-cabin and road-facing computer vision perception models",
      "Ruggedized edge computing runtimes tested for automotive environments",
    ],
    fitWhen: [
      "Vehicles require autonomous navigation or advanced driver assistance routines",
      "Perception systems must operate reliably under changing weather and terrain",
      "Commercial chassis require retrofit conversions for autonomous operation",
    ],
    format: "Typically 12 weeks, four phases",
  },
  "full-stack-software": {
    summary:
      "We develop mission-critical full-stack applications, situational awareness dashboards, and WebRTC streaming infrastructure connecting field devices to operators.",
    deliverables: [
      "Low-latency WebRTC streaming and multi-device telemetry pipelines",
      "Mission control dashboards and operator situational displays",
      "Resilient microservices architectures deployed on-premise or cloud",
    ],
    fitWhen: [
      "Operators require real-time, low-latency video feeds and telemetry from deployed robots",
      "Distributed sensor data requires unified monitoring and alerting interfaces",
      "Enterprise systems need air-gapped deployment with strict data sovereignty",
    ],
    format: "Typically 12 weeks, four phases",
  },
};

export const SERVICES_PAGE = {
  hero: {
    eyebrow: "SERVICES",
    title: "What we take on",
    lead: "Four areas, one method: agree the test first, build the smallest thing that passes, hand over everything.",
  },
  detail: {
    eyebrow: "CAPABILITIES",
    headline: "Four areas of engineering",
  },
  process: {
    eyebrow: "PROCESS",
    headline: "Four phases, each with a clear result",
    lead: "Most projects run twelve weeks. Phase two and three overlap, so evaluation starts while the model is still being built.",
  },
  engagement: {
    eyebrow: "ENGAGEMENT",
    headline: "How we engage",
  },
  faq: {
    eyebrow: "FAQ",
    headline: "Questions we hear a lot",
  },
  cta: {
    eyebrow: "START A PROJECT",
    headline: "Not sure which fits",
    sub: "Describe the problem and where it has to run. We will tell you honestly if we are the right team.",
    primary: {
      label: "Start a project",
      href: "/contact",
    },
  },
} as const;

export const PROCESS = [
  {
    key: "discover",
    name: "Discover",
    start: 1,
    end: 2,
    summary:
      "We review your documentation, data and hardware, and agree the questions the model must answer.",
    deliverable: "Requirements note and a test set",
  },
  {
    key: "build",
    name: "Build",
    start: 3,
    end: 8,
    summary:
      "We train a small model on your material and fit it to the target device.",
    deliverable: "Working prototype on your devices",
  },
  {
    key: "evaluate",
    name: "Evaluate",
    start: 7,
    end: 10,
    summary:
      "We measure accuracy, speed and battery use on the test set and compare against a cloud baseline.",
    deliverable: "Evaluation report with measured results",
  },
  {
    key: "handover",
    name: "Hand over",
    start: 11,
    end: 12,
    summary:
      "We transfer weights, code and documentation, and show your team how to retrain.",
    deliverable: "Repository, documentation and a workshop",
  },
] as const;

export const TOTAL_WEEKS = 12;

export const ENGAGEMENT = {
  facts: [
    { label: "Typical duration", value: "12 weeks" },
    { label: "Phases", value: "4" },
    { label: "Pricing", value: "Fixed price per phase" },
    { label: "Check-ins", value: "Weekly, written update every second week" },
  ],
  needFromYou: [
    "Access to documentation and anonymised data",
    "Target devices for the duration",
    "One contact person, about two hours a week",
  ],
  notIncluded: [
    "Integration into your existing systems",
    "Hardware procurement",
    "Operating the model after hand-over",
  ],
  note: "Scope and terms are agreed per project.",
} as const;

// Structured FAQ answers for client evaluation
export const FAQ = [
  {
    q: "How long does a project take?",
    a: "Most engagements run twelve weeks across four structured phases. Smaller evaluation benchmarks can finish in six weeks, while complex multi-device deployments may require phased extensions.",
  },
  {
    q: "Who owns the model and the code?",
    a: "You own everything we build for you, unconditionally. All model weights, training scripts, evaluation harnesses, and documentation are transferred to your repository upon project completion.",
  },
  {
    q: "Can you work with confidential data?",
    a: "Yes. We work on air-gapped systems or within your secure cloud boundary under standard non-disclosure agreements. We do not retain copies of your data once validation concludes.",
  },
  {
    q: "Do you work with small teams or only large companies?",
    a: "We work with engineering teams of all sizes, from venture-backed hardware startups to industrial enterprises. What matters is a concrete physical hardware target and a well-defined problem.",
  },
  {
    q: "What does a first conversation look like?",
    a: "We spend thirty minutes discussing your technical problem, current hardware constraints, and test criteria. If we are confident a small model can solve it, we draft a concise one-page scope.",
  },
] as const;
