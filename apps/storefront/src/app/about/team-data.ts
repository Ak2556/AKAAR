export interface TeamMember {
  name: string;
  slug: string;
  role: string;
  domain: string;
  image: string;
  initials: string;
  bio: string;
  expertise: string[];
  quote: string;
}

export const team: TeamMember[] = [
  {
    name: "Akash Thakur",
    slug: "akash-thakur",
    role: "Founder & Web Developer",
    domain:
      "Leads the vision and builds the digital backbone of AKAAR — from the storefront and quoting engine to the full-stack infrastructure powering the platform.",
    image: "/team/akash-thakur.jpeg",
    initials: "AT",
    bio: "Akash founded AKAAR with a clear mission: eliminate the friction between a digital design and a physical product. As both the visionary and the lead developer, he architected the entire digital platform from scratch — the storefront, the automated quoting engine, the order management pipeline, and the backend infrastructure that ties it all together. He obsesses over deterministic systems, clean interfaces, and making manufacturing accessible to anyone with a CAD file.",
    expertise: [
      "Full-Stack Web Development",
      "Automated Quoting Systems",
      "Platform Architecture",
      "E-Commerce Infrastructure",
      "API Design & Integration",
      "DevOps & Deployment",
    ],
    quote:
      "Manufacturing should be as simple as uploading a file. We're building the infrastructure to make that a reality.",
  },
  {
    name: "Mohit Sherawat",
    slug: "mohit-sherawat",
    role: "Designer",
    domain:
      "Drives the creative direction across products and brand — from CAD optimization and model slicing to visual identity and design systems.",
    image: "/team/mohit-sherawat.jpeg",
    initials: "MS",
    bio: "Mohit is the creative force behind AKAAR's visual identity and product design workflow. He bridges the gap between raw CAD files and production-ready models — optimizing meshes, validating geometry, and configuring slicing parameters for structural integrity. Beyond the technical, Mohit shapes the brand's visual language, ensuring every touchpoint from the website to the packaging reflects AKAAR's commitment to precision and quality.",
    expertise: [
      "CAD Optimization & Mesh Repair",
      "3D Model Slicing & Print Prep",
      "Brand Identity & Visual Design",
      "UI/UX Design",
      "Product Photography",
      "Design Systems",
    ],
    quote:
      "Great design is invisible — it just works. Whether it's a print profile or a landing page, the goal is the same: zero friction.",
  },
  {
    name: "Harish Kumar Meena",
    slug: "harish-kumar-meena",
    role: "Infrastructure & Machine Uptime Specialist",
    domain:
      "Keeps the print farm running at peak performance — managing hardware maintenance, electronics diagnostics, and maximizing machine uptime.",
    image: "/team/harish-kumar-meena.jpeg",
    initials: "HM",
    bio: "Harish is the backbone of AKAAR's physical operations. He manages the entire print farm infrastructure — from routine maintenance and calibration to diagnosing electronics failures and optimizing machine throughput. His deep understanding of 3D printing hardware, stepper drivers, hotend assemblies, and motion systems ensures that every printer in the farm operates at peak reliability. When a machine goes down, Harish gets it back online — fast.",
    expertise: [
      "3D Printer Hardware & Maintenance",
      "Electronics Diagnostics & Repair",
      "Print Farm Management",
      "Machine Calibration & Optimization",
      "Preventive Maintenance Systems",
      "Firmware Configuration",
    ],
    quote:
      "Uptime is everything. Every hour a machine is down is an order delayed. My job is to make sure that doesn't happen.",
  },
  {
    name: "Tarvin Sherawat",
    slug: "tarvin-sherawat",
    role: "Logistics Manager & Video Editor",
    domain:
      "Manages end-to-end supply chain logistics and material procurement while producing video content that showcases AKAAR's capabilities.",
    image: "/team/tarvin-sherawat.jpeg",
    initials: "TS",
    bio: "Tarvin wears two critical hats at AKAAR. On the operations side, he manages the entire supply chain — from sourcing raw materials and filaments to coordinating packaging, shipping, and delivery logistics. On the creative side, he produces the video content that brings AKAAR's story to life — documenting the manufacturing process, creating product showcases, and building the brand's visual presence across platforms.",
    expertise: [
      "Supply Chain & Logistics",
      "Material Procurement",
      "Order Fulfillment & Shipping",
      "Video Production & Editing",
      "Content Strategy",
      "Inventory Management",
    ],
    quote:
      "The best product means nothing if it doesn't reach the customer on time. Logistics is the last mile of quality.",
  },
];

export function getTeamMemberBySlug(slug: string): TeamMember | undefined {
  return team.find((member) => member.slug === slug);
}
