// ============================================================
//  script.js — All JavaScript-logikk for HelpDesk
//
//  Innhold:
//    1. Hjelpefunksjoner (brukes av flere deler av koden)
//    2. localStorage – lagre og hente saker
//    3. Forside – statistikk-tellere
//    4. Forside – sakstabell
//    5. Saker-side – vise saker som kort
//    6. Saker-side – filtrering og søk
//    7. Ny-sak – skjema med validering og innsending
// ============================================================


// ══════════════════════════════════════════════
//  1. HJELPEFUNKSJONER
//
//  Små funksjoner som brukes flere steder.
//  Ved å samle dem her unngår vi å skrive samme kode to ganger.
// ══════════════════════════════════════════════

/**
 * Returnerer riktig CSS-klasse for et status-merke.
 *
 * switch er som en rekke if/else if – den sjekker hvilken
 * verdi "status" har og returnerer riktig klasse.
 * Disse klassene er definert i style.css.
 */
function statusKlasse(status) {
  switch (status) {
    case "åpen":     return "status-åpen";
    case "pågående": return "status-pågående";
    case "løst":     return "status-løst";
    default:         return ""; // Ukjent status får ingen klasse
  }
}


function prioritetKlasse(prioritet) {
  switch (prioritet) {
    case "lav":     return "prioritet-lav";
    case "medium":  return "prioritet-medium";
    case "høy":     return "prioritet-høy";
    case "kritisk": return "prioritet-kritisk";
    default:        return "";
  }
}


/**
 * Gjør om en ISO-datostreng (YYYY-MM-DD) til norsk format (DD.MM.YYYY).
 *
 * Eksempel: "2026-03-08" → "08.03.2026"
 *
 * split("-") deler strengen på bindestrek og gir en array: ["2026", "03", "08"]
 * Vi plukker ut elementene med destrukturering: const [år, måned, dag] = ...
 * Template literal (backtick) lar oss sette inn variablene i strengen.
 */
function formaterDato(isoStreng) {
  const [år, måned, dag] = isoStreng.split("-");
  return `${dag}.${måned}.${år}`;
}

/**
 * Genererer et tilfeldig saksnummer på formatet SAK-XXXXX.
 *
 * Math.random() gir et tall mellom 0 og 1 (f.eks. 0.7432...)
 * * 90000 gir 0 til 90000
 * + 10000 gir 10000 til 100000
 * Math.floor() runder ned til nærmeste heltall
 * Resultatet: et tall mellom 10000 og 99999
 */
function genererSaksnummer() {
  return "SAK-" + Math.floor(10000 + Math.random() * 90000);
}


// ══════════════════════════════════════════════
//  2. LOCALSTORAGE – LAGRE OG HENTE DATA
//
//  localStorage er nettleserens innebygde lagringsmekanisme.
//  Data overlever side-refresh, men slettes ved tømming av nettleserdata.
//
//  API-et (funksjonene vi bruker):
//    localStorage.setItem("nøkkel", "verdi")  – lagre
//    localStorage.getItem("nøkkel")            – hente (returnerer null hvis ikke funnet)
//
//  Merk: localStorage kan BARE lagre tekst (strenger).
//  Derfor bruker vi JSON.stringify() og JSON.parse() for å
//  konvertere mellom JavaScript-objekter og tekst.
//
//  JSON (JavaScript Object Notation) er et tekstformat for data.
//  Eksempel:
//    JavaScript-array:  [{ id: 7, tittel: "Problem" }]
//    JSON-streng:       '[{"id":7,"tittel":"Problem"}]'
// ══════════════════════════════════════════════

/**
 * Henter alle saker: testdata fra data.js + brukerens egne fra localStorage.
 *
 * Vi slår sammen med spread-operatoren (...).
 * [...SAKER, ...lagretsaker] lager en ny array med alle elementene fra begge.
 */
function hentAlleSaker() {
  const lagretTekst  = localStorage.getItem("helpdesk-saker") || "[]"
  const lagredeSaker = JSON.parse(lagretTekst)
  return [...SAKER, ...lagredeSaker]
}

/**
 * Lagrer én ny sak til localStorage uten å overskrive eksisterende saker.
 *
 * Fremgangsmåten:
 *   1. Hent det som allerede er lagret (som array)
 *   2. Legg til den nye saken
 *   3. Skriv hele arrayen tilbake som tekst
 */
function lagreNySak(sak) {
  // Steg 1: Hent eksisterende saker (eller tom array hvis ingen finnes)
  const lagretTekst  = localStorage.getItem("helpdesk-saker") || "[]";
  const lagredeSaker = JSON.parse(lagretTekst);

  // Steg 2: Legg til den nye saken i arrayen
  lagredeSaker.push(sak);

  // Steg 3: Konverter tilbake til tekst og lagre
  // JSON.stringify(array) → tekststreng
  localStorage.setItem("helpdesk-saker", JSON.stringify(lagredeSaker));
}


// ══════════════════════════════════════════════
//  3. FORSIDE – STATISTIKK-TELLERE
//
//  Oppdaterer de tre kortene på forsiden med riktig antall.
//  Kalles én gang når siden laster.
// ══════════════════════════════════════════════

function oppdaterStatistikk() {
  // Hent alle saker (inkl. localStorage) for å telle riktig
  const alle = hentAlleSaker();

  // filter() lager en ny array med bare elementene som matcher betingelsen.
  // .length gir antall elementer i den filtrerte arrayen.
  const antallÅpne     = alle.filter(s => s.status === "åpen").length;
  const antallLøste    = alle.filter(s => s.status === "løst").length;
  const antallPågående = alle.filter(s => s.status === "pågående").length;

  // document.getElementById() finner HTML-elementet med det gitte id-et.
  // Vi bruker optional chaining (?.) fordi disse elementene bare finnes
  // på forsiden – på andre sider ville koden krasjet uten ?. siden
  // getElementById() ville returnert null.
  //
  // null?.textContent ville kastet feil, men null?.textContent er bare undefined.
  const elÅpne     = document.getElementById("åpne-saker");
  const elLøste    = document.getElementById("løste-saker");
  const elPågående = document.getElementById("pågående-saker");

  // Oppdater teksten i elementet (bare hvis elementet finnes på denne siden)
  if (elÅpne)     elÅpne.textContent     = antallÅpne;
  if (elLøste)    elLøste.textContent    = antallLøste;
  if (elPågående) elPågående.textContent = antallPågående;
}

// Kall funksjonen med en gang scriptet lastes
oppdaterStatistikk();


// ══════════════════════════════════════════════
//  4. FORSIDE – SAKSTABELL
//
//  Fyller inn de 5 nyeste sakene i tabellen på forsiden.
// ══════════════════════════════════════════════

// Finn tbody-elementet i tabellen.
// Denne er null på alle andre sider enn index.html.
const sakListe = document.getElementById("sak-liste");

if (sakListe) {
  // slice(-5) henter de 5 siste elementene fra arrayen.
  //   Negativt tall i slice() teller fra slutten.
  //   slice(-5) = de siste 5 elementene
  // .reverse() snur rekkefølgen så nyeste vises øverst.
  //   Merk: reverse() endrer den opprinnelige arrayen, men siden
  //   slice() allerede laget en kopi er det trygt her.
  const sisteSaker = SAKER.slice(-5).reverse();

  // forEach() kjører en funksjon for hvert element i arrayen.
  // "sak" er det gjeldende elementet i hver iterasjon.
  sisteSaker.forEach(sak => {
    // Lag et nytt <tr> (table row) element i minnet
    const rad = document.createElement("tr");

    // Sett HTML-innholdet i raden med en template literal.
    // Template literals bruker backticks (`) og ${} for variabelinnsetting.
    rad.innerHTML = `
      <td>${sak.id}</td>
      <td>${sak.tittel}</td>
      <td>${sak.kategori}</td>
      <td>
        <span class="status-badge ${statusKlasse(sak.status)}">
          ${sak.status}
        </span>
      </td>
      <td>${formaterDato(sak.dato)}</td>
    `;

    // Legg raden til i tabellen
    sakListe.appendChild(rad);
  });
}


// ══════════════════════════════════════════════
//  5. SAKER-SIDE – VISE SAKER SOM KORT
//
//  Denne funksjonen tar en array med saker og viser dem
//  som kort i #alle-saker-containeren.
//
//  Den kalles av filtrerOgVis() hver gang filteret endres.
// ══════════════════════════════════════════════

function visAlleSaker(saker) {
  const container = document.getElementById("alle-saker");
  if (!container) return; // Ikke på saker.html – avslutt funksjonen

  // Tøm containeren. innerHTML = "" fjerner alt innhold.
  // Dette er nødvendig fordi vi tegner listen på nytt ved hvert filter-kall.
  container.innerHTML = "";

  // Oppdater treff-telleren
  const teller = document.getElementById("treff-teller");
  if (teller) {
    teller.textContent = `Viser ${saker.length} av ${hentAlleSaker().length} saker`;
  }
  
  // Vis en melding hvis ingen saker matcher filteret
  if (saker.length === 0) {
    container.innerHTML = "<p style='color:#64748b; margin-top: 1rem;'>Ingen saker funnet.</p>";
    return;
  }

  // Lag ett sak-kort per sak
saker.forEach(sak => {
    const kort = document.createElement("div");
    kort.className = "sak-kort";
    kort.innerHTML = `
      <div class="sak-kort-info">
        <h3>${sak.tittel}</h3>
        <p class="sak-kort-meta">
        Kategori: <strong>${sak.kategori}</strong> ·
          ${formaterDato(sak.dato)}
        </p>
      </div>
      <div style="display:flex; flex-direction:column; align-items:flex-end; gap:8px;">
        <span class="status-badge ${statusKlasse(sak.status)}">${sak.status}</span>
        <span class="prioritet-badge ${prioritetKlasse(sak.prioritet)}">${sak.prioritet}</span>
        <button class="btn-endre-prioritet" onclick="endrePrioritet(${sak.id})">
          Endre prioritet
        </button>
      </div>
    `;
    container.appendChild(kort);
  });
}


// ══════════════════════════════════════════════
//  6. SAKER-SIDE – KOMBINERT FILTRERING OG SØK
//
//  En enkelt funksjon som håndterer status-filter,
//  kategori-filter og fritekst-søk på én gang.
//
//  Fordelen med én felles funksjon: alle filtre samvirker.
//  Hvis vi hadde tre separate funksjoner ville ett filter
//  overskrive et annet.
// ══════════════════════════════════════════════

function filtrerOgVis() {
  // Hent valgte verdier fra de to dropdown-menyene.
  // ?. (optional chaining) betyr: "hvis elementet finnes, hent .value, ellers undefined"
  // || "alle" betyr: "hvis verdien er undefined, bruk 'alle' som standard"
  const statusValg   = document.getElementById("filter-status")?.value   || "alle";
  const kategoriValg = document.getElementById("filter-kategori")?.value || "alle";

  // Hent søketekst og gjør den til lowercase (små bokstaver).
  // .trim() fjerner mellomrom i starten og slutten av teksten.
  const søkeTekst = document.getElementById("søk-input")?.value.toLowerCase().trim() || "";

  // Start med ALLE saker (testdata + localStorage)
  let resultat = hentAlleSaker();

  // Filtrer på status (hvis ikke "alle" er valgt)
  // filter() lager en NY array – den endrer ikke originalen.
  // Vi overskriver "resultat" med den filtrerte versjonen.
  if (statusValg !== "alle") {
    resultat = resultat.filter(sak => sak.status === statusValg);
  }

  // Filtrer videre på kategori (på den allerede status-filtrerte listen)
  if (kategoriValg !== "alle") {
    resultat = resultat.filter(sak => sak.kategori === kategoriValg);
  }

  // Filtrer videre med fritekst-søk
  // includes() returnerer true hvis strengen inneholder søketeksten.
  // Vi kjører toLowerCase() på begge for å gjøre søket case-insensitivt.
  // || mellom de to betingelsene betyr at saken vises hvis EN av dem er true.
  if (søkeTekst !== "") {
    resultat = resultat.filter(sak =>
      sak.tittel.toLowerCase().includes(søkeTekst) ||
      sak.beskrivelse.toLowerCase().includes(søkeTekst)
    );
  }
const sorterValg = document.getElementById("sorter-prioritet")?.value || "ingen";
  const prioritetVerdi = { kritisk: 4, høy: 3, medium: 2, lav: 1 };

  if (sorterValg === "høy-først") {
    resultat = [...resultat].sort((a, b) => prioritetVerdi[b.prioritet] - prioritetVerdi[a.prioritet]);
  } else if (sorterValg === "lav-først") {
    resultat = [...resultat].sort((a, b) => prioritetVerdi[a.prioritet] - prioritetVerdi[b.prioritet]);
  }
  // Vis det endelige resultatet
  visAlleSaker(resultat);
}

// Kjør filtreringen med en gang saker.html laster (for å vise alle saker)
if (document.getElementById("alle-saker")) {
  filtrerOgVis();
}

// Lytt på endringer i filter-dropdown-menyene.
document.getElementById("filter-status")?.addEventListener("change", filtrerOgVis);
document.getElementById("filter-kategori")?.addEventListener("change", filtrerOgVis);
document.getElementById("sorter-prioritet")?.addEventListener("change", filtrerOgVis);

// Søkeknapp: filtrer når brukeren klikker
document.getElementById("søk-btn")?.addEventListener("click", filtrerOgVis);

// Live-søk: filtrer mens brukeren skriver (ikke bare ved knappetrykk).
document.getElementById("søk-input")?.addEventListener("input", filtrerOgVis);

function endrePrioritet(sakId) {
  const rekkefølge = ["lav", "medium", "høy", "kritisk"];
  const sak = SAKER.find(s => s.id === sakId);
  if (sak) {
    const nåværendeIndex = rekkefølge.indexOf(sak.prioritet);
    const nesteIndex     = (nåværendeIndex + 1) % rekkefølge.length;
    sak.prioritet        = rekkefølge[nesteIndex];
    filtrerOgVis();
  }
}

// ══════════════════════════════════════════════
//  7. NY SAK – SKJEMA MED VALIDERING OG INNSENDING
//
//  Validering betyr å sjekke at dataene er korrekte FØR vi bruker dem.
//
//  God validering:
//    ✅ Peker på HVILKET felt som er feil
//    ✅ Viser melding I selve siden (ikke alert())
//    ✅ Lar brukeren rette opp og prøve igjen
//    ✅ Skjuler feilmeldingen igjen når brukeren begynner å rette
// ══════════════════════════════════════════════

// Finn skjema-elementet. Dette er null på alle sider unntatt ny-sak.html.
const nySakForm = document.getElementById("ny-sak-form");

if (nySakForm) {

  // ── Skjul feilmeldingen igjen når brukeren begynner å skrive ──
  // "input"-hendelsen utløses for hvert tastetrykk i feltet.
  document.getElementById("epost")?.addEventListener("input", () => {
    // classList.add() legger til en CSS-klasse
    document.getElementById("epost-feil")?.classList.add("hidden");
    // classList.remove() fjerner en CSS-klasse
    document.getElementById("epost")?.classList.remove("feil");
  });

  // ── Lytt på skjema-innsending ──
  // "submit"-hendelsen utløses når brukeren klikker "Send inn"
  // eller trykker Enter i et felt.
  nySakForm.addEventListener("submit", (event) => {

    // event.preventDefault() stopper nettleserens standard oppførsel,
    // som ville vært å sende skjemaet til en server og laste siden på nytt.
    // Vi vil håndtere innsendingen selv med JavaScript.
    event.preventDefault();

    // ── Hent verdier fra alle skjemafelt ──
    // .value henter teksten i et input-felt eller valgt verdi i en select.
    // .trim() fjerner unødvendige mellomrom (f.eks. hvis brukeren tastet space)
    const navn        = document.getElementById("navn").value.trim();
    const epost       = document.getElementById("epost").value.trim();
    const tittel      = document.getElementById("tittel").value.trim();
    const kategori    = document.getElementById("kategori").value;
    const prioritet   = document.getElementById("prioritet").value;
    const beskrivelse = document.getElementById("beskrivelse").value.trim();
    // .checked gir true/false for en avkrysningsboks
    const samtykke    = document.getElementById("samtykke").checked;

    // ── VALIDERING 1: E-post ──
    // Vi godtar bare skole-e-postadresser av sikkerhetsgrunner.
    // endsWith() returnerer true hvis strengen slutter med det angitte.
    // some() returnerer true hvis MINST ÉN verdi i arrayen er true.
    const gyldigeDoener = ["@elev.oslo.kommune.no", "@elvebakken.oslo.no"];
    const epostGyldig   = gyldigeDoener.some(domene => epost.endsWith(domene));

    if (!epostGyldig) {
      // Vis feilmeldingen ved å fjerne "hidden"-klassen
      document.getElementById("epost-feil").classList.remove("hidden");
      // Merk feltet med rød kant
      document.getElementById("epost").classList.add("feil");
      // Flytt fokus til feltet (brukervennlighet)
      document.getElementById("epost").focus();
      return; // Stopp resten av funksjonen – send IKKE inn
    }

    // ── VALIDERING 2: GDPR-samtykke ──
if (!samtykke) {
  document.getElementById("samtykke-feil").classList.remove("hidden")
  return
} else {
  document.getElementById("samtykke-feil").classList.add("hidden")
}



    // ── LAG SAK-OBJEKT ──
    // Alle validerte data samles i ett objekt.
    // Objektliteral-syntaks: { nøkkel: verdi }
    // Kortform (ES6): når variabelnavnet er det samme som nøkkelnavnet
    //   kan vi skrive bare variabelnavnet: { tittel } i stedet for { tittel: tittel }
    const nySak = {
      id: nesteId++,       // nesteId er fra data.js, økes med ++ etter bruk
      tittel,              // Kortform for tittel: tittel
      kategori,
      prioritet,
      status: "åpen",      // Nye saker starter alltid som åpne
      beskrivelse,
      innmelder: navn,     // Her bruker vi annet navn som nøkkel
      epost,
      dato: new Date().toISOString().split("T")[0]
      // new Date() = nå
      // .toISOString() = "2026-03-10T14:23:00.000Z"
      // .split("T")[0] = "2026-03-10" (vi vil bare ha datodelen)
    };

    // ── LAGRE TIL LOCALSTORAGE ──
    lagreNySak(nySak);

    // Legg også til i SAKER-arrayen i minnet, slik at statistikken
    // på forsiden oppdateres uten at brukeren trenger å refreshe.
    SAKER.push(nySak);

    // ── VIS BEKREFTELSE ──
    // Fyll inn saksnummer og e-post i bekreftelsesboksen
    document.getElementById("saksnummer").textContent       = genererSaksnummer();
    document.getElementById("bekreftelse-epost").textContent = epost;

    // Skjul skjemaet og vis bekreftelsesboksen
    nySakForm.classList.add("hidden");
    document.getElementById("bekreftelse").classList.remove("hidden");
  });
}
