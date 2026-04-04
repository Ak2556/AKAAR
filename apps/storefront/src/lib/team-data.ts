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
  isFounder?: boolean;
  founderVision?: string;
}

export const teamMembers: TeamMember[] = [
  {
    slug: "akash-thakur",
    name: "Akash Thakur",
    role: "Founder & CEO",
    domain: "Vision, Strategy, Technology & Product Leadership",
    image: "/team/akash-thakur.png",
    bio: `Akash is the visionary founder behind AKAAR 3D. What started as a simple observation—that local manufacturing was broken by friction, opacity, and inconsistency—became a mission to build something better. He assembled the team, defined the vision, and leads every aspect of the company from technology to strategy.

As both the technical architect and business leader, Akash wears multiple hats. He personally designed and built the automated quoting engine, the customer-facing storefront, and the backend infrastructure that powers AKAAR's operations. His background in AI/ML and systems architecture enables him to solve complex problems at the intersection of software and manufacturing.

Beyond code, Akash sets the company's direction, builds partnerships, and ensures every team member is aligned with the mission: to make professional 3D printing accessible to everyone. He brought together Mohit, Harish, and Tarveen—each an expert in their domain—to create a team capable of delivering on this ambitious vision.

When he's not leading AKAAR, Akash explores cutting-edge developments in machine learning and contributes to open-source projects. He believes that the future of manufacturing is digital-first, and AKAAR 3D is just the beginning.`,
    skills: ["Leadership", "Product Strategy", "Python", "Machine Learning", "Next.js", "System Design", "API Development", "Cloud Architecture", "Business Development", "TypeScript"],
    social: {
      linkedin: "https://linkedin.com/in/akash-thakur",
      github: "https://github.com/Ak2556",
      email: "akash@akaar3d.com",
    },
    isFounder: true,
    founderVision: "I started AKAAR 3D because I saw a broken system—manual quoting, inconsistent quality, and endless friction that slowed down innovators. We're not just a 3D printing service; we're building the infrastructure for the next generation of hardware creators. Every engineer, every startup, every maker deserves access to manufacturing that just works.",
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

// Testimonials
export interface Testimonial {
  id: string;
  name: string;
  company: string;
  role: string;
  quote: string;
  rating: number;
  avatar?: string;
  project?: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Rahul Sharma",
    company: "TechStart Innovations",
    role: "Founder & CTO",
    quote: "AKAAR 3D transformed our prototyping workflow. What used to take weeks now takes days. Their instant quoting system is a game-changer for hardware startups like ours.",
    rating: 5,
    project: "IoT Device Housing",
  },
  {
    id: "2",
    name: "Priya Patel",
    company: "DesignWorks Studio",
    role: "Lead Product Designer",
    quote: "The print quality is exceptional. We've tried multiple vendors, but AKAAR's attention to detail and consistent results keep us coming back. The team actually understands design intent.",
    rating: 5,
    project: "Consumer Electronics Prototype",
  },
  {
    id: "3",
    name: "Vikram Reddy",
    company: "MechSolutions",
    role: "Engineering Manager",
    quote: "Finally, a 3D printing service that gets manufacturing right. Fast turnaround, accurate quotes, and parts that fit perfectly every time. Our go-to for functional prototypes.",
    rating: 5,
    project: "Industrial Fixtures",
  },
  {
    id: "4",
    name: "Ananya Krishnan",
    company: "Robotics Lab IIT",
    role: "Research Lead",
    quote: "For our robotics research, precision is non-negotiable. AKAAR delivers parts with tolerances that actually match the specs. Great communication and technical expertise.",
    rating: 5,
    project: "Custom Robot Components",
  },
  {
    id: "5",
    name: "Sanjay Mehta",
    company: "AutoParts India",
    role: "Procurement Head",
    quote: "We needed 200+ custom jigs for our assembly line. AKAAR handled the volume, maintained quality, and delivered on time. Their platform made ordering at scale surprisingly easy.",
    rating: 5,
    project: "Assembly Line Jigs",
  },
];

// Projects for gallery
export interface Project {
  id: string;
  title: string;
  category: "industrial" | "prototypes" | "custom" | "consumer";
  image: string;
  description: string;
  client?: string;
  material?: string;
  printTime?: string;
}

export const projects: Project[] = [
  {
    id: "1",
    title: "Drone Frame Components",
    category: "prototypes",
    image: "/projects/drone-frame.jpg",
    description: "Lightweight structural components for a custom racing drone, optimized for strength-to-weight ratio.",
    material: "Carbon-filled PETG",
    printTime: "12 hours",
  },
  {
    id: "2",
    title: "Industrial Gripper Assembly",
    category: "industrial",
    image: "/projects/gripper.jpg",
    description: "Custom end-effector for robotic arm with integrated sensor mounts and cable routing.",
    client: "Automation Solutions",
    material: "ABS",
    printTime: "8 hours",
  },
  {
    id: "3",
    title: "Medical Device Housing",
    category: "consumer",
    image: "/projects/medical-device.jpg",
    description: "Ergonomic enclosure for a portable health monitoring device with snap-fit assembly.",
    material: "PLA",
    printTime: "6 hours",
  },
  {
    id: "4",
    title: "Custom Lamp Collection",
    category: "custom",
    image: "/projects/lamp.jpg",
    description: "Geometric lampshades with intricate patterns, designed for ambient lighting.",
    material: "White PLA",
    printTime: "15 hours",
  },
  {
    id: "5",
    title: "Automotive Test Fixtures",
    category: "industrial",
    image: "/projects/fixture.jpg",
    description: "Precision alignment fixtures for quality control in automotive component testing.",
    client: "AutoTech Labs",
    material: "ASA",
    printTime: "10 hours",
  },
  {
    id: "6",
    title: "Smart Home Hub",
    category: "consumer",
    image: "/projects/smart-hub.jpg",
    description: "Sleek enclosure for IoT home automation controller with ventilation and mounting options.",
    material: "PETG",
    printTime: "5 hours",
  },
];
