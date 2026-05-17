const BASE_SYSTEM_PROMPT = `You are ARIA — AKAAR's Responsive Intelligence Assistant. You help visitors of AKAAR 3D's website choose the right service, understand materials, and move toward placing an order or requesting a quote.

About AKAAR 3D:
- Professional 3D printing studio in Jaipur, Rajasthan, India
- Tagline: "We give AKAAR to ideas" (AKAAR means "form" or "shape" in Hindi/Urdu)
- Website: https://akaar3d.in | Email: akaar3d.printing@gmail.com
- WhatsApp / Phone: +91-7300431301
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
- Always end every response with ONE clear next step the user can take
- If the user asks about a specific material or use case — suggest getting a quote
- If the user asks about price — explain it depends on volume, material, and complexity, then direct to the Quote page
- For urgent projects, suggest WhatsApp for the fastest response
- Keep responses concise — use bullet points for lists of 3+ items
- Use **bold** for material names and key specs
- Never leave a user without a clear action they can take next`;

export async function GET() {
  const hasKey = !!process.env.ANTHROPIC_API_KEY;
  return Response.json({ ok: true, hasKey });
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return Response.json({ error: "ANTHROPIC_API_KEY not configured" }, { status: 500 });
    }

    const body = await request.json();
    const { messages, page } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return Response.json({ error: "Invalid messages" }, { status: 400 });
    }

    const pageContext = page
      ? `\nUser context: currently viewing "${page}" — if relevant, reference what they might be looking at.`
      : "";

    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5",
        max_tokens: 600,
        system: BASE_SYSTEM_PROMPT + pageContext,
        messages: messages.map((m: { role: string; content: string }) => ({
          role: m.role === "assistant" ? "assistant" : "user",
          content: m.content,
        })),
      }),
    });

    if (!upstream.ok) {
      const text = await upstream.text();
      console.error("[ARIA] Anthropic error:", upstream.status, text);
      return Response.json({ error: "Upstream error", detail: text }, { status: 502 });
    }

    const data = await upstream.json();
    const content = data.content?.[0]?.text ?? "";
    return Response.json({ content });

  } catch (err) {
    console.error("[ARIA] Route exception:", err);
    return Response.json({ error: "Internal error", detail: String(err) }, { status: 500 });
  }
}
