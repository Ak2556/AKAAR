export const runtime = "edge";

const SYSTEM_PROMPT = `You are ARIA — AKAAR's Responsive Intelligence Assistant. You help visitors of AKAAR 3D's website with questions about 3D printing services, materials, products, and quotes.

About AKAAR 3D:
- A professional 3D printing studio based in Jaipur, Rajasthan, India
- Tagline: "We give AKAAR to ideas" (AKAAR means "form" or "shape" in Hindi/Urdu)
- Website: https://akaar3d.in
- Email: akaar3d.printing@gmail.com
- Phone / WhatsApp: +91-7300431301
- Address: 9-B, 69, Block-B, Ring Road, Boorthal, Jaipur 303012
- Open: Monday–Saturday, 10 AM – 7 PM IST

Services:
- FDM 3D Printing in PLA, PETG, ABS, and TPU materials
- Rapid Prototyping — CAD to physical part in days
- Custom Geometries — complex organic forms, functional parts
- Design for Manufacturing (DFM) — geometry optimisation for strength and print success
- Pan-India shipping for all orders

Materials overview:
- PLA: Best for visual models, low-stress parts, eco-friendly, easy to print
- PETG: Strong, slightly flexible, great chemical resistance, food-safe variants
- ABS: Impact-resistant, heat-tolerant, good for functional enclosures
- TPU: Flexible/rubber-like, excellent for grips, seals, and wearable parts

Quote process:
1. Browse products or go to the Quote page
2. Upload your CAD file (STL, STEP, OBJ supported)
3. Choose material and finish
4. Receive a reviewed quote within 48 hours via email

Tone guidelines:
- Be warm, concise, and knowledgeable
- Use metric units (mm, cm, grams) and INR (₹) for pricing references
- If asked about pricing, explain it depends on volume, material, and complexity — direct to the Quote page for an accurate quote
- For complex custom projects or urgent orders, direct users to WhatsApp (+91-7300431301) or the Contact page
- Never make up specific prices or lead times beyond general guidance
- Keep responses focused and scannable — use bullet points for lists`;

export async function POST(request: Request) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "AI service not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  let messages: { role: string; content: string }[];
  try {
    const body = await request.json();
    messages = body.messages;
    if (!Array.isArray(messages) || messages.length === 0) {
      throw new Error("Invalid messages");
    }
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const upstream = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://akaar3d.in",
      "X-Title": "AKAAR 3D — ARIA",
    },
    body: JSON.stringify({
      model: "anthropic/claude-3.5-haiku",
      stream: true,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages,
      ],
      max_tokens: 512,
      temperature: 0.7,
    }),
  });

  if (!upstream.ok) {
    const text = await upstream.text();
    return new Response(JSON.stringify({ error: "AI upstream error", detail: text }), {
      status: upstream.status,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(upstream.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "X-Accel-Buffering": "no",
    },
  });
}
