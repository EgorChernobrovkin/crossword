import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
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
    ])
  ]
})
export class TipPageComponent implements OnInit, OnDestroy {
  wordForm: FormGroup = this.fb.group({});
  letterControls: number[] = [];
  currentWord?: CrosswordWord;
  currentTip: string = '';
  isWordSolved = false;
  showExtraClues = false;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private store: Store<{ crossword: CrosswordState }>,
    private crosswordService: CrosswordService
  ) {
    const navigation = this.router.getCurrentNavigation();
    const wordId = navigation?.extras?.state?.['wordId'];

    if (!wordId) {
      this.router.navigate(['/']);
      return;
    }

    this.store.dispatch(CrosswordActions.selectWord({ wordId }));

    combineLatest([
      this.store.select(state => state.crossword.words),
      this.store.select(state => state.crossword.solvedWordIds)
    ])
    .pipe(takeUntil(this.destroy$))
    .subscribe(([words, solvedWordIds]) => {
      this.currentWord = words.find(w => w.id === wordId);
      if (!this.currentWord) {
        this.router.navigate(['/']);
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
    if (!this.currentWord) return;

    const word = this.letterControls
      .map(i => this.wordForm.get(`letter${i}`)?.value || '')
      .join('')
      .toUpperCase();

    if (word.length === this.currentWord.word.length) {
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
    this.showExtraClues = !this.showExtraClues;
  }

  onBack() {
    this.router.navigate(['/']);
  }
} 