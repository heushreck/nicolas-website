// song-list.js: the songs for "Wie heißt der Song?". Written by scripts/spielewiese/songs.py from
// scripts/spielewiese/songs.txt, so edit that list and run the script rather than changing this file.
//
// Song: { id, artist, title, lang, decoys }
//   id is the song's Apple Music ID; the game fetches its 30-second preview and cover from Apple.
//   lang is the language of the title ('de', 'en', 'fr', or '' if unclear); wrong answers match it.
//   decoys are other songs by the same artist in that language, offered as wrong answers.

export const SONGS = [
  { id: 1441001567, artist: 'Sunrise Avenue', title: 'Hollywood Hills', lang: 'en',
    decoys: ['Fairytale Gone Bad', 'Dreamer', 'Thank You For Everything', 'Forever Yours', 'Welcome to My Life', 'Heartbreak Century'] },
  { id: 1534243319, artist: 'Sunrise Avenue', title: 'I Help You Hate Me', lang: 'en',
    decoys: ['Fairytale Gone Bad', 'Dreamer', 'Thank You For Everything', 'Forever Yours', 'Welcome to My Life', 'Heartbreak Century'] },
  { id: 776779028, artist: 'SDP feat. Weekend', title: 'Tanz aus der Reihe!', lang: 'de',
    decoys: ['Eigentlich wollte er nie ein Liebeslied schreiben', 'Ich muss immer an dich denken', 'Wenn ich groß bin', 'Mama hat gesagt', 'Die Nacht von Freitag auf Montag', 'Die schönsten Tage'] },
  { id: 1440816837, artist: 'ABBA', title: 'Dancing Queen', lang: 'en',
    decoys: ['Don\'t Shut Me Down', 'I Still Have Faith In You', 'Just A Notion', 'The Winner Takes It All', 'Thank You for the Music', 'Happy New Year'] },
  { id: 1440816842, artist: 'ABBA', title: 'Mamma Mia', lang: 'en',
    decoys: ['Don\'t Shut Me Down', 'I Still Have Faith In You', 'Just A Notion', 'The Winner Takes It All', 'Thank You for the Music', 'Happy New Year'] },
  { id: 1440829376, artist: 'Sido feat. Andreas Bourani', title: 'Astronaut', lang: 'de',
    decoys: ['Tausend Tattoos', 'Mit Dir', 'Leben vor dem Tod', 'Pyramiden', 'Liebst du mich', '2002'] },
  { id: 269573364, artist: 'Michael Jackson', title: 'Billie Jean', lang: 'en',
    decoys: ['Love Never Felt So Good', 'They Don\'t Care About Us', 'Beat It', 'Earth Song', 'Thriller', 'Dirty Diana'] },
  { id: 266232820, artist: 'Whitney Houston', title: 'I Wanna Dance With Somebody', lang: 'en',
    decoys: ['One Moment In Time', 'I Will Always Love You', 'My Love Is Your Love', 'How Will I Know', 'Greatest Love of All', 'I Have Nothing'] },
  { id: 380907765, artist: 'a-ha', title: 'Take On Me', lang: 'en',
    decoys: ['Crying In the Rain', 'The Sun Always Shines On TV', 'Stay On These Roads', 'Hunting High and Low', 'Summer Moved On', 'Foot of the Mountain'] },
  { id: 1445669633, artist: 'Bee Gees', title: 'Stayin\' Alive', lang: 'en',
    decoys: ['You Win Again', 'Night Fever', 'How Deep Is Your Love', 'Massachusetts', 'To Love Somebody', 'Tragedy'] },
  { id: 6781027645, artist: 'Queen', title: 'Bohemian Rhapsody', lang: 'en',
    decoys: ['Under Pressure', 'Thank God It\'s Christmas', 'Don\'t Stop Me Now', 'We Are The Champions', 'I Want To Break Free', 'We Will Rock You'] },
  { id: 1440677665, artist: 'Bon Jovi', title: 'Livin\' On a Prayer', lang: 'en',
    decoys: ['It\'s My Life', 'Bed of Roses', 'Runaway', 'You Give Love a Bad Name', 'Always', 'Wanted Dead or Alive'] },
  { id: 185717604, artist: 'Toto', title: 'Africa', lang: 'en',
    decoys: ['Hold the Line', 'Rosanna', 'I Will Remember', 'Georgy Porgy', 'Child\'s Anthem', 'I\'ll Be Over You'] },
  { id: 1446013598, artist: 'Nena', title: '99 Luftballons', lang: 'de',
    decoys: ['Genau jetzt', 'Lieder von früher', 'Mach die Augen auf', 'Magie', 'In meinem Leben', 'Wandern'] },
  { id: 207506704, artist: 'Udo Jürgens', title: 'Griechischer Wein', lang: 'de',
    decoys: ['Ich war noch niemals in New York', 'Mit 66 Jahren', 'Aber bitte mit Sahne', 'Liebe ohne Leiden', 'Ich weiß, was ich will', 'Ein ehrenwertes Haus'] },
];
