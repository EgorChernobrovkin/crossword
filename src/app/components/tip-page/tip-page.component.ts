import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { CrosswordService } from '../../services/crossword.service';
import { CrosswordWord } from '../../models/crossword.model';
import { CrosswordState } from '../../store/crossword.state';
import * as CrosswordActions from '../../store/crossword.actions';
import { Subject, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-tip-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './tip-page.component.html',
  styleUrls: ['./tip-page.component.scss'],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateY(20px)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 }))
      ])
    ])
  ],
  host: {
    '[@fadeIn]': 'true'
  }
})
export class TipPageComponent implements OnInit, OnDestroy {
  @ViewChild('successSection') successSection?: ElementRef;
  
  wordForm: FormGroup = this.fb.group({});
  letterControls: number[] = [];
  currentWord?: CrosswordWord;
  currentTip: string = '';
  isWordSolved = false;
  showExtraClues = false;
  currentClueIndex = 0;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<{ crossword: CrosswordState }>,
    private crosswordService: CrosswordService
  ) {
    const wordId = this.route.snapshot.params['wordId'];

    if (!wordId) {
      this.router.navigate(['/crossword']);
      return;
    }

    this.store.dispatch(CrosswordActions.selectWord({ wordId }));

    combineLatest([
      this.store.select(state => state.crossword.words),
      this.store.select(state => state.crossword.solvedWordIds)
    ])
    .pipe(takeUntil(this.destroy$))
    .subscribe(([words, solvedWordIds]) => {
      const wasNotSolved = !this.isWordSolved;
      this.currentWord = words.find(w => w.id === wordId);
      if (!this.currentWord) {
        this.router.navigate(['/crossword']);
        return;
      }

      this.isWordSolved = solvedWordIds.includes(wordId);
      this.currentTip = this.currentWord.tip;
      
      if (!this.wordForm.controls[`letter0`]) {
        this.initializeForm();
      }

      if (this.isWordSolved) {
        this.wordForm.disable();
        this.currentWord.word.split('').forEach((letter, index) => {
          this.wordForm.get(`letter${index}`)?.setValue(letter);
        });
        
        // If the word was just solved, scroll to success section
        if (wasNotSolved) {
          setTimeout(() => this.scrollToSuccessSection(), 500);
        }
      }
    });
  }

  ngOnInit() {
    // Form initialization moved to constructor
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm() {
    if (!this.currentWord) return;

    const wordLength = this.currentWord.word.length;
    this.letterControls = Array(wordLength).fill(0).map((_, i) => i);
    
    const group: any = {};
    this.letterControls.forEach(i => {
      group[`letter${i}`] = [''];
    });
    
    this.wordForm = this.fb.group(group);

    // Subscribe to form changes
    this.wordForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.validateWord());
  }

  private validateWord() {
    if (!this.currentWord || this.isWordSolved) return;

    const formValues = this.letterControls.map(i => this.wordForm.get(`letter${i}`)?.value);
    
    // Check if all cells have a value (not null, undefined, or empty string)
    const allCellsFilled = formValues.every(value => value?.trim() !== '');
    
    if (allCellsFilled) {
      const word = formValues.join('').toUpperCase();
      this.store.dispatch(CrosswordActions.validateWord({
        wordId: this.currentWord.id,
        attempt: word
      }));
    }
  }

  onLetterInput(index: number) {
    if (index < this.letterControls.length - 1) {
      const nextInput = document.querySelector(`input[formcontrolname="letter${index + 1}"]`) as HTMLInputElement;
      if (nextInput) {
        nextInput.focus();
      }
    }
  }

  toggleExtraClues() {
    if (!this.showExtraClues) {
      this.showExtraClues = true;
      this.currentClueIndex = 0;
    } else {
      if (this.currentWord && this.currentClueIndex < this.currentWord.clues.length - 1) {
        this.currentClueIndex++;
      } else {
        this.showExtraClues = false;
        this.currentClueIndex = 0;
      }
    }
  }

  getCurrentExtraClue(): string[] {
    if (!this.currentWord || !this.showExtraClues) return [];
    return this.currentWord.clues.slice(0, this.currentClueIndex + 1);
  }

  getClueButtonText(): string {
    if (!this.showExtraClues) return 'Show More Clues';
    if (!this.currentWord) return 'Hide Clues';
    
    const totalClues = this.currentWord.clues.length;
    const currentClue = this.currentClueIndex + 1;
    
    if (currentClue === totalClues) return 'Hide Clues';
    return `Show Next Clue (${currentClue}/${totalClues})`;
  }

  onBack() {
    this.router.navigate(['/crossword']);
  }

  onImageError(event: any) {
    console.error('Error loading image:', event);
    console.log('Attempted image URL:', this.currentWord?.congratulation?.imageUrl);
    console.log('Current word:', this.currentWord);
    
    // Try to load image with absolute path as fallback
    const img = event.target;
    if (!img.src.startsWith('http')) {
      const absolutePath = window.location.origin + '/' + this.currentWord?.congratulation?.imageUrl.replace(/^\.\//, '');
      console.log('Trying absolute path:', absolutePath);
      img.src = absolutePath;
    } else {
      console.log('Already tried absolute path, hiding image');
      img.style.display = 'none';
    }
  }

  private scrollToSuccessSection() {
    if (!this.successSection) return;
    
    const element = this.successSection.nativeElement;
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
} 