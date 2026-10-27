// games.js: the four games on the arcade page. Edit this file to rename a game or change its rules text.
//
// Game: { id, n, title, tagline, icon, tint, steps, ready }
//   icon is a file in art/; tint is the soft colour behind it.
//   steps are the "how it works" lines shown before a game starts.
//   ready: false shows the "still being built" screen. Once a game exists as games/<id>.js
//   (exporting `start(stage, ctx)`), flip it to true and the page loads that module instead.
//
// The repo is public, so don't put anything private here (photos, addresses, phone numbers).

export const GAMES = [
  {
    id: 'where', n: 1, title: 'Where was this?', icon: 'icon-geo.svg', tint: '#e6eff5', ready: false,
    tagline: 'Holiday photos, one pin on the map.',
    steps: [
      'A photo from one of your trips appears.',
      'Tap the spot on the map where you think it was taken.',
      'See how far off you were. The closer, the more points.',
    ],
  },
  {
    id: 'route', n: 2, title: 'Draw the route', icon: 'icon-route.svg', tint: '#e8f2e2', ready: false,
    tagline: 'From your door to a friend’s, by heart.',
    steps: [
      'You get a map without streets, just your home and a friend’s place.',
      'Draw the way you would drive with your finger.',
      'The real route appears on top and we score the match in percent.',
    ],
  },
  {
    id: 'song', n: 3, title: 'Name that song', icon: 'icon-music.svg', tint: '#f6eddf', ready: false,
    tagline: 'Fifty songs you should know. Do you?',
    steps: [
      'A song starts playing with its title hidden.',
      'Pick the right title from four options.',
      'Answer fast for more points and keep your streak alive.',
    ],
  },
  {
    id: 'mystery', n: 4, title: 'Trail four', icon: 'icon-mystery.svg', tint: '#f3e8ea', ready: false,
    tagline: 'A surprise that is still being planned.',
    steps: [
      'This trail isn’t signposted yet. Check back soon.',
    ],
  },
];
