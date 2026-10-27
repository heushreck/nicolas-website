// games.js: the four games on the arcade page. Edit this file to rename a game or change its rules text.
//
// Game: { id, n, title, tagline, icon, tint, steps, ready }
//   icon is a file in art/; tint is the soft colour behind it.
//   steps are the "So geht’s" pop-up, shown the first time a game opens and from its "?" button:
//   each is { icon, text }, with icon a name from ICONS in tutorial.js. A game still being built
//   lists them instead.
//   ready: false shows the "still being built" screen. Once a game exists as games/<id>.js
//   (exporting `start(stage, ctx)`), flip it to true and the page loads that module instead.
// The page is served both with and without a trailing slash, so links use absolute paths and game
// modules load their own files relative to import.meta.url.

export const GAMES = [
  {
    id: 'wo', n: 1, title: 'Wo war das?', icon: 'icon-geo.svg', tint: '#e6eff5', ready: true,
    tagline: 'Urlaubsfotos und eine Nadel auf der Karte.',
    steps: [
      { icon: 'photo', text: 'Ein Foto von einem eurer Ausflüge erscheint. Antippen macht es groß.' },
      { icon: 'pin', text: 'Tippt auf die Stelle der Karte, an der es entstanden ist, dann auf „Hier war’s!“.' },
      { icon: 'distance', text: 'Ihr seht, wie viele Kilometer ihr danebenlagt, und bekommt einen Spruch dazu.' },
      { icon: 'trophy', text: 'Oben zählen die Kilometer zusammen, mit Schnitt und bestem Tipp. Je weniger, desto besser!' },
    ],
  },
  {
    id: 'weg', n: 2, title: 'Zeichnet den Weg', icon: 'icon-route.svg', tint: '#e8f2e2', ready: true,
    tagline: 'Wege, die ihr im Schlaf kennt. Auch ohne Straßen?',
    steps: [
      { icon: 'map', text: 'Die Karte zeigt, wo es losgeht und wo ihr hinwollt. Straßen gibt es keine.' },
      { icon: 'pencil', text: 'Zeichnet mit dem Finger den Weg, den ihr nehmen würdet, vom Haus bis zur Fahne.' },
      { icon: 'route', text: 'Dann erscheint die echte Route, und ihr seht, wie viel Prozent eures Wegs passt.' },
      { icon: 'undo', text: 'Abgesetzt? Einfach weiterzeichnen. Verzeichnet? „Rückgängig“ nimmt den letzten Strich zurück.' },
    ],
  },
  {
    id: 'song', n: 3, title: 'Wie heißt der Song?', icon: 'icon-music.svg', tint: '#f6eddf', ready: true,
    tagline: 'Wie gut kennt ihr eure Hochzeitsplaylist?',
    steps: [
      { icon: 'rings', text: 'Jeder dieser Songs lief an eurer Hochzeit, der DJ hat sie alle gespielt.' },
      { icon: 'disc', text: 'Tippt auf die Platte: Ihr hört drei Sekunden, der Titel bleibt geheim.' },
      { icon: 'listen', text: 'Wählt den richtigen Titel aus vier, oder hört erst mehr: zehn Sekunden, dann dreißig.' },
      { icon: 'star', text: 'Je weniger ihr hören musstet, desto mehr Punkte. Haltet eure Serie am Leben!' },
    ],
  },
  {
    id: 'raetsel', n: 4, title: 'Kreuzworträtsel', icon: 'icon-crossword.svg', tint: '#f3e8ea', ready: true,
    tagline: 'Ein kleines Rätsel, nur über euch zwei.',
    steps: [
      { icon: 'grid', text: 'Neunzehn Begriffe aus eurem gemeinsamen Leben.' },
      { icon: 'pencil', text: 'Tippt auf ein Kästchen, lest den Hinweis und schreibt die Antwort hinein. Umlaute schreibt ihr aus (Ü wird UE).' },
      { icon: 'check', text: 'Ist ein Wort voll, leuchtet es grün, wenn es stimmt, und blinkt rot, wenn nicht. Ein „Tipp“ hilft weiter.' },
      { icon: 'solution', text: 'Die eingekreisten Buchstaben ergeben das Lösungswort.' },
    ],
  },
];
