// raetsel-puzzle.js: the words, clues and layout of the crossword.
//
// Word: { answer, clue, dir: 'A' (waagerecht) | 'D' (senkrecht), row, col }
//   answer is upper case with umlauts written out (Ü → UE, ß → SS), as in German crosswords.
//   row and col are the word's first square, counted from 0 at the top left.
// solution lists the circled squares, in order, whose letters spell the Lösungswort.
// Change `id` whenever the layout changes, so saved progress from the old grid is dropped.

export const PUZZLE = {
  id: 'v1',
  rows: 20,
  cols: 13,
  solution: [[17, 0], [8, 4], [6, 3], [9, 2], [4, 8], [12, 11]],
  words: [
    { answer: 'DEZEMBER', dir: 'A', row: 0, col: 0, clue: 'Euer Hochzeitsmonat im Jahr 2025' },
    { answer: 'PLAETZCHEN', dir: 'A', row: 2, col: 3, clue: 'Jeder Hochzeitsgast musste welche für die Bar selbst backen (auf Schwäbisch: Brötle)' },
    { answer: 'FANTAVIER', dir: 'A', row: 4, col: 0, clue: 'So hieß Sarinas und Carinas Clique damals, frei nach einer Stuttgarter Band' },
    { answer: 'WANDERN', dir: 'A', row: 6, col: 3, clue: 'Was ihr zwei draußen in der Natur am liebsten macht' },
    { answer: 'ASBACH', dir: 'A', row: 8, col: 4, clue: 'Mit Cola Andreas’ Lieblingsdrink' },
    { answer: 'ELISA', dir: 'A', row: 10, col: 1, clue: 'Sarinas Schwester' },
    { answer: 'MUELLER', dir: 'A', row: 12, col: 0, clue: 'Bei dieser Firma arbeitet Andreas' },
    { answer: 'WASSERWECKEN', dir: 'A', row: 15, col: 1, clue: 'Schwäbisches Gebäck, um das Nicolas Sarina immer wieder bittet' },
    { answer: 'JULIA', dir: 'A', row: 17, col: 0, clue: 'Sie hat eure Traurede gehalten' },
    { answer: 'BAUWAGEN', dir: 'A', row: 19, col: 1, clue: 'Ländlicher Partytreff, in dem man euch nach dem Fest noch findet' },
    { answer: 'DORFFEST', dir: 'D', row: 0, col: 0, clue: 'Bierbank, Blasmusik und ihr zwei mittendrin' },
    { answer: 'ADVENTSKALENDER', dir: 'D', row: 2, col: 5, clue: '24 Türchen, und hinter einem steckte mehr als Schokolade' },
    { answer: 'LEICHTATHLETIK', dir: 'D', row: 5, col: 11, clue: 'Haben Sarina und Carina zusammen in Beimerstetten trainiert' },
    { answer: 'VOLLEYBALL', dir: 'D', row: 8, col: 2, clue: 'Andreas’ Sport, Baggern ausdrücklich erlaubt' },
    { answer: 'TRAUZEUGIN', dir: 'D', row: 10, col: 8, clue: 'Carinas Ehrenamt an eurem großen Tag' },
  ],
};
