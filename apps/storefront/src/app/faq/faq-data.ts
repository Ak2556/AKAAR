export interface FaqItem {
  category: string;
  question: string;
  answer: string;
}

export const faqCategories = [
  { id: "all",       label: "All Questions" },
  { id: "ordering",  label: "Ordering"      },
  { id: "shipping",  label: "Shipping"      },
  { id: "materials", label: "Materials"     },
  { id: "technical", label: "Technical"     },
  { id: "pricing",   label: "Pricing"       },
];

export const faqs: FaqItem[] = [
  {
    category: "ordering",
    question: "What file formats do you accept?",
    answer: "We accept a wide range of 3D file formats including STL, OBJ, STEP, IGES, 3MF, and FBX. For best results, we recommend STL or STEP files. If you have a different format, please contact us and we'll do our best to accommodate your needs.",
  },
  {
    category: "ordering",
    question: "What is the minimum order quantity?",
    answer: "There is no minimum order quantity. We accept orders starting from just 1 unit. However, for larger quantities, we offer volume discounts that can significantly reduce your per-unit cost.",
  },
  {
    category: "ordering",
    question: "How do I get a quote for my project?",
    answer: "You can get an instant quote by uploading your 3D files on our Quote page. For complex projects or custom requirements, our engineering team will review your files and provide a detailed quote within 24 hours.",
  },
  {
    category: "shipping",
    question: "How long does production take?",
    answer: "Production time depends on the complexity of your parts and the chosen manufacturing process. Typical lead times are 3-5 business days for standard orders. Rush orders with 24-48 hour turnaround are available for an additional fee.",
  },
  {
    category: "shipping",
    question: "Do you ship internationally?",
    answer: "Yes, we ship worldwide. International shipping typically takes 5-10 business days depending on the destination. We use trusted carriers like DHL, FedEx, and UPS with full tracking and insurance.",
  },
  {
    category: "shipping",
    question: "Can I track my order?",
    answer: "Absolutely! Once your order ships, you'll receive an email with tracking information. You can also track your order status through your account dashboard or by contacting our support team.",
  },
  {
    category: "materials",
    question: "What materials are available for 3D printing?",
    answer: "We offer a wide range of materials including PLA, ABS, PETG, Nylon (PA12), TPU (flexible), and various resins for SLA printing. For industrial applications, we also offer carbon fiber reinforced materials and metal printing options.",
  },
  {
    category: "materials",
    question: "How do I choose the right material?",
    answer: "Material selection depends on your application requirements. Consider factors like mechanical strength, temperature resistance, flexibility, and surface finish. Our engineering team can help recommend the best material for your specific use case.",
  },
  {
    category: "materials",
    question: "Do you offer custom colors?",
    answer: "Yes! We can produce parts in a variety of colors depending on the material. For specific color matching (Pantone, RAL), we offer painting and finishing services. Contact us with your color requirements for a custom quote.",
  },
  {
    category: "technical",
    question: "What tolerances can you achieve?",
    answer: "Our standard tolerance is ±0.1mm for most processes. For high-precision applications, we can achieve tolerances as tight as ±0.05mm with SLA or CNC machining. Please specify your tolerance requirements when requesting a quote.",
  },
  {
    category: "technical",
    question: "Can you help optimize my design for manufacturing?",
    answer: "Yes, our engineering team offers Design for Manufacturing (DFM) analysis as part of our service. We'll review your design and suggest modifications to improve printability, reduce costs, and ensure the best possible outcome.",
  },
  {
    category: "technical",
    question: "What is the maximum part size you can produce?",
    answer: "Our maximum build size varies by technology. For FDM printing, we can produce parts up to 500mm x 500mm x 500mm. For larger parts, we can print in sections and assemble. Contact us for oversized projects.",
  },
  {
    category: "pricing",
    question: "How is pricing calculated?",
    answer: "Pricing is based on several factors: material volume, complexity, surface area, chosen material, and post-processing requirements. Our instant quote system calculates this automatically. Volume discounts are available for larger orders.",
  },
  {
    category: "pricing",
    question: "Do you offer volume discounts?",
    answer: "Yes! We offer tiered pricing for larger quantities. Discounts typically start at 10+ units and increase with volume. For production runs of 100+ units, contact our sales team for custom pricing.",
  },
  {
    category: "pricing",
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers. For business accounts, we also offer NET 30 payment terms upon approval.",
  },
];
