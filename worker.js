// Cloudflare Worker. Requires a RESEND_API_KEY secret and verified domain in Resend.
const RECEIVER = "info@oppasmaastricht.nl";
const SENDER = "aanvragen@oppasmaastricht.nl";
const MAX_BODY_BYTES = 12000;
const clean = (value, max) => String(value ?? "").trim().slice(0, max);
const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" }
});
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname !== "/api/contact") return env.ASSETS.fetch(request);
    if (request.method !== "POST") return json({error:"Deze methode is niet toegestaan."}, 405);
    const origin = request.headers.get("Origin");
    if (origin && origin !== url.origin) return json({error:"Ongeldige aanvraag."}, 403);
    if (Number(request.headers.get("Content-Length") || 0) > MAX_BODY_BYTES) return json({error:"Aanvraag is te groot."}, 413);
    if (!env.RESEND_API_KEY) return json({error:"Het formulier is nog niet geactiveerd. Mail ons via info@oppasmaastricht.nl."}, 503);
    let fields;
    try { fields = await request.formData(); } catch { return json({error:"Ongeldig formulier."}, 400); }
    if (clean(fields.get("website"), 100)) return json({ok:true}); // spam trap
    const naam = clean(fields.get("naam"),100);
    const email = clean(fields.get("email"),160);
    const telefoon = clean(fields.get("telefoon"),30);
    const datum = clean(fields.get("datum"),20);
    const tijden = clean(fields.get("tijden"),100);
    const kinderen = Number(fields.get("kinderen"));
    const bericht = clean(fields.get("bericht"),1200);
    if (!naam || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !/^\d{4}-\d{2}-\d{2}$/.test(datum) || !tijden || !Number.isInteger(kinderen) || kinderen < 1 || kinderen > 12 || (telefoon && !/^[+\d\s().]{6,30}$/.test(telefoon))) {
      return json({error:"Controleer de ingevulde gegevens en probeer opnieuw."},400);
    }
    const message = ["Nieuwe oppasaanvraag", "", `Naam: ${naam}`, `E mailadres: ${email}`, `Telefoonnummer: ${telefoon || "Niet ingevuld"}`, `Gewenste datum: ${datum}`, `Gewenste tijden: ${tijden}`, `Aantal kinderen: ${kinderen}`, `Bericht: ${bericht || "Geen bericht"}`].join("\n");
    let response;
    try {
      response = await fetch("https://api.resend.com/emails", {
        method:"POST",
        headers:{"Authorization":`Bearer ${env.RESEND_API_KEY}`,"Content-Type":"application/json"},
        body:JSON.stringify({from:`Oppasservice Maastricht <${SENDER}>`,to:[RECEIVER],reply_to:email,subject:"Nieuwe oppasaanvraag via de website",text:message})
      });
    } catch { return json({error:"Versturen is tijdelijk niet mogelijk. Probeer het later opnieuw of mail ons rechtstreeks."},502); }
    if (!response.ok) {
      console.error("Resend error", response.status, (await response.text()).slice(0,500));
      return json({error:"Versturen is niet gelukt. Mail ons via info@oppasmaastricht.nl."},502);
    }
    return json({ok:true});
  }
};
