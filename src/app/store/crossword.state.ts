import { CrosswordWord } from '../models/crossword.model';

export interface CrosswordState {
  words: CrosswordWord[];
  selectedWordId: string | null;
  solvedWordIds: string[];
  loading: boolean;
  error: any | null;
  isPuzzleComplete: boolean;
}

export const initialState: CrosswordState = {
  words: [],
  selectedWordId: null,
  solvedWordIds: [],
  loading: false,
  error: null,
  isPuzzleComplete: false
}; 