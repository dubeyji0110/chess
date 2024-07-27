import { Events } from '@/constants';
import { Color, PieceSymbol, Square } from 'chess.js';

export type Board = ({
  square: Square;
  type: PieceSymbol;
  color: Color;
} | null)[][];

export interface Move {
  promotion: string | undefined;
  from: string;
  to: string;
}

export interface EventData {
  type: keyof typeof Events;
  payload:
    | {
        move: Move;
      }
    | undefined;
}
