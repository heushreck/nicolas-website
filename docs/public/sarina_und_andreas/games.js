// games.js: the four games on the arcade page. Edit this file to rename a game or change its rules text.
//
// Game: { id, n, title, tagline, icon, tint, steps, ready }
//   icon is a file in art/; tint is the soft colour behind it.
//   steps are the "how it works" lines, shown while a game is still being built and by games that
//   explain themselves before the first round.
//   ready: false shows the "still being built" screen. Once a game exists as games/<id>.js
//   (exporting `start(stage, ctx)`), flip it to true and the page loads that module instead.
// The page is served both with and without a trailing slash, so links use absolute paths and game
// modules load their own files relative to import.meta.url.

export const GAMES = [
  {
    id: 'wo', n: 1, title: 'Wo war das?', icon: 'icon-geo.svg', tint: '#e6eff5', ready: true,
    tagline: 'Urlaubsfotos und eine Nadel auf der Karte.',
    steps: [
      'Ein Foto von einer eurer Reisen erscheint.',
      'Tippt auf die Stelle der Karte, an der es entstanden ist.',
      'Ihr seht, wie weit ihr danebenlagt. Wer nah genug dran ist, liegt richtig.',
    ],
  },
  {
    id: 'weg', n: 2, title: 'Zeichnet den Weg', icon: 'icon-route.svg', tint: '#e8f2e2', ready: true,
    tagline: 'Wege, die ihr im Schlaf kennt. Auch ohne Straßen?',
    steps: [
      'Die Karte zeigt, wo es losgeht und wo ihr hinwollt. Straßen gibt es keine.',
      'Zeichnet mit dem Finger den Weg, den ihr nehmen würdet, vom Haus bis zur Fahne.',
      'Dann erscheint die echte Route, und ihr seht, wie viel Prozent eures Wegs passt.',
    ],
  },
  {
    id: 'song', n: 3, title: 'Wie heißt der Song?', icon: 'icon-music.svg', tint: '#f6eddf', ready: true,
    tagline: 'Lieder, die ihr kennen solltet. Oder?',
    steps: [
      'Ein Song spielt drei Sekunden lang an, der Titel bleibt geheim.',
      'Wählt den richtigen Titel aus vier Möglichkeiten, oder hört erst mehr: zehn Sekunden, dann dreißig.',
      'Je weniger ihr hören musstet, desto mehr Punkte. Haltet eure Serie am Leben!',
    ],
  },
  {
    id: 'raetsel', n: 4, title: 'Kreuzworträtsel', icon: 'icon-crossword.svg', tint: '#f3e8ea', ready: true,
    tagline: 'Ein kleines Rätsel, nur über euch zwei.',
    steps: [
      'Fünfzehn Begriffe aus eurem gemeinsamen Leben.',
      'Tippt auf ein Kästchen, lest den Hinweis und schreibt die Antwort hinein. Umlaute schreibt ihr aus (Ü wird UE).',
      'Die eingekreisten Buchstaben ergeben das Lösungswort.',
    ],
  },
];
