import { Routes } from '@angular/router';
import { CrosswordGridComponent } from './components/crossword-grid/crossword-grid.component';
import { TipPageComponent } from './components/tip-page/tip-page.component';
import { SuccessPageComponent } from './components/success-page/success-page.component';

export const routes: Routes = [
  { path: '', component: CrosswordGridComponent },
  { path: 'tip', component: TipPageComponent },
  { path: 'success', component: SuccessPageComponent },
  { path: '**', redirectTo: '' }
]; 