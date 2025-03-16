import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { trigger, transition, style, animate, keyframes } from '@angular/animations';

interface HaikuWord {
  text: string;
  visible: boolean;
  animated: boolean;
}

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
  animations: [
    trigger('haikuAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('1200ms cubic-bezier(0.4, 0.0, 0.2, 1)', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('1200ms cubic-bezier(0.4, 0.0, 0.2, 1)', style({ opacity: 0 }))
      ])
    ]),
    trigger('wordAnimation', [
      transition('void => visible', [
        animate('2000ms cubic-bezier(0.4, 0.0, 0.2, 1)', keyframes([
          style({ opacity: 0, transform: 'translateY(10px)', offset: 0 }),
          style({ opacity: 0.3, transform: 'translateY(7px)', offset: 0.3 }),
          style({ opacity: 0.6, transform: 'translateY(4px)', offset: 0.6 }),
          style({ opacity: 0.8, transform: 'translateY(2px)', offset: 0.8 }),
          style({ opacity: 1, transform: 'translateY(0)', offset: 1 })
        ]))
      ])
    ]),
    trigger('contentAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('800ms cubic-bezier(0.4, 0.0, 0.2, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class LandingPageComponent implements OnInit {
  showHaiku = false;
  showContent = false;
  haikuLines: HaikuWord[][] = [
    ['Тридцать', 'новых', 'лет'].map(text => ({ text, visible: false, animated: false })),
    ['Загадок', 'искрится', 'путь'].map(text => ({ text, visible: false, animated: false })),
    ['Любовь', '—', 'наш', 'маяк'].map(text => ({ text, visible: false, animated: false }))
  ];
  displayedWords: HaikuWord[][] = this.haikuLines;
  private wordPositions: { line: number; word: number }[] = [];

  constructor() {
    // Create a flat list of all word positions
    this.haikuLines.forEach((line, lineIndex) => {
      line.forEach((_, wordIndex) => {
        this.wordPositions.push({ line: lineIndex, word: wordIndex });
      });
    });
  }

  ngOnInit() {
    setTimeout(() => {
      this.showHaiku = true;
      this.animateNextWord(0);
    }, 1200);
  }

  private animateNextWord(index: number) {
    if (index < this.wordPositions.length) {
      const { line, word } = this.wordPositions[index];
      
      // Only update the specific word that needs to become visible
      if (line < this.displayedWords.length && word < this.displayedWords[line].length) {
        this.displayedWords[line][word].visible = true;
        this.displayedWords[line][word].animated = true;
      }

      setTimeout(() => this.animateNextWord(index + 1), 2000);
    } else {
      // When all words are displayed, wait and then hide haiku
      setTimeout(() => {
        this.showHaiku = false;
        // After haiku disappears, show the main content
        setTimeout(() => {
          this.showContent = true;
        }, 2000);
      }, 3000);
    }
  }
}
