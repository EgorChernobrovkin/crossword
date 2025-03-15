import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { CrosswordWord } from '../models/crossword.model';

@Injectable({
  providedIn: 'root'
})
export class CrosswordService {
  // Mock data with proper grid layout
  private mockData: CrosswordWord[] = [
    {
      id: '1',
      word: 'REACT',
      clue: 'Popular UI library by Facebook',
      tip: 'Think about modern web development tools starting with R',
      extraClues: ['Starts with R', 'Uses JSX', 'Component-based'],
      position: { row: 0, col: 0, direction: 'across' }
    },
    {
      id: '2',
      word: 'REDUX',
      clue: 'State management library',
      tip: 'Popular with React, starts with R',
      extraClues: ['Starts with R', 'Uses actions and reducers', 'Has a store'],
      position: { row: 0, col: 0, direction: 'down' }
    },
    {
      id: '3',
      word: 'TYPE',
      clue: 'JavaScript with static types',
      tip: 'Think about TypeScript without "Script"',
      extraClues: ['4 letters', 'Part of TypeScript', 'Describes data structure'],
      position: { row: 2, col: 1, direction: 'across' }
    },
    {
      id: '4',
      word: 'CODE',
      clue: 'What developers write',
      tip: 'The essence of programming',
      extraClues: ['4 letters', 'You write it', 'It becomes software'],
      position: { row: 1, col: 3, direction: 'down' }
    }
  ];

  constructor(private http: HttpClient) {}

  getCrosswordData(): Observable<CrosswordWord[]> {
    return of(this.mockData);
  }

  validateWord(wordId: string, attempt: string): boolean {
    const word = this.mockData.find(w => w.id === wordId);
    return word ? word.word.toUpperCase() === attempt.toUpperCase() : false;
  }
} 