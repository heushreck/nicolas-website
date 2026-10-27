// song-list.js: the songs for "Wie heißt der Song?". Written by scripts/spielewiese/songs.py from
// scripts/spielewiese/songs.txt, so edit that list and run the script rather than changing this file.
//
// Song: { id, artist, title, decoys }
//   id is the song's Apple Music ID; the game fetches its 30-second preview and cover from Apple.
//   decoys are other songs by the same artist, offered as wrong answers.

export const SONGS = [
  { id: 1441001567, artist: 'Sunrise Avenue', title: 'Hollywood Hills',
    decoys: ['Fairytale Gone Bad', 'Dreamer', 'Thank You For Everything', 'Forever Yours', 'Welcome to My Life', 'Heartbreak Century'] },
  { id: 1534243319, artist: 'Sunrise Avenue', title: 'I Help You Hate Me',
    decoys: ['Fairytale Gone Bad', 'Dreamer', 'Thank You For Everything', 'Forever Yours', 'Welcome to My Life', 'Heartbreak Century'] },
  { id: 776779028, artist: 'SDP feat. Weekend', title: 'Tanz aus der Reihe!',
    decoys: ['Eigentlich wollte er nie ein Liebeslied schreiben', 'Ich muss immer an dich denken', 'Wenn ich groß bin', 'Mama hat gesagt', 'Die Nacht von Freitag auf Montag', 'Die schönsten Tage'] },
];
