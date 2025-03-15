import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="sakura-container">
      @for (i of [1,2,3,4,5,6,7,8,9,10]; track i) {
        <div class="petal"></div>
      }
    </div>
    <router-outlet></router-outlet>
  `,
  styles: [`
    main {
      min-height: 100vh;
      background-color: var(--surface-1);
    }
  `]
})
export class AppComponent {
  title = 'crossword-app';
} 