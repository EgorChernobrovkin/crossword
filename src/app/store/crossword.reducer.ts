import { createReducer, on } from '@ngrx/store';
import { CrosswordState, initialState } from './crossword.state';
import * as CrosswordActions from './crossword.actions';

export const crosswordReducer = createReducer(
  initialState,
  
  on(CrosswordActions.loadCrosswordData, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(CrosswordActions.loadCrosswordDataSuccess, (state, { words, solvedWordIds, isPuzzleComplete }) => ({
    ...state,
    words,
    solvedWordIds: solvedWordIds || [],
    isPuzzleComplete: isPuzzleComplete || false,
    loading: false,
    error: null
  })),
  
  on(CrosswordActions.loadCrosswordDataFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  on(CrosswordActions.selectWord, (state, { wordId }) => ({
    ...state,
    selectedWordId: wordId
  })),
  
  on(CrosswordActions.markWordAsSolved, (state, { wordId }) => {
    const newSolvedWordIds = [...state.solvedWordIds, wordId];
    const isPuzzleComplete = newSolvedWordIds.length === state.words.length;
    
    return {
      ...state,
      solvedWordIds: newSolvedWordIds,
      isPuzzleComplete
    };
  })
); 