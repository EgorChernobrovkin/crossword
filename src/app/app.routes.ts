import { Routes } from '@angular/router';
import { CrosswordGridComponent } from './components/crossword-grid/crossword-grid.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';

export const routes: Routes = [
  { 
    path: '', 
    component: LandingPageComponent,
    data: { animation: 'landing' }
  },
  { 
    path: 'crossword', 
    component: CrosswordGridComponent,
    data: { animation: 'crossword' }
  },
  { 
    path: 'tip/:wordId', 
    loadComponent: () => import('./components/tip-page/tip-page.component').then(m => m.TipPageComponent),
    data: { animation: 'tip' }
  },
  { 
    path: 'success', 
    loadComponent: () => import('./components/success-page/success-page.component').then(m => m.SuccessPageComponent),
    data: { animation: 'success' }
  }
]; 