// CONFIRM with the team that each project and image is cleared for public release

export type ProjectImage = {
  src: string;
  alt: string;
  tone?: "bw" | "original";
};

export type CaseStudy = {
  client?: string; // omit or set "Confidential" when the client is not public
  role?: string; // e.g. "Edge-compute engineering"
  duration?: string;
  stack?: string[]; // tools/tech tags
  challenge?: string;
  approach?: string[]; // 2-4 short paragraphs or steps
  results?: { label: string; value: string }[]; // qualitative or measurable results
  gallery?: ProjectImage[]; // optional images
};

export type Project = {
  slug: string;
  name: string; // lowercase brand style, e.g. "aethero-nxn"
  summary: string;
  tags: string[];
  specs?: { label: string; value: string }[];
  surface: "paper" | "ink";
  pattern: { col: number; row: number; cols: number; rows: number }; // DotPattern crop for the card visual
  image?: ProjectImage; // optional; if present it replaces the dot visual
  year?: string;
  public: boolean;
  case?: CaseStudy;
};

export const PROJECTS: Project[] = [
  {
    slug: "aethero-nxn",
    name: "aethero-nxn",
    summary: "Space-rated edge-compute module powered by the first commercial NVIDIA Jetson Orin in space.",
    tags: ["Space", "Edge", "AI"],
    specs: [
      { label: "Hardware", value: "NVIDIA Jetson Orin" },
      { label: "Missions", value: "Transporter-11 & 16" },
      { label: "Rating", value: "Space-rated" },
    ],
    surface: "ink",
    pattern: { col: 0, row: 0, cols: 4, rows: 4 },
    image: {
      src: "/portfolio/aethero-space.jpg",
      alt: "Aethero edge-compute module in space orbit",
      tone: "bw",
    },
    public: true,
    case: {
      role: "Edge-compute qualification and onboard inference",
      stack: ["NVIDIA Jetson", "CUDA", "Space-rated hardware", "Edge AI"],
      challenge:
        "Commercial AI modules operating in low Earth orbit must withstand harsh radiation, launch vibration, and strict thermal limits while processing satellite payload imagery locally.",
      approach: [
        "Qualified commercial NVIDIA Jetson Orin silicon for flight qualification and orbital operations.",
        "Engineered low-latency onboard inference pipelines to process payload telemetry directly at the edge.",
        "Integrated flight hardware deployed on SpaceX Transporter-11 and Transporter-16 rideshare missions.",
      ],
      results: [
        { label: "Flight heritage", value: "Transporter-11 and Transporter-16" },
        { label: "Milestone", value: "First commercial Jetson Orin in space" },
        { label: "Qualification", value: "Space-rated" },
      ],
      gallery: [
        {
          src: "/portfolio/aethero-module-pcb.jpg",
          alt: "Aethero module PCB circuit architecture",
          tone: "original",
        },
      ],
    },
  },
  {
    slug: "counter-uas-interceptor",
    name: "counter-uas-interceptor",
    summary: "Kinetic drone interceptor engineered for autonomous counter-UAS defence operations.",
    tags: ["Defence", "Robotics", "Autonomy"],
    specs: [
      { label: "Role", value: "Counter-UAS" },
      { label: "Interception", value: "Kinetic" },
      { label: "Operation", value: "Autonomous" },
    ],
    surface: "paper",
    pattern: { col: 1, row: 1, cols: 4, rows: 4 },
    image: {
      src: "/portfolio/counter-uas-interceptor.jpg",
      alt: "Kinetic counter-UAS interceptor drone airframe",
      tone: "bw",
    },
    public: true,
    case: {
      role: "Autonomy guidance and aerodynamic airframe design",
      stack: ["Robotics", "Autonomy", "Aerodynamics", "Simulation"],
      challenge:
        "Defending against hostile uncrewed aerial systems requires high-speed terminal guidance, aggressive aerodynamic stability, and reliable autonomous trajectory planning.",
      approach: [
        "Designed high-thrust airframe geometry backed by comprehensive aerodynamic simulations.",
        "Implemented high-rate onboard guidance routines for autonomous terminal interception.",
        "Validated flight handling and target tracking across simulated engagement profiles.",
      ],
      results: [
        { label: "Interception type", value: "Kinetic" },
        { label: "Guidance", value: "Autonomous" },
      ],
      gallery: [
        {
          src: "/portfolio/drone-aero-simulation.jpg",
          alt: "Drone aerodynamic airflow velocity simulation",
          tone: "original",
        },
      ],
    },
  },
  {
    slug: "visual-positioning-system",
    name: "visual-positioning-system",
    summary: "Visual Positioning System delivering drift-free navigation in GPS-denied environments.",
    tags: ["Vision", "Navigation", "Defence"],
    specs: [
      { label: "Environment", value: "GPS-denied" },
      { label: "Method", value: "Visual positioning" },
      { label: "Reference", value: "Orthophoto matching" },
    ],
    surface: "ink",
    pattern: { col: 2, row: 0, cols: 4, rows: 4 },
    image: {
      src: "/portfolio/vps-diagram.jpg",
      alt: "Visual Positioning System architecture diagram",
      tone: "original",
    },
    public: true,
    case: {
      role: "Computer vision algorithm development and mapping pipeline",
      stack: ["Computer Vision", "Orthophoto Matching", "CUDA", "Embedded Linux"],
      challenge:
        "Contested electronic warfare environments render satellite GPS unavailable, requiring aerial platforms to determine absolute position using passive optical imagery alone.",
      approach: [
        "Developed real-time orthophoto matching correlating optical downward camera frames with onboard satellite maps.",
        "Optimized feature extraction and closed-loop visual odometry for embedded flight processors.",
        "Benchmarked localization consistency across urban, rural, and feature-sparse flight trajectories.",
      ],
      results: [
        { label: "Operation", value: "GPS-denied navigation" },
        { label: "Localization", value: "Real-time orthophoto matching" },
      ],
      gallery: [
        {
          src: "/portfolio/vps-base-orthophoto.jpg",
          alt: "Base orthophoto reference survey map",
          tone: "original",
        },
        {
          src: "/portfolio/vps-orthophoto-loop.jpg",
          alt: "Orthophoto loop feature correspondence match",
          tone: "original",
        },
        {
          src: "/portfolio/vps-satellite-path.jpg",
          alt: "Satellite flight path navigation match",
          tone: "original",
        },
        {
          src: "/portfolio/vps-urban-orthophoto.jpg",
          alt: "Urban terrain orthophoto visual navigation frame",
          tone: "original",
        },
      ],
    },
  },
  {
    slug: "harawal-ugv",
    name: "harawal-ugv",
    summary: "HARAWAL 8x8 autonomous unmanned ground vehicle for defence operations.",
    tags: ["Robotics", "Autonomy", "Defence"],
    specs: [
      { label: "Chassis", value: "8x8 all-wheel drive" },
      { label: "Class", value: "Unmanned ground vehicle" },
    ],
    surface: "paper",
    pattern: { col: 3, row: 2, cols: 4, rows: 4 },
    public: true,
    case: {
      role: "Autonomous navigation stack and vehicle control",
      stack: ["ROS2", "Robotics", "Sensors", "Drive-by-wire"],
      challenge:
        "Large 8x8 unmanned ground platforms operating across rough off-road terrain require robust autonomous path planning, terrain traversability evaluation, and failsafe controls.",
      approach: [
        "Engineered multi-sensor perception and real-time obstacle segmentation routines.",
        "Integrated drive-by-wire vehicle control systems with remote and autonomous operational modes.",
        "Conducted rough-terrain endurance and traversability field tests.",
      ],
      results: [
        { label: "Platform", value: "8x8 all-wheel drive" },
        { label: "Mode", value: "Autonomous and tele-operated" },
      ],
    },
  },
  {
    slug: "agricultural-ugv",
    name: "agricultural-ugv",
    summary: "Autonomous unmanned ground vehicle engineered for precision agricultural applications.",
    tags: ["Robotics", "Agriculture"],
    specs: [
      { label: "Type", value: "Autonomous UGV" },
      { label: "Application", value: "Precision agriculture" },
    ],
    surface: "ink",
    pattern: { col: 1, row: 3, cols: 4, rows: 4 },
    image: {
      src: "/portfolio/agri-ugv.jpg",
      alt: "Autonomous agricultural unmanned ground vehicle in crop field",
      tone: "bw",
    },
    public: true,
    case: {
      role: "Field robotics autonomy and perception engineering",
      stack: ["ROS2", "Computer Vision", "Robotics", "Edge Hardware"],
      challenge:
        "Autonomous agricultural vehicles must navigate narrow crop rows without damaging crops while operating reliably across uneven and dusty soil.",
      approach: [
        "Implemented vision-based row detection and obstacle avoidance routines.",
        "Tuned drive-by-wire actuation for low-impact soil traversal and accurate heading control.",
        "Validated continuous operational routines across commercial field environments.",
      ],
      results: [
        { label: "Navigation", value: "Autonomous row tracking" },
        { label: "Domain", value: "Precision agriculture" },
      ],
    },
  },
  {
    slug: "fabsky",
    name: "fabsky",
    summary: "Custom drone fabrication platform and precision airframe engineering.",
    tags: ["Drones", "Fabrication"],
    specs: [
      { label: "Specialization", value: "Custom drone fabrication" },
      { label: "Engineering", value: "Airframe design" },
    ],
    surface: "paper",
    pattern: { col: 2, row: 3, cols: 4, rows: 4 },
    image: {
      src: "/portfolio/fabsky-cad.jpg",
      alt: "Fabsky CAD engineering model of custom drone frame",
      tone: "original",
    },
    public: true,
    case: {
      role: "Airframe engineering, CAD modeling, and custom fabrication",
      stack: ["CAD", "Fabrication", "UAV Engineering", "Composites"],
      challenge:
        "Specialized mission payloads require custom airframe geometries, balanced weight distribution, and durable composite construction.",
      approach: [
        "Modeled mission-specific composite airframe geometries using precision CAD tools.",
        "Fabricated structural components optimized for payload capacity and endurance.",
        "Benchmarked structural stress limits and flight stability.",
      ],
      results: [
        { label: "Output", value: "Custom fabricated airframes" },
        { label: "Integration", value: "Payload-optimized geometry" },
      ],
    },
  },
  {
    slug: "alpr-system",
    name: "alpr-system",
    summary: "AI automatic licence plate recognition system for high-accuracy vehicle identification.",
    tags: ["Vision", "AI"],
    specs: [
      { label: "Technology", value: "Automatic licence plate recognition" },
      { label: "Method", value: "Edge computer vision" },
    ],
    surface: "ink",
    pattern: { col: 0, row: 2, cols: 4, rows: 4 },
    image: {
      src: "/portfolio/alpr-screen.jpg",
      alt: "Automatic licence plate recognition interface display",
      tone: "original",
    },
    public: false, // Mark public: false until confirmed publishable
    case: {
      role: "Computer vision and license plate recognition model development",
      stack: ["Computer Vision", "AI", "Edge Inference"],
      challenge:
        "High-throughput license plate detection requires accurate recognition under variable lighting, motion blur, and non-standard plate formats.",
      approach: [
        "Trained high-speed plate localization and character recognition models.",
        "Optimized inference pipelines for multi-lane camera feeds.",
      ],
      results: [
        { label: "Task", value: "Multi-lane recognition" },
      ],
    },
  },
  {
    slug: "object-tracker",
    name: "object-tracker",
    summary: "Ultra-fast generic object tracker delivering real-time target tracking on constrained hardware.",
    tags: ["Vision", "AI"],
    specs: [
      { label: "Tracking", value: "Generic object tracking" },
      { label: "Throughput", value: "Ultra-fast inference" },
    ],
    surface: "paper",
    pattern: { col: 3, row: 1, cols: 4, rows: 4 },
    public: true,
    case: {
      role: "Model optimization and computer vision tracker architecture",
      stack: ["Computer Vision", "CUDA", "TensorRT", "C++"],
      challenge:
        "High-frame-rate tracking requires maintaining target lock through rapid motion, occlusions, and background clutter on resource-constrained compute.",
      approach: [
        "Designed lightweight correlation and tracking algorithms optimized for edge execution.",
        "Accelerated inference pipelines using CUDA and TensorRT primitives.",
        "Evaluated tracking robustness across diverse video benchmark scenarios.",
      ],
      results: [
        { label: "Performance", value: "Ultra-fast inference" },
        { label: "Capability", value: "Generic multi-target tracking" },
      ],
    },
  },
  {
    slug: "smart-hail-guard",
    name: "smart-hail-guard",
    summary: "IoT sensor deployment spanning 20,000 monitoring stations across the United States.",
    tags: ["IoT", "Deployment"],
    specs: [
      { label: "Scale", value: "20,000 stations" },
      { label: "Region", value: "United States" },
    ],
    surface: "ink",
    pattern: { col: 2, row: 2, cols: 4, rows: 4 },
    public: true,
    case: {
      role: "IoT firmware, edge telemetry, and fleet deployment architecture",
      stack: ["IoT", "Embedded Firmware", "Cellular Telemetry", "Cloud Ingestion"],
      challenge:
        "Deploying and managing 20,000 remote weather monitoring stations across diverse geographies requires ultra-low power consumption and zero-maintenance reliability.",
      approach: [
        "Engineered power-efficient sensor sampling firmware with cellular telemetry routines.",
        "Built over-the-air firmware update mechanisms and distributed health reporting.",
        "Verified long-duration field reliability across extreme operating conditions.",
      ],
      results: [
        { label: "Deployment scale", value: "20,000 stations" },
        { label: "Geography", value: "United States nationwide" },
      ],
    },
  },
  {
    slug: "urban-guard",
    name: "urban-guard",
    summary: "Smart-city platform integrating distributed sensors and intelligent video analytics.",
    tags: ["Smart city", "Platform"],
    specs: [
      { label: "Domain", value: "Smart-city platform" },
      { label: "Analytics", value: "Distributed video analytics" },
    ],
    surface: "paper",
    pattern: { col: 0, row: 3, cols: 4, rows: 4 },
    public: true,
    case: {
      role: "Platform engineering and video analytics integration",
      stack: ["Full-Stack", "Computer Vision", "WebRTC streaming", "Distributed Systems"],
      challenge:
        "Municipal operations require unified ingestion, processing, and alerting across high-throughput urban camera feeds and sensor networks.",
      approach: [
        "Developed scalable ingestion pipelines supporting real-time video stream processing.",
        "Implemented automated event detection and incident notification dashboards.",
        "Benchmarked system responsiveness across concurrent city-scale telemetry feeds.",
      ],
      results: [
        { label: "Scope", value: "City-scale platform" },
        { label: "Integration", value: "Distributed sensors and video feeds" },
      ],
    },
  },
  {
    slug: "vr-mr-simulators",
    name: "vr-mr-simulators",
    summary: "VR/MR flight simulators engineered for the Pakistan Military.",
    tags: ["Simulation", "Defence"],
    specs: [
      { label: "System", value: "VR/MR flight simulator" },
      { label: "Domain", value: "Military pilot training" },
    ],
    surface: "ink",
    pattern: { col: 1, row: 0, cols: 4, rows: 4 },
    public: true,
    case: {
      client: "Confidential",
      role: "Simulation software, cockpit hardware integration, and visual systems",
      stack: ["VR/MR", "Simulation", "Flight Dynamics", "Hardware-in-the-loop"],
      challenge:
        "Military flight training demands immersive mixed-reality visual fidelity, precise aerodynamic modeling, and synchronized physical controls without latency.",
      approach: [
        "Developed high-fidelity terrain generation and flight dynamics simulation modules.",
        "Integrated physical cockpit controls with low-latency mixed reality headsets.",
        "Validated simulation fidelity with military operational specifications.",
      ],
      results: [
        { label: "Application", value: "Flight simulation" },
        { label: "Fidelity", value: "VR/MR mixed reality immersion" },
      ],
    },
  },
];

export const PUBLIC_PROJECTS = PROJECTS.filter((p) => p.public);
export const FEATURED_PROJECTS = PUBLIC_PROJECTS.slice(0, 3);
