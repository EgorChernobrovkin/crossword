import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { map, mergeMap, catchError, withLatestFrom, debounceTime, tap, switchMap } from 'rxjs/operators';
import { CrosswordService } from '../services/crossword.service';
import * as CrosswordActions from './crossword.actions';
import { CrosswordState } from './crossword.state';

const STORAGE_KEY = 'crossword_state';

@Injectable()
export class CrosswordEffects {
  // Load initial data
  loadCrossword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CrosswordActions.loadCrosswordData),
      switchMap(() => {
        const savedState = localStorage.getItem(STORAGE_KEY);
        if (savedState) {
          const parsedState = JSON.parse(savedState);
          if (parsedState.words && parsedState.words.length > 0) {
            return of(CrosswordActions.loadCrosswordDataSuccess({ 
              words: parsedState.words,
              solvedWordIds: parsedState.solvedWordIds || [],
              isPuzzleComplete: parsedState.isPuzzleComplete || false
            }));
          }
        }
        
        return this.crosswordService.getCrosswordData().pipe(
          map(words => CrosswordActions.loadCrosswordDataSuccess({ 
            words,
            solvedWordIds: [],
            isPuzzleComplete: false
          })),
          catchError(error => of(CrosswordActions.loadCrosswordDataFailure({ error })))
        );
      })
    )
  );

  validateWord$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CrosswordActions.validateWord),
      debounceTime(500),
      withLatestFrom(this.store.select(state => state.crossword.words)),
      map(([action, words]) => {
        const word = words.find(w => w.id === action.wordId);
        if (word && word.word === action.attempt.toUpperCase()) {
          return CrosswordActions.markWordAsSolved({ wordId: action.wordId });
        }
        return { type: '[Crossword] Validation Failed' };
      })
    )
  );

  // Save state on every state change
  saveState$ = createEffect(() => 
    this.store.select(state => state.crossword).pipe(
      debounceTime(300), // Prevent too frequent saves
      tap(state => {
        if (state.words.length > 0) { // Only save if we have data
          localStorage.setItem(STORAGE_KEY, JSON.stringify({
            words: state.words,
            solvedWordIds: state.solvedWordIds,
            isPuzzleComplete: state.isPuzzleComplete
          }));
        }
      })
    ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private store: Store<{ crossword: CrosswordState }>,
    private crosswordService: CrosswordService
  ) {}
} 