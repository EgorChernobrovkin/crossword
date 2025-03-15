import { createAction, props } from '@ngrx/store';
import { CrosswordWord } from '../models/crossword.model';

export const loadCrosswordData = createAction(
  '[Crossword] Load Data'
);

export const loadCrosswordDataSuccess = createAction(
  '[Crossword] Load Data Success',
  props<{ 
    words: CrosswordWord[];
    solvedWordIds?: string[];
    isPuzzleComplete?: boolean;
  }>()
);

export const loadCrosswordDataFailure = createAction(
  '[Crossword] Load Data Failure',
  props<{ error: any }>()
);

export const selectWord = createAction(
  '[Crossword] Select Word',
  props<{ wordId: string }>()
);

export const validateWord = createAction(
  '[Crossword] Validate Word',
  props<{ wordId: string, attempt: string }>()
);

export const markWordAsSolved = createAction(
  '[Crossword] Mark Word As Solved',
  props<{ wordId: string }>()
);

export const checkPuzzleCompletion = createAction(
  '[Crossword] Check Puzzle Completion'
); 