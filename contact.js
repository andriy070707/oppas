// Vul hier het e mailadres in dat aanvragen ontvangt. Gebruik bij voorkeur een adres dat een ouder of verzorger mede beheert.
const CONTACT_EMAIL = "";

document.getElementById("aanvraagformulier").addEventListener("submit", function(event) {
  event.preventDefault();
  const status = document.getElementById("formstatus");
  if (!CONTACT_EMAIL || !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(CONTACT_EMAIL)) {
    status.textContent = "Aanvragen zijn nog niet ingesteld. Het contactadres moet eerst worden toegevoegd.";
    return;
  }
  const fields = new FormData(this);
  const labels = [["naam","Naam"],["email","E mailadres"],["datum","Datum"],["tijden","Tijden"],["kinderen","Aantal kinderen"],["bericht","Bericht"]];
  const body = labels.map(([key,label]) => label + ": " + (fields.get(key) || "")).join("\\n");
  const subject = "Oppasaanvraag via oppasmaastricht.nl";
  status.textContent = "Je e mailprogramma wordt geopend. Controleer het bericht en klik daar op verzenden.";
  window.location.href = "mailto:" + CONTACT_EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
});
