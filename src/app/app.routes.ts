import { Routes } from '@angular/router';
import { CrosswordGridComponent } from './components/crossword-grid/crossword-grid.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'crossword', component: CrosswordGridComponent },
  { path: 'tip/:wordId', loadComponent: () => import('./components/tip-page/tip-page.component').then(m => m.TipPageComponent) },
  { path: 'success', loadComponent: () => import('./components/success-page/success-page.component').then(m => m.SuccessPageComponent) }
]; 