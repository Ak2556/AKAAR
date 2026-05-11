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
    instagram?: string;
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
    bio: `Akash started AKAAR 3D after spending time building software and noticing that getting physical parts made was harder than it needed to be. He handles the technical side of the studio — the ordering platform, backend infrastructure, and product development. His background is in software engineering and AI/ML, applied here to build systems that make the quote-to-delivery process clearer for customers.

He also sets the direction for what AKAAR builds next. Mohit handles design and file review, Harish keeps the machines running, and Tarveen manages procurement and fulfillment. Together the four of them run the whole operation out of a studio in Jaipur.`,
    skills: ["Leadership", "Product Strategy", "Python", "Machine Learning", "Next.js", "System Design", "API Development", "Cloud Architecture", "Business Development", "TypeScript"],
    social: {
      linkedin: "https://www.linkedin.com/in/akash-thakur-dev/",
      instagram: "https://www.instagram.com/akash___thakur07/?__pwa=1",
      github: "https://github.com/Ak2556",
      email: "akaar3d.printing@gmail.com",
    },
    isFounder: true,
    founderVision: "I started AKAAR 3D because getting parts made in India was unnecessarily hard — unclear pricing, no feedback on files, and no way to know if your order was on track. We built a system that fixes that: clear quotes, file review before printing, and a team you can actually reach.",
  },
  {
    slug: "mohit-sherawat",
    name: "Mohit Sherawat",
    role: "Lead Industrial Designer",
    domain: "CAD optimization, mesh validation, and model slicing for structural integrity",
    image: "/team/mohit-sherawat.jpeg",
    bio: `Mohit reviews every file that comes through — checking geometry, wall thickness, and print orientation before anything goes to the machine. He's worked with CAD for years and knows which designs will print cleanly and which will cause problems halfway through a build. If your file needs changes, he'll tell you exactly what and why, not just reject it.`,
    skills: ["CAD Design", "Mesh Optimization", "3D Modeling", "Slicing Software", "Design for Manufacturing", "Quality Assurance", "SolidWorks", "Fusion 360"],
    social: {
      linkedin: "https://linkedin.com/in/mohit-sherawat",
      instagram: "https://www.instagram.com/__.mayank.__001?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
      email: "akaar3d.printing@gmail.com",
    },
  },
  {
    slug: "harish-kumar-meena",
    name: "Harish Kumar Meena",
    role: "Head of Hardware Infrastructure",
    domain: "Print farm operations, electronics maintenance, and machine uptime maximization",
    image: "/team/harish-kumar-meena.jpeg",
    bio: `Harish keeps the print farm running. That means calibration, maintenance schedules, bed leveling, extruder tuning — the physical work that determines whether a 10-hour print finishes cleanly or fails at hour 9. He manages machine uptime day-to-day and handles hardware issues before they affect customer orders going out the door.`,
    skills: ["3D Printer Maintenance", "FDM Technology", "Electronics Repair", "Print Farm Management", "Quality Control", "Hardware Troubleshooting", "Preventive Maintenance", "Technical Documentation"],
    social: {
      linkedin: "https://linkedin.com/in/harish-kumar-meena",
      email: "akaar3d.printing@gmail.com",
    },
  },
  {
    slug: "tarveen-sherawat",
    name: "Tarveen Sherawat",
    role: "Head of Operations & Unit Economics",
    domain: "Supply chain logistics, material procurement, and cost-margin optimization",
    image: "/team/tarveen-sherawat.jpeg",
    bio: `Tarveen manages procurement, inventory, and order fulfillment. She tracks material stock, coordinates with shipping partners, and handles the operational side of getting orders out the door on time. Her cost work keeps pricing honest while the studio stays sustainable — sourcing the right filament at the right volumes so customers aren't paying for inefficiency.`,
    skills: ["Operations Management", "Supply Chain", "Inventory Management", "Cost Analysis", "Vendor Relations", "Logistics", "Process Optimization", "Project Management"],
    social: {
      linkedin: "https://linkedin.com/in/tarveen-sherawat",
      instagram: "https://www.instagram.com/__sherawat.shaab?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
      email: "akaar3d.printing@gmail.com",
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

// Add real customer testimonials here as they come in.
export const testimonials: Testimonial[] = [];

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
