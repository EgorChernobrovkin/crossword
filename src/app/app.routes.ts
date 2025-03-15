import { Routes } from '@angular/router';
import { CrosswordGridComponent } from './components/crossword-grid/crossword-grid.component';

export const routes: Routes = [
  { path: '', component: CrosswordGridComponent },
  { path: 'tip/:wordId', loadComponent: () => import('./components/tip-page/tip-page.component').then(m => m.TipPageComponent) },
  { path: 'success', loadComponent: () => import('./components/success-page/success-page.component').then(m => m.SuccessPageComponent) }
]; 