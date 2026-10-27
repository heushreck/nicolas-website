// wo-photos.js: the photos for "Wo war das?". To add one, put the image into games/wo/ and add an entry.
//
// Photo: { file, place, lat, lng, note? }
//   file is the image in games/wo/ (jpg or webp; about 1200px on the long side is plenty).
//   place is what the reveal shows, and lat/lng is where the photo was taken (right-clicking a spot
//   in Google Maps copies both). note is an optional second line, such as the month.
// Saved progress is kept per file, so photos can be added or removed at any time.

export const PHOTOS = [
  // Schwäbische Alb
  { file: 'hohenstaufen.webp', place: 'Hohenstaufen', lat: 48.7428, lng: 9.7168, note: 'Mai 2026' },
  { file: 'rosenstein.webp', place: 'Ruine Rosenstein, Heubach', lat: 48.789, lng: 9.9441, note: 'März 2024' },
  { file: 'kaltenburg.webp', place: 'Burg Kaltenburg im Lonetal', lat: 48.5814, lng: 10.2117, note: 'April 2023' },
  { file: 'teck.webp', place: 'Burg Teck', lat: 48.5885, lng: 9.4703, note: 'April 2023' },
  { file: 'hohenzollern.webp', place: 'Burg Hohenzollern', lat: 48.3236, lng: 8.9674, note: 'Juli 2022' },
  { file: 'reussenstein.webp', place: 'Ruine Reußenstein', lat: 48.5613, lng: 9.5671, note: 'April 2022' },

  // Allgäu
  { file: 'stuiben.webp', place: 'Stuiben', lat: 47.5173, lng: 10.1612, note: 'Juli 2026' },
  { file: 'gruenten.jpg', place: 'Grünten, der Wächter des Allgäus', lat: 47.555, lng: 10.32, note: 'Oktober 2023' },
  { file: 'ponten.jpg', place: 'Ponten', lat: 47.4857, lng: 10.4514, note: '2023' },
  { file: 'schrecksee.webp', place: 'Schrecksee', lat: 47.4373, lng: 10.4662, note: 'September 2022' },
  { file: 'haldenwanger-eck.webp', place: 'Haldenwanger Eck, der südlichste Punkt Deutschlands', lat: 47.2717, lng: 10.1741, note: 'August 2022' },
  { file: 'bad-hindelang.jpg', place: 'Über Bad Hindelang', lat: 47.5063, lng: 10.3699, note: 'Mai 2022' },
  { file: 'nebelhorn.webp', place: 'Nebelhorn', lat: 47.4219, lng: 10.3423, note: 'Februar 2022' },
  { file: 'hopfensee.jpg', place: 'Hopfensee', lat: 47.5998, lng: 10.669, note: 'Januar 2022' },
  { file: 'iseler.jpg', place: 'Iseler', lat: 47.4996, lng: 10.4209, note: 'November 2021' },
  { file: 'hoernerbahn.jpg', place: 'Hörnerbahn, Bolsterlang', lat: 47.4607, lng: 10.2056 },
  { file: 'neuschwanstein.jpg', place: 'Schloss Neuschwanstein', lat: 47.5576, lng: 10.7497 },

  // Oberbayern
  { file: 'baumgartenschneid.jpg', place: 'Baumgartenschneid über dem Tegernsee', lat: 47.7022, lng: 11.8112, note: '2023' },
  { file: 'spitzingsee.jpg', place: 'Spitzingsee', lat: 47.6651, lng: 11.8853, note: '2022' },
  { file: 'zugspitze.webp', place: 'Zugspitze', lat: 47.4212, lng: 10.9863, note: 'September 2022' },
  { file: 'hoernle.jpg', place: 'Hörnle-Schwebebahn, Bad Kohlgrub', lat: 47.6445, lng: 11.0548 },

  // weiter weg
  { file: 'aggstein.webp', place: 'Burgruine Aggstein, Wachau', lat: 48.3139, lng: 15.4216, note: 'April 2026' },
  { file: 'luenersee.webp', place: 'Lünersee, Rätikon', lat: 47.0537, lng: 9.7549, note: 'August 2023' },
  { file: 'kjeragbolten.webp', place: 'Kjeragbolten, Norwegen', lat: 59.0337, lng: 6.5933, note: 'Juli 2024' },
  { file: 'preikestolen.webp', place: 'Preikestolen, Norwegen', lat: 58.9862, lng: 6.187, note: 'Juli 2024' },
  { file: 'trolltunga.webp', place: 'Trolltunga, Norwegen', lat: 60.133, lng: 6.754, note: 'Juli 2024' },
  { file: 'geiranger.webp', place: 'Geirangerfjord, Norwegen', lat: 62.1006, lng: 7.2059, note: 'Juli 2024' },
];
