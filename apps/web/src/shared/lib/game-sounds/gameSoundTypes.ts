export type SharedSound =
  | 'click'
  | 'select'
  | 'confirm'
  | 'error'
  | 'success'
  | 'notification'
  | 'open'
  | 'close'
  | 'toggle'
  | 'back'
  | 'drop'
  | 'tick';

export type CardSound =
  | 'deal'
  | 'flip'
  | 'play'
  | 'shuffle'
  | 'slide'
  | 'fan'
  | 'tap'
  | 'draw'
  | 'collect';

export type BoardSound =
  'move' | 'capture' | 'select_piece' | 'place' | 'crown';

export type DiceSound = 'roll' | 'shake' | 'grab';

export type BattleSound =
  'hit' | 'miss' | 'explode' | 'splash' | 'sonar' | 'laser';

export type PuzzleSound =
  | 'reveal'
  | 'place_digit'
  | 'slide_tile'
  | 'merge'
  | 'flag'
  | 'card_flip'
  | 'card_place';

export type ResultSound = 'win' | 'lose' | 'game_over';

export type ChessSpecificSound =
  | 'chess_move'
  | 'chess_capture'
  | 'chess_check'
  | 'chess_castle'
  | 'chess_promotion'
  | 'chess_game_start'
  | 'chess_game_end'
  | 'chess_draw_offer'
  | 'chess_notification'
  | 'chess_error';

export type GameSoundId =
  | SharedSound
  | CardSound
  | BoardSound
  | DiceSound
  | BattleSound
  | PuzzleSound
  | ResultSound
  | ChessSpecificSound;

export interface GameSoundEntry {
  file: string;
  volume?: number;
}
