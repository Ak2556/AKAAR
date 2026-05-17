export const runtime = "edge";

const BASE_SYSTEM_PROMPT = `You are ARIA — AKAAR's Responsive Intelligence Assistant. You help visitors of AKAAR 3D's website choose the right service, understand materials, and move toward placing an order or requesting a quote.

About AKAAR 3D:
- Professional 3D printing studio in Jaipur, Rajasthan, India
- Tagline: "We give AKAAR to ideas" (AKAAR means "form" or "shape" in Hindi/Urdu)
- Website: https://akaar3d.in | Email: akaar3d.printing@gmail.com
- WhatsApp / Phone: +91-7300431301
- Address: 9-B, 69, Block-B, Ring Road, Boorthal, Jaipur 303012
- Open: Monday–Saturday, 10 AM – 7 PM IST
- No minimum order — single prototypes are welcome
- Lead time: most orders ship in 3–7 business days after quote approval
- Pan-India shipping available

Services:
- FDM 3D Printing in PLA, PETG, ABS, and TPU
- Rapid Prototyping — CAD to physical part in days
- Custom Geometries — complex organic forms, functional parts
- Design for Manufacturing (DFM) — geometry optimisation for printability and strength

Materials guide:
- **PLA**: Best for visual models, display pieces, low-stress parts. Eco-friendly, easiest to print.
- **PETG**: Strong, slightly flexible, excellent chemical resistance. Good for functional parts and food-safe needs.
- **ABS**: Impact-resistant and heat-tolerant. Ideal for enclosures, housings, automotive parts.
- **TPU**: Flexible and rubber-like. Perfect for grips, gaskets, seals, and wearable components.

Quote process:
1. Visit the Quote page or browse Products
2. Upload your CAD file (STL, STEP, or OBJ)
3. Choose material and finish
4. Receive a reviewed quote within 48 hours via email

Conversion rules (follow strictly):
- Always end every response with ONE clear next step the user can take (e.g. "Ready to get started? Head to the Quote page and upload your file.")
- If the user is asking about a specific product, material, or use case — suggest getting a quote for it
- If the user seems hesitant or uncertain — reassure them (no minimums, fast turnaround, reviewed quotes)
- If the user asks about price — explain it depends on volume, material, and complexity, then direct to the Quote page for an accurate number
- For urgent or complex projects, suggest WhatsApp for the fastest response
- Keep responses concise and scannable — use bullet points for lists of 3+ items
- Use **bold** for material names and key specs
- Never leave a user without a clear action they can take next`;

export async function POST(request: Request) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "AI service not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  let messages: { role: string; content: string }[];
  let page: string | undefined;
  try {
    const body = await request.json();
    messages = body.messages;
    page = typeof body.page === "string" ? body.page : undefined;
    if (!Array.isArray(messages) || messages.length === 0) throw new Error("Invalid messages");
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const pageContext = page
    ? `\nUser context: currently viewing "${page}" — if relevant, reference what they might be looking at on that page.`
    : "";

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
        { role: "system", content: BASE_SYSTEM_PROMPT + pageContext },
        ...messages,
      ],
      max_tokens: 600,
      temperature: 0.65,
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
