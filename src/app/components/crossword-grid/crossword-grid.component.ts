import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { Store } from '@ngrx/store';
import { CrosswordService } from '../../services/crossword.service';
import { CrosswordWord } from '../../models/crossword.model';
import { CrosswordState } from '../../store/crossword.state';
import * as CrosswordActions from '../../store/crossword.actions';
import { Subject, combineLatest } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { trigger, transition, style, animate } from '@angular/animations';

interface GridCell {
  value: string;
  solved: boolean;
  isPartOfWord: boolean;
  wordIds: string[];
  isStart?: boolean;
  wordNumber?: number;
}

@Component({
  selector: 'app-crossword-grid',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './crossword-grid.component.html',
  styleUrls: ['./crossword-grid.component.scss'],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateY(20px)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ])
  ]
})
export class CrosswordGridComponent implements OnInit, OnDestroy {
  @ViewChild('completionSection') completionSection?: ElementRef;
  
  readonly GRID_ROWS = 13;
  readonly GRID_COLS = 14;
  
  grid: GridCell[] = this.createEmptyGrid();
  gridTemplateColumns = `repeat(${this.GRID_COLS}, 1fr)`;
  words: CrosswordWord[] = [];
  solvedWordIds: string[] = [];
  isPuzzleComplete = false;
  hoveredWordId: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private store: Store<{ crossword: CrosswordState }>,
    public router: Router,
    private crosswordService: CrosswordService
  ) {
    // Listen for navigation events
    this.router.events.pipe(
      takeUntil(this.destroy$),
      filter(event => event instanceof NavigationEnd && event.url === '/')
    ).subscribe(() => {
      // When navigating back to the main page, check if we need to scroll
      if (this.isPuzzleComplete) {
        setTimeout(() => this.scrollToCompletionSection(), 500);
      }
    });
  }

  private createEmptyGrid(): GridCell[] {
    const totalCells = this.GRID_ROWS * this.GRID_COLS;
    return Array(totalCells).fill(null).map(() => ({
      value: '',
      solved: false,
      isPartOfWord: false,
      wordIds: []
    }));
  }

  private getCellIndex(row: number, col: number): number {
    return row * this.GRID_COLS + col;
  }

  private getCellPosition(index: number): { row: number, col: number } {
    return {
      row: Math.floor(index / this.GRID_COLS),
      col: index % this.GRID_COLS
    };
  }

  private scrollToCompletionSection() {
    if (!this.completionSection) return;
    
    const element = this.completionSection.nativeElement;
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  ngOnInit() {
    // Load crossword data
    this.store.dispatch(CrosswordActions.loadCrosswordData());

    // Subscribe to words and solved status together
    combineLatest([
      this.store.select(state => state.crossword.words),
      this.store.select(state => state.crossword.solvedWordIds),
      this.store.select(state => state.crossword.isPuzzleComplete)
    ])
    .pipe(takeUntil(this.destroy$))
    .subscribe(([words, solvedWordIds, isPuzzleComplete]) => {
      const wasComplete = this.isPuzzleComplete;
      
      this.words = words;
      this.solvedWordIds = solvedWordIds;
      this.isPuzzleComplete = isPuzzleComplete;
      this.initializeGrid();

      // If puzzle just completed, scroll after a short delay
      if (isPuzzleComplete && !wasComplete) {
        setTimeout(() => this.scrollToCompletionSection(), 500);
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onCellClick(index: number) {
    const { row, col } = this.getCellPosition(index);
    
    const cell = this.grid[index];
    if (!cell.isPartOfWord) return;

    // Find any word that contains this cell (including solved ones)
    const clickedWord = this.words.find(word => {
      const { row: wordRow, col: wordCol, direction } = word.position;
      const wordLength = word.word.length;
      
      if (direction === 'across') {
        return row === wordRow && col >= wordCol && col < wordCol + wordLength;
      } else {
        return col === wordCol && row >= wordRow && row < wordRow + wordLength;
      }
    });

    if (clickedWord) {
      this.store.dispatch(CrosswordActions.selectWord({ wordId: clickedWord.id }));
      this.router.navigate(['/tip', clickedWord.id]);
    }
  }

  onCellMouseEnter(index: number) {
    const { row, col } = this.getCellPosition(index);
    
    const cell = this.grid[index];
    if (!cell.isPartOfWord) return;

    // Find the first word that contains this cell
    const hoveredWord = this.words.find(word => {
      const { row: wordRow, col: wordCol, direction } = word.position;
      const wordLength = word.word.length;
      
      if (direction === 'across') {
        return row === wordRow && col >= wordCol && col < wordCol + wordLength;
      } else {
        return col === wordCol && row >= wordRow && row < wordRow + wordLength;
      }
    });

    if (hoveredWord) {
      this.hoveredWordId = hoveredWord.id;
    }
  }

  onCellMouseLeave() {
    this.hoveredWordId = null;
  }

  isCellInHoveredWord(cell: GridCell): boolean {
    return this.hoveredWordId !== null && cell.wordIds.includes(this.hoveredWordId);
  }

  private initializeGrid() {
    // Reset grid
    this.grid = this.createEmptyGrid();
    
    // First pass: mark all cells that are part of words and set starting positions
    this.words.forEach((word, index) => {
      const { row, col, direction } = word.position;
      const letters = word.word.split('');
      
      // Mark the starting position
      const startIndex = this.getCellIndex(row, col);
      if (startIndex < this.grid.length) {
        this.grid[startIndex].isStart = true;
        this.grid[startIndex].wordNumber = index + 1;
      }
      
      letters.forEach((letter, letterIndex) => {
        const gridIndex = direction === 'across' 
          ? this.getCellIndex(row, col + letterIndex)
          : this.getCellIndex(row + letterIndex, col);
          
        if (gridIndex < this.grid.length) {
          const cell = this.grid[gridIndex];
          cell.isPartOfWord = true;
          cell.wordIds.push(word.id);
          
          // If this cell is part of any solved word, show its letter
          const isCellSolved = cell.wordIds.some(id => this.solvedWordIds.includes(id));
          if (isCellSolved) {
            cell.value = letter;
            cell.solved = true;
          }
        }
      });
    });

    // Check if all words are solved
    this.isPuzzleComplete = this.words.length > 0 && 
      this.words.every(word => this.solvedWordIds.includes(word.id));
  }
} 