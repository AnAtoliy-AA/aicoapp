export const ECO_OPENINGS: ReadonlyMap<string, string> = new Map([
  ['rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR', "King's Pawn Opening"],
  ['rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR', "Queen's Pawn Opening"],
  ['rnbqkbnr/pppppppp/8/8/2P5/8/PP1PPPPP/RNBQKBNR', 'English Opening'],
  ['rnbqkbnr/pppppppp/8/8/1P6/8/P1PPPPPP/RNBQKBNR', "Larsen's Opening"],
  ['rnbqkbnr/pppppppp/8/8/8/5N2/PPPPPPPP/RNBQKB1R', 'Réti Opening'],
  ['rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR', 'Open Game'],
  [
    'rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R',
    "King's Knight Opening",
  ],
  ['rnbqkb1r/pppp1ppp/5n2/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R', 'Four Knights Game'],
  ['rnbqkb1r/pppp1ppp/5n2/4p3/4P3/2N5/PPPP1PPP/R1BQKBNR', 'Three Knights Game'],
  ['rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b', "King's Knight"],
  ['r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R', 'Open Game'],
  ['r1bqkbnr/pppp1ppp/2n5/4p3/4P3/2N5/PPPP1PPP/R1BQKBNR', 'Three Knights'],
  ['r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R', 'Ruy López'],
  ['r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R', 'Italian Game'],
  ['r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5NP1/PPPP1P1P/RNBQKB1R', "King's Fianchetto"],
  ['r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R', 'Italian Game'],
  ['r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R', 'Giuoco Piano'],
  [
    'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2N2N2/PPPP1PPP/R1BQK2R',
    'Four Knights Italian',
  ],
  ['r1bqk1nr/pppp1ppp/2n5/2b1p3/1PB1P3/5N2/P1PP1PPP/RNBQK2R', 'Evans Gambit'],
  [
    'rnbqkb1r/pppp1ppp/5n2/4p3/2B1P3/8/PPPP1PPP/RNBQK1NR',
    'Traxler Counter-Attack',
  ],
  ['r1bqkbnr/pppp1ppp/2n5/8/3pP3/5N2/PPP2PPP/RNBQKB1R', 'Scotch Game'],
  ['r1bqkbnr/pppp1ppp/2n5/4p3/3PP3/5N2/PPP2PPP/RNBQKB1R', 'Scotch Game'],
  ['r1bqkbnr/ppp2ppp/2n5/3pp3/3PP3/5N2/PPP2PPP/RNBQKB1R', 'Scotch Game'],
  ['r1bqkbnr/pppp1ppp/2n5/4p3/4PP2/5N2/PPPP2PP/RNBQKB1R', "King's Gambit"],
  ['rnbqkbnr/pppp1ppp/8/4p3/4PP2/8/PPPP2PP/RNBQKBNR', "King's Gambit"],
  ['rnbqkbnr/ppp2ppp/8/3pp3/3PP3/8/PPP2PPP/RNBQKBNR', "Queen's Gambit"],
  ['rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR', "Queen's Gambit"],
  ['rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b', "Queen's Gambit"],
  [
    'rnbqkbnr/ppp2ppp/4p3/3p4/2PP4/8/PP2PPPP/RNBQKBNR',
    "Queen's Gambit Declined",
  ],
  ['rnbqkbnr/ppp1pppp/8/8/2pP4/8/PP2PPPP/RNBQKBNR', "Queen's Gambit Accepted"],
  ['rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR', 'Sicilian Defense'],
  ['rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R', 'Sicilian Defense'],
  ['rnbqkbnr/pp2pppp/3p4/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R', 'Sicilian: Dragon'],
  [
    'r1bqkbnr/pp1ppppp/2n5/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R',
    'Sicilian: Nimzowitsch',
  ],
  ['rnbqkbnr/pp1p1ppp/4p3/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R', 'Sicilian: Kan'],
  [
    'rnbqkbnr/1p1ppppp/p7/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R',
    'Sicilian: Najdorf (prep)',
  ],
  ['rnbqkbnr/1p1p1ppp/p3p3/2p5/3PP3/5N2/PPP2PPP/RNBQKB1R', 'Sicilian: Najdorf'],
  ['r1bqkbnr/1p1p1ppp/p1n1p3/8/3NP3/2N5/PPP2PPP/R1BQKB1R', 'Sicilian: Najdorf'],
  ['rnbqkbnr/pppp1ppp/4p3/8/4P3/8/PPPP1PPP/RNBQKBNR', 'French Defense'],
  ['rnbqkbnr/pppp1ppp/4p3/8/3PP3/8/PPP2PPP/RNBQKBNR', 'French Defense'],
  ['rnbqkbnr/pppp1ppp/4p3/8/4P3/2N5/PPPP1PPP/R1BQKBNR', 'French: Nc3'],
  ['rnbqkb1r/pppp1ppp/4pn2/8/3PP3/8/PPP2PPP/RNBQKBNR', 'French: Advance'],
  ['rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR', 'Caro-Kann Defense'],
  ['rnbqkbnr/pp1ppppp/2p5/8/3PP3/8/PPP2PPP/RNBQKBNR', 'Caro-Kann Defense'],
  [
    'rnbqkb1r/pp2pppp/2p2n2/3p4/3PP3/2N5/PPP2PPP/R1BQKBNR',
    'Caro-Kann: Classical',
  ],
  ['rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR', 'Starting Position'],
  ['rnbqkb1r/pppp1ppp/5n2/4p3/4P3/8/PPPP1PPP/RNBQKBNR', 'Latvian Gambit'],
  ['rnbqkb1r/pppp1ppp/5n2/4p3/3PP3/8/PPP2PPP/RNBQKBNR', 'Petroff Defense'],
  [
    'rnbqkb1r/pppp1ppp/5n2/4p3/4P3/2N5/PPPP1PPP/R1BQKBNR',
    'Three Knights: Petroff',
  ],
  ['rnbqkbnr/pppppppp/8/8/8/2N5/PPPPPPPP/R1BQKBNR', 'Van Geet Opening'],
  ['rnbqkbnr/pppppppp/8/8/8/5NP1/PPPPPP1P/RNBQKB1R', "King's Indian Attack"],
  [
    'rnbqkb1r/ppp1pppp/3p1n2/8/2PP4/8/PP2PPPP/RNBQKBNR',
    "King's Indian Defense",
  ],
  [
    'rnbqkb1r/ppp1pp1p/3p1np1/8/2PP4/6P1/PP2PP1P/RNBQKBNR',
    "King's Indian Defense",
  ],
  [
    'rnbqk2r/ppp1ppbp/3p1np1/8/2PPP3/2N5/PP3PPP/R1BQKBNR',
    "King's Indian: Classical",
  ],
  ['rnbqkb1r/pppp1ppp/5n2/8/2PP4/8/PP2PPPP/RNBQKBNR', 'Nimzo-Indian Defense'],
  [
    'rnbqk2r/pppp1ppp/4pn2/8/1bPP4/2N5/PP2PPPP/R1BQKBNR',
    'Nimzo-Indian Defense',
  ],
  [
    'rnbqk2r/pppp1ppp/4pn2/8/1bPP4/2N2N2/PP2PPPP/R1BQKB1R',
    'Nimzo-Indian: Three Knights',
  ],
  ['rnbqkb1r/pp3ppp/2p1pn2/3p4/2PP4/2N5/PP2PPPP/R1BQKBNR', 'Semi-Slav Defense'],
  [
    'rnbqkb1r/pp3ppp/2p1pn2/3p4/2PP4/2N2N2/PP2PPPP/R1BQKB1R',
    'Semi-Slav Defense',
  ],
  ['rnbqkb1r/ppp1pppp/5n2/3p4/3P4/5N2/PPP1PPPP/RNBQKB1R', 'London System'],
  ['rnbqkb1r/ppp1pppp/5n2/3p4/3P4/2N5/PPP1PPPP/R1BQKBNR', 'Veresov Attack'],
  [
    'rnbqkb1r/ppp1pppp/5n2/3p2B1/3P4/5N2/PPP1PPPP/RN1QKB1R',
    'Trompowsky Attack',
  ],
  ['rnbqkb1r/pppp1ppp/5n2/4p3/2PP4/8/PP2PPPP/RNBQKBNR', 'Budapest Gambit'],
  [
    'rnbq1rk1/pp2ppbp/3p1np1/2pP4/2P5/2N2N2/PP2PPPP/R1BQKB1R',
    'Grünfeld Defense',
  ],
  ['rnbqkb1r/ppp1pp1p/3p1np1/8/3PP3/8/PPP2PPP/RNBQKBNR', 'Grünfeld Defense'],
]);

export function detectOpening(
  positionHistory: readonly string[],
): string | null {
  for (let i = Math.min(positionHistory.length - 1, 25); i >= 0; i--) {
    const fen = positionHistory[i];
    if (!fen) continue;
    const piecePart = fen.split(' ')[0] ?? fen;
    const match = ECO_OPENINGS.get(piecePart);
    if (match) return match;
  }
  return null;
}
