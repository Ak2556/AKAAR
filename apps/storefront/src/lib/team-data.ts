export interface TeamMember {
  slug: string;
  name: string;
  role: string;
  domain: string;
  image: string;
  bio: string;
  skills: string[];
  social: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    email?: string;
  };
}

export const teamMembers: TeamMember[] = [
  {
    slug: "akash-thakur",
    name: "Akash Thakur",
    role: "AI/ML Engineer & Systems Architect",
    domain: "Core software infrastructure, automated quoting engine algorithms, and the digital storefront",
    image: "/team/akash-thakur.png",
    bio: `Akash is the technical backbone of AKAAR 3D, bringing expertise in artificial intelligence and systems architecture to revolutionize how 3D printing services are delivered. With a passion for building scalable software solutions, he designed and built the automated quoting engine that powers instant pricing for customers.

His work spans the entire digital infrastructure - from the customer-facing storefront to the backend algorithms that calculate print costs based on geometry, material, and complexity. Akash believes in using technology to remove friction from manufacturing processes.

When not coding, Akash explores the latest developments in machine learning and contributes to open-source projects. He's driven by the mission to make professional 3D printing accessible to everyone.`,
    skills: ["Python", "Machine Learning", "Next.js", "System Design", "API Development", "Cloud Architecture", "Data Engineering", "TypeScript"],
    social: {
      linkedin: "https://linkedin.com/in/akash-thakur",
      github: "https://github.com/Ak2556",
      email: "akash@akaar3d.com",
    },
  },
  {
    slug: "mohit-sheravat",
    name: "Mohit Sheravat",
    role: "Lead Industrial Designer",
    domain: "CAD optimization, mesh validation, and model slicing for structural integrity",
    image: "/team/mohit-sheravat.jpeg",
    bio: `Mohit brings years of industrial design experience to AKAAR 3D, ensuring every print meets the highest standards of quality and precision. As Lead Industrial Designer, he oversees the entire design-to-print pipeline, from initial CAD file validation to final slicing optimization.

His expertise in mesh repair and optimization means that even complex geometries are handled with care, resulting in prints that are structurally sound and dimensionally accurate. Mohit works closely with customers to understand their design requirements and provides guidance on design-for-manufacturing best practices.

With a keen eye for detail and a deep understanding of 3D printing constraints, Mohit ensures that every part that leaves the facility meets AKAAR's quality standards.`,
    skills: ["CAD Design", "Mesh Optimization", "3D Modeling", "Slicing Software", "Design for Manufacturing", "Quality Assurance", "SolidWorks", "Fusion 360"],
    social: {
      linkedin: "https://linkedin.com/in/mohit-sheravat",
      email: "mohit@akaar3d.com",
    },
  },
  {
    slug: "harish-kumar-meena",
    name: "Harish Kumar Meena",
    role: "Head of Hardware Infrastructure",
    domain: "Print farm operations, electronics maintenance, and machine uptime maximization",
    image: "/team/harish-kumar-meena.jpeg",
    bio: `Harish is the hands-on expert who keeps AKAAR 3D's print farm running at peak efficiency. As Head of Hardware Infrastructure, he manages the fleet of 3D printers, ensuring maximum uptime and consistent print quality across all machines.

His deep understanding of FDM printing technology - from extruder mechanics to bed leveling systems - allows him to quickly diagnose and resolve issues before they impact production. Harish has implemented preventive maintenance schedules that have significantly reduced machine downtime.

Beyond maintenance, Harish continuously evaluates and tests new hardware, materials, and upgrades to improve print quality and expand AKAAR's capabilities. His technical expertise is crucial to delivering reliable, high-quality prints.`,
    skills: ["3D Printer Maintenance", "FDM Technology", "Electronics Repair", "Print Farm Management", "Quality Control", "Hardware Troubleshooting", "Preventive Maintenance", "Technical Documentation"],
    social: {
      linkedin: "https://linkedin.com/in/harish-kumar-meena",
      email: "harish@akaar3d.com",
    },
  },
  {
    slug: "tarveen-sheravat",
    name: "Tarveen Sheravat",
    role: "Head of Operations & Unit Economics",
    domain: "Supply chain logistics, material procurement, and cost-margin optimization",
    image: "/team/tarveen-sheravat.jpeg",
    bio: `Tarveen drives the operational excellence that makes AKAAR 3D a reliable partner for businesses and individuals alike. As Head of Operations, she manages everything from material procurement to order fulfillment, ensuring smooth end-to-end delivery.

Her analytical approach to unit economics has been instrumental in developing AKAAR's competitive pricing model while maintaining healthy margins. Tarveen has built strong relationships with material suppliers and logistics partners across India.

She oversees the supply chain, inventory management, and shipping operations, working to reduce lead times and improve customer satisfaction. Tarveen's operational expertise ensures that AKAAR can scale efficiently while maintaining service quality.`,
    skills: ["Operations Management", "Supply Chain", "Inventory Management", "Cost Analysis", "Vendor Relations", "Logistics", "Process Optimization", "Project Management"],
    social: {
      linkedin: "https://linkedin.com/in/tarveen-sheravat",
      email: "tarveen@akaar3d.com",
    },
  },
];

export function getTeamMember(slug: string): TeamMember | undefined {
  return teamMembers.find((member) => member.slug === slug);
}

export function getAllTeamSlugs(): string[] {
  return teamMembers.map((member) => member.slug);
}
