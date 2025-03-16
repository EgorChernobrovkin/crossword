export interface CrosswordWord {
  id: string;
  word: string;
  tip: string;
  clues: string[];
  position: {
    row: number;
    col: number;
    direction: 'across' | 'down';
  };
  congratulation?: {
    message: string;
    imageUrl: string;
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