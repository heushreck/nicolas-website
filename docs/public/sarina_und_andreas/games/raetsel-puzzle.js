// raetsel-puzzle.js: the words, clues and layout of the crossword.
//
// Word: { answer, clue, hint, dir: 'A' (waagerecht) | 'D' (senkrecht), row, col }
//   answer is upper case with umlauts written out (Ü → UE, ß → SS), as in German crosswords.
//   clue is the harder first clue; hint is the easier second one, shown when the players ask for a Tipp.
//   row and col are the word's first square, counted from 0 at the top left.
// solution lists the circled squares, in order, whose letters spell the Lösungswort.
// Change `id` whenever the layout changes, so saved progress from the old grid is dropped.

export const PUZZLE = {
  id: 'v1',
  rows: 20,
  cols: 13,
  solution: [[17, 0], [8, 4], [6, 3], [9, 2], [4, 8], [12, 11]],
  words: [
    { answer: 'DEZEMBER', dir: 'A', row: 0, col: 0,
      clue: 'Ab jetzt feiert ihr euren Hochzeitstag in der Glühweinzeit',
      hint: 'Euer Hochzeitsmonat im Jahr 2025' },
    { answer: 'PLAETZCHEN', dir: 'A', row: 2, col: 3,
      clue: 'Eintrittskarte zu eurer Hochzeit, selbst gebacken',
      hint: 'Für die Bar an eurer Hochzeit hat jeder Gast welche gebacken (auf Schwäbisch: Brötle)' },
    { answer: 'FANTAVIER', dir: 'A', row: 4, col: 0,
      clue: 'Sarinas und Carinas alte Clique: eine Limo und eine Zahl',
      hint: 'So hieß die Clique damals, frei nach einer Stuttgarter Hip-Hop-Band' },
    { answer: 'WANDERN', dir: 'A', row: 6, col: 3,
      clue: 'Euer liebstes Hobby, am schönsten mit Gipfelkreuz am Ende',
      hint: 'Was ihr zwei draußen in der Natur am liebsten macht' },
    { answer: 'ASBACH', dir: 'A', row: 8, col: 4,
      clue: 'Uralt, aber in Andreas’ Glas immer willkommen',
      hint: 'Mit Cola Andreas’ Lieblingsdrink' },
    { answer: 'ELISA', dir: 'A', row: 10, col: 1,
      clue: 'Sarina hat mit dieser Person zusammengewohnt',
      hint: 'Sarinas Schwester' },
    { answer: 'MUELLER', dir: 'A', row: 12, col: 0,
      clue: 'Andreas kennt den ganzen Katalog',
      hint: 'Bei dieser Firma arbeitet Andreas' },
    { answer: 'WASSERWECKEN', dir: 'A', row: 15, col: 1,
      clue: 'Nicolas’ Dauerbestellung in Sarinas Backstube',
      hint: 'Schwäbisches Gebäck, um das Nicolas Sarina immer wieder bittet' },
    { answer: 'JULIA', dir: 'A', row: 17, col: 0,
      clue: 'Hat an eurer Hochzeit am längsten geredet',
      hint: 'Sie hat eure Traurede gehalten' },
    { answer: 'BAUWAGEN', dir: 'A', row: 19, col: 1,
      clue: 'Hat Räder, fährt nie und ist trotzdem euer liebster Partyort',
      hint: 'Ausgemustert von der Baustelle, auf dem Dorf zum Partyraum umgebaut' },
    { answer: 'DORFFEST', dir: 'D', row: 0, col: 0,
      clue: 'Bierbank, Blasmusik und ihr zwei mittendrin',
      hint: 'Wenn im Ort gefeiert wird, seid ihr dabei' },
    { answer: 'ADVENTSKALENDER', dir: 'D', row: 2, col: 5,
      clue: 'Hinter einem seiner Türchen steckte mehr als Schokolade',
      hint: '24 Türchen bis Weihnachten' },
    { answer: 'LEICHTATHLETIK', dir: 'D', row: 5, col: 11,
      clue: 'Sarina und Carina in Beimerstetten: schneller, höher, weiter',
      hint: 'Laufen, Springen, Werfen: der Sport, den Sarina und Carina zusammen gemacht haben' },
    { answer: 'VOLLEYBALL', dir: 'D', row: 8, col: 2,
      clue: 'Bei diesem Sport darf Andreas ganz offiziell baggern',
      hint: 'Andreas’ Sport: mit Netz, aber ohne Schläger' },
    { answer: 'TRAUZEUGIN', dir: 'D', row: 10, col: 8,
      clue: 'Carinas Ehrenamt an eurem großen Tag',
      hint: 'Carina war bei eurer Trauung die offizielle Zeugin' },
  ],
};
