OPPASSERVICE MAASTRICHT | RECHTSTREEKS CONTACTFORMULIER

Dit pakket bevat een Cloudflare Worker en de volledige website.
De website toont info@oppasmaastricht.nl en heeft een optioneel telefoonveld.
Het formulier verstuurt rechtstreeks naar de Worker en opent geen mailprogramma.

LET OP: verzending werkt pas NA onderstaande configuratie. Cloudflare Email Routing alleen kan geen mail verzenden.

1. Maak een account aan bij Resend (resend.com). Voeg oppasmaastricht.nl als verzenddomein toe en verifieer de door Resend gevraagde DNS records in Cloudflare. Bewaar de bestaande Cloudflare Email Routing MX records. Resend vraagt doorgaans aparte SPF/DKIM records voor verzenden. Controleer dat alle DNS records correct zijn.
2. Maak in Resend een API key met rechten om e-mails te versturen.
3. Zet de bestanden in je GitHub repository. De map public bevat de website; worker.js en wrangler.toml staan in de hoofdmap.
4. Stel in Cloudflare Worker oppas een secret in met de exacte naam RESEND_API_KEY en als waarde je Resend API key. Plaats de sleutel nooit in GitHub.
5. Deploy deze repository als Cloudflare Worker met Wrangler (bijvoorbeeld npx wrangler deploy). Controleer dat je bestaande custom domain oppasmaastricht.nl aan Worker oppas blijft gekoppeld. Als GitHub auto deploy is ingesteld, controleer de build/deploy instellingen; het uploaden van bestanden alleen is niet altijd voldoende.
6. Test met een echt ingevuld formulier en controleer de ontvangende mailbox en eventuele spammap. Test ook rechtstreeks mail naar info@oppasmaastricht.nl.

VERZENDADRES: aanvragen@oppasmaastricht.nl (geverifieerd domein vereist)
ONTVANGSTADRES: info@oppasmaastricht.nl (Cloudflare Email Routing)

Als de secret of verzendservice niet is ingesteld, toont het formulier een foutmelding en wordt de aanvraag NIET verzonden. De bezoeker kan dan rechtstreeks mailen naar info@oppasmaastricht.nl.

Voor veiligheid: houd toegang tot de mailbox bij een ouder of verzorger. Verwerk aanvragen alleen voor oppasafspraken. Het honeypot veld helpt beperkt tegen spam; voeg bij veel spam Cloudflare Turnstile of rate limiting toe. Publiceer een passend privacybeleid voordat je persoonsgegevens verzamelt.
