// Zentrale Hilfe-Texte für den Admin-Bereich. Jeder Eintrag gehört zu genau
// einer Seite (über den "topic"-Schlüssel an <HelpButton topic="..." />).
// Hier zu pflegen, statt in jeder Seite einzeln — so bleibt es an einer
// Stelle aktuell.
export const ADMIN_HELP = {
  uebersicht: {
    title: "Produktübersicht",
    sections: [
      {
        heading: "WAS DU HIER SIEHST",
        text: "Alle Produkte mit Foto, Kategorie, Preis (bzw. Preisspanne, wenn Farben unterschiedlich kosten), Farben, Gesamt-Lagerbestand und Sichtbarkeit im Shop.",
      },
      {
        heading: "WORKFLOW",
        text: "Auf eine Zeile klicken öffnet sie zum Bearbeiten. \"+ Neues Produkt\" legt ein neues an. Über die Links oben rechts erreichst du Bestellungen, Kategorien, Rabattcodes, Gutscheine und Einstellungen. \"Backup herunterladen\" lädt eine Excel-Datei mit allen Tabellen (Produkte, Bestellungen, Gutscheine usw.) — praktisch als schnelle lokale Sicherung.",
      },
    ],
  },

  produktFormular: {
    title: "Produkt anlegen / bearbeiten",
    sections: [
      {
        heading: "GRUNDDATEN",
        text: "Name, Kategorie, Beschreibung, Material und Maße gelten für das ganze Produkt. Das Häkchen \"Als Neu zeigen\" markiert das Produkt für den \"Neu in der Kollektion\"-Bereich auf der Startseite.",
      },
      {
        heading: "FARBVARIANTEN",
        text: "Preis, Lagerbestand und Fotos gehören zu jeder Farbe einzeln — so können z. B. verschiedene Lederarten unterschiedlich viel kosten. \"Ursprungspreis\" nur ausfüllen, wenn diese Farbe gerade reduziert ist (zeigt sich im Shop durchgestrichen).",
      },
      {
        heading: "FOTOS",
        text: "Beliebig viele pro Farbe, werden automatisch verkleinert. Das erste Foto (mit \"Titel\"-Markierung) ist das Titelbild im Shop — mit den Pfeilen ← → verschiebbar.",
      },
      {
        heading: "SPEICHERN",
        text: "\"Abbrechen\" verwirft alle Änderungen. Beim Bearbeiten gibt's zusätzlich \"Produkt löschen\" — das ist endgültig.",
      },
    ],
  },

  bestellungenOffen: {
    title: "Offene Bestellungen",
    sections: [
      {
        heading: "WAS \"OFFEN\" BEDEUTET",
        text: "Bereits bezahlte Bestellungen, die noch nicht verpackt/verschickt bzw. abgeholt wurden. Farblich markiert: ABHOLUNG oder VERSAND. Falls ein Rabattcode oder Gutschein verwendet wurde, steht das direkt mit angezeigt.",
      },
      {
        heading: "WORKFLOW BEIM VERPACKEN",
        text: "1) Bei Versand: \"Adresse kopieren\" für den Versandaufkleber (3 Zeilen: Name / Straße / PLZ Ort + Land separat). 2) Optional Sendungsnummer eintragen. 3) \"Rechnung hochladen (PDF)\" — die aus sevDesk manuell exportierte Rechnung; wird automatisch an die Versandmail angehängt. 4) \"Als versendet/abgeholt markieren\" klicken — setzt den Status UND verschickt automatisch eine E-Mail an die Kundschaft (mit Sendungsnummer und Rechnung, falls hinterlegt).",
      },
      {
        heading: "FALLS DIE AUTOMATISCHE MAIL MAL NICHT ANKOMMT",
        text: "\"E-Mail vorbereiten\" öffnet einen vorausgefüllten Entwurf in deinem Mailprogramm zum manuellen Verschicken.",
      },
    ],
  },

  bestellungenVersendet: {
    title: "Versendete Bestellungen",
    sections: [
      {
        heading: "WAS DU HIER SIEHST",
        text: "Alle bereits als versendet/abgeholt markierten Bestellungen — dein Archiv abgeschlossener Vorgänge, inklusive Sendungsnummer falls eingetragen. Von hier kommst du mit einem Link zurück zu den offenen Bestellungen.",
      },
    ],
  },

  kategorien: {
    title: "Kategorien",
    sections: [
      {
        heading: "WOZU",
        text: "Kategorien (z. B. Handtaschen, Rucksäcke, Federpennal) helfen bei der Einordnung der Produkte. Neue Kategorie einfach über das Formular anlegen — steht danach sofort bei \"Neues Produkt\" zur Auswahl.",
      },
    ],
  },

  einstellungen: {
    title: "Einstellungen",
    sections: [
      {
        heading: "VERSANDKOSTEN NACH LAND",
        text: "Jedes Land hat eigene Versandkosten. Bestehende Kosten einfach im Feld ändern (speichert automatisch beim Verlassen des Felds), neue Länder über das Formular unten hinzufügen. Diese Liste erscheint automatisch auch als Dropdown im Checkout und als Tabelle in den AGB — nirgends doppelt pflegen nötig.",
      },
      {
        heading: "NIEDRIGER LAGERBESTAND",
        text: "Ab welcher Stückzahl im Shop \"Nur noch X Stück verfügbar\" statt normal angezeigt wird.",
      },
      {
        heading: "GESCHENKGUTSCHEIN-BLOCK",
        text: "Schaltet den Gutschein-Kachel-Block am Ende der Shop-Kollektion sichtbar/unsichtbar.",
      },
    ],
  },

  rabattcodes: {
    title: "Rabattcodes",
    sections: [
      {
        heading: "WOZU",
        text: "Codes wie \"SOMMER20\", die Kund:innen im Checkout eingeben — entweder Prozent oder ein fixer Euro-Betrag Rabatt. \"Gültig ab/bis\" ist optional; ohne Angabe gilt der Code zeitlich unbegrenzt, solange er aktiv ist.",
      },
      {
        heading: "AN/AUS",
        text: "Über den Status-Button lässt sich ein Code jederzeit deaktivieren, ohne ihn zu löschen — praktisch für zeitlich begrenzte Aktionen, die später wiederkommen sollen.",
      },
    ],
  },

  gutscheine: {
    title: "Geschenkgutscheine",
    sections: [
      {
        heading: "WIE'S FUNKTIONIERT",
        text: "Kund:innen kaufen auf der Seite \"/gutschein\" einen Gutschein über einen frei wählbaren Betrag, zahlen wie bei einem Produkt über Mollie. Nach der Zahlung erscheint der Code auf einer Bestätigungsseite und wird automatisch per E-Mail verschickt.",
      },
      {
        heading: "ALLES ODER NICHTS",
        text: "Ein Gutschein wird bei Einlösung vollständig verbraucht — auch wenn die Bestellung kleiner ist als der Gutscheinwert. Es gibt kein Restguthaben, das für später aufgehoben wird.",
      },
      {
        heading: "STATUS",
        text: "\"Zahlung offen\" → \"Aktiv\" (einlösbar) → \"Eingelöst\" (verbraucht). \"E-Mail vorbereiten\" bei aktiven Gutscheinen ist die manuelle Backup-Option, falls die automatische Mail mal nicht ankommt.",
      },
    ],
  },
};
