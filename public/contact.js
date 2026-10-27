const form = document.getElementById("aanvraagformulier");
const status = document.getElementById("formstatus");
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const button = form.querySelector('button[type="submit"]');
  button.disabled = true;
  status.textContent = "Je aanvraag wordt verstuurd...";
  try {
    const response = await fetch("/api/contact", {
      method: "POST",
      body: new FormData(form),
      headers: { "Accept": "application/json" }
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Versturen is niet gelukt.");
    status.textContent = "Bedankt voor je aanvraag! We hebben je bericht ontvangen en nemen zo spoedig mogelijk contact met je op.";
    form.reset();
  } catch (error) {
    status.textContent = error.message || "Versturen is niet gelukt. Mail ons via info@oppasmaastricht.nl.";
  } finally {
    button.disabled = false;
  }
});
