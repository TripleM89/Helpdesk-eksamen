// ============================================================
//  data.js — Testdata for HelpDesk
//
//  Denne filen inneholder hardkodede eksempeldata som simulerer
//  hva som ville ligge i en ekte database.
//
//  I et virkelig system ville disse dataene kommet fra en server
//  via et API (f.eks. fetch() til en backend skrevet i Python/Node).
//  Her lagrer vi dem direkte i JavaScript for enkelhets skyld.
// ============================================================


// ──────────────────────────────────────────────
//  SAKER-ARRAYEN
//
//  En array er en liste av elementer. Her er hvert element
//  et objekt (krøllparenteser {}) som representerer én sak.
//
//  Hvert sak-objekt har disse feltene:
//    id          – unikt nummer som identifiserer saken
//    tittel      – kort beskrivelse av problemet
//    kategori    – type problem (hardware, software, nettverk, bruker, annet)
//    prioritet   – hvor viktig saken er (lav, medium, høy, kritisk)
//    status      – hvor saken er i prosessen (åpen, pågående, løst)
//    beskrivelse – detaljert forklaring av problemet
//    innmelder   – navn på personen som meldte inn saken
//    epost       – e-post til innmelder (personopplysning!)
//    dato        – dato saken ble opprettet, ISO-format (YYYY-MM-DD)
// ──────────────────────────────────────────────

const SAKER = [
  {
    id: 1,
    tittel: "Kan ikke logge inn på Office 365",
    kategori: "software",
    prioritet: "høy",
    status: "åpen",
    beskrivelse: "Etter passordbytte sist uke får jeg feilmelding 'Ugyldig brukernavn eller passord' på alle enheter.",
    innmelder: "Anne Larsen",
    epost: "anne.larsen@elev.oslo.kommune.no",
    dato: "2026-03-08"
  },
  {
    id: 2,
    tittel: "Skriveren i rom B201 svarer ikke",
    kategori: "hardware",
    prioritet: "medium",
    status: "pågående",
    beskrivelse: "HP LaserJet i B201 er ikke synlig i nettverket. Varsellys blinker gult.",
    innmelder: "Jonas Berg",
    epost: "jonas.berg@elev.oslo.kommune.no",
    dato: "2026-03-07"
  },
  {
    id: 3,
    tittel: "Veldig treg internettforbindelse i kantinen",
    kategori: "nettverk",
    prioritet: "lav",
    status: "åpen",
    beskrivelse: "WiFi-hastigheten er under 1 Mbps mellom kl. 11 og 13. Antakelig for mange brukere på samme aksesspunkt.",
    innmelder: "Sofie Dahl",
    epost: "sofie.dahl@elev.oslo.kommune.no",
    dato: "2026-03-06"
  },
  {
    id: 4,
    tittel: "Mangler tilgang til Teams-kanal",
    kategori: "bruker",
    prioritet: "medium",
    status: "løst",
    beskrivelse: "Ny elev i klasse 2ITA mangler tilgang til klassens Teams-kanal.",
    innmelder: "Madeleine Lærer",
    epost: "madeleine@elvebakken.oslo.no",
    dato: "2026-03-05"
  },
  {
    id: 5,
    tittel: "Python 3.12 vil ikke installere på skole-PC",
    kategori: "software",
    prioritet: "høy",
    status: "pågående",
    beskrivelse: "Installasjon mislykkes med feil 1603. Administrator-rettigheter er bekreftet. Mulig konflikt med Python 3.9.",
    innmelder: "Erik Strand",
    epost: "erik.strand@elev.oslo.kommune.no",
    dato: "2026-03-04"
  },
  {
    id: 6,
    tittel: "Projektor i Aula viser feil oppløsning",
    kategori: "hardware",
    prioritet: "lav",
    status: "løst",
    beskrivelse: "Projektoren i Aula skalerer ikke riktig med nye MacBook-tilkoblinger via USB-C-adapter.",
    innmelder: "Rektorkontoret",
    epost: "rektor@elvebakken.oslo.no",
    dato: "2026-03-03"
  }
];


// ──────────────────────────────────────────────
//  NESTE ID
//
//  Når brukeren melder inn en ny sak trenger den et unikt ID-nummer.
//  Vi starter på SAKER.length + 1 (altså 7) slik at vi ikke
//  overskriver ID-ene til testdataene over.
//
//  Merk: I et ekte system ville databasen håndtere dette automatisk
//  med auto-increment. Her gjør vi det manuelt.
// ──────────────────────────────────────────────

let nesteId = SAKER.length + 1;


const BRUKERE = [
  { brukernavn: "admin",   passord: "Admin123",  rolle: "admin",  navn: "IT-administrator" },
  { brukernavn: "elev1",   passord: "Elev123",   rolle: "bruker", navn: "Elev Elvebakken"  },
  { brukernavn: "laerer1", passord: "Laerer123", rolle: "bruker", navn: "Lærer Elvebakken" }
];