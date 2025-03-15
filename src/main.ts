import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { AppComponent } from './app/app.component';
import { routes } from './app/app-routing.module';
import { crosswordReducer } from './app/store/crossword.reducer';
import { CrosswordEffects } from './app/store/crossword.effects';

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    provideHttpClient(),
    provideRouter(routes),
    provideStore({ crossword: crosswordReducer }),
    provideEffects([CrosswordEffects]),
    provideStoreDevtools({
      maxAge: 25
    })
  ]
}); 