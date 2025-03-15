import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { crosswordReducer } from './store/crossword.reducer';
import { CrosswordEffects } from './store/crossword.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideStore({ crossword: crosswordReducer }),
    provideEffects([CrosswordEffects])
  ]
}; 