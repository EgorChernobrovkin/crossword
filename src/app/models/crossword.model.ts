export interface CrosswordWord {
  id: string;
  word: string;
  clue: string;
  tip: string;
  extraClues: string[];
  position: {
    row: number;
    col: number;
    direction: 'across' | 'down';
  };
}

export interface CrosswordState {
  words: CrosswordWord[];
  solvedWords: string[];
  loading: boolean;
  error: string | null;
}

export const initialState: CrosswordState = {
  words: [],
  solvedWords: [],
  loading: false,
  error: null
}; 