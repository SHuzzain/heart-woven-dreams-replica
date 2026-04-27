const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface RsvpPayload {
  name: string;
  attending: "yes" | "no";
  message?: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const RSVP_TO_EMAIL = Deno.env.get("RSVP_TO_EMAIL") ?? "venkatesanben0@gmail.com";
    const RSVP_FROM_EMAIL =
      Deno.env.get("RSVP_FROM_EMAIL") ?? "Wedding RSVP <onboarding@resend.dev>";

    if (!RESEND_API_KEY) {
      return new Response(
        JSON.stringify({ error: "RESEND_API_KEY is not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const body = (await req.json()) as RsvpPayload;
    const name = (body.name || "").trim().slice(0, 200);
    const attending = body.attending;
    const message = (body.message || "").trim().slice(0, 4000);

    if (!name || (attending !== "yes" && attending !== "no")) {
      return new Response(
        JSON.stringify({ error: "Invalid input" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const subject = `Wedding RSVP — ${name} (${attending === "yes" ? "Attending" : "Not Attending"})`;
    const html = `
      <div style="font-family: Georgia, 'Times New Roman', serif; max-width:560px; margin:0 auto; padding:24px; color:#3a2a1f;">
        <h2 style="font-weight:normal; font-size:22px; margin:0 0 12px;">New RSVP — Venkatesan & Pavithra</h2>
        <p style="margin:0 0 8px;"><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p style="margin:0 0 8px;"><strong>Attending:</strong> ${attending === "yes" ? "Joyfully Accepts" : "Regretfully Declines"}</p>
        ${message ? `<p style="margin:16px 0 4px;"><strong>Message:</strong></p><p style="margin:0; white-space:pre-wrap; line-height:1.5;">${escapeHtml(message)}</p>` : ""}
        <hr style="border:none; border-top:1px solid #e8d9c4; margin:24px 0;" />
        <p style="font-size:12px; color:#8a7a6a;">Sent from your wedding website.</p>
      </div>
    `;

    console.log("send-rsvp invoked", {
      from: RSVP_FROM_EMAIL,
      to: RSVP_TO_EMAIL,
      attending,
      hasMessage: Boolean(message),
    });

    const resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: RSVP_FROM_EMAIL,
        to: [RSVP_TO_EMAIL],
        subject,
        html,
        reply_to: RSVP_TO_EMAIL,
      }),
    });

    const rawText = await resp.text();
    let data: Record<string, unknown> = {};
    try {
      data = rawText ? JSON.parse(rawText) : {};
    } catch {
      data = { raw: rawText };
    }

    if (!resp.ok) {
      console.error("Resend rejected request", {
        status: resp.status,
        statusText: resp.statusText,
        body: data,
        from: RSVP_FROM_EMAIL,
        to: RSVP_TO_EMAIL,
      });
      const message = (data as { message?: string })?.message ?? "Email provider rejected the request";
      return new Response(
        JSON.stringify({ error: message, status: resp.status, details: data }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    console.log("Resend accepted email", { id: (data as { id?: string })?.id });

    return new Response(JSON.stringify({ success: true, id: data?.id ?? null }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("send-rsvp error:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
