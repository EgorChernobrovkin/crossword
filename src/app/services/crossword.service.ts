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
      word: 'KENGÄT',
      tip: 'Ты достаточно быстро шевелишь лапками, но еще не так давно это было бы крайне неудобно',
      clues: ['Когда то нам приходилось ооочень долго на это копить', 'Первая буква: K', 'Четвертая буква: G'],
      position: { row: 7, col: 8, direction: 'across' }
    },
    {
      id: '2',
      word: 'SOHVA',
      tip: 'Наверное, на текущий момент, это наше самое любимое место',
      clues: ['Бернардка тоже очень любит это место', 'И гости тоже', 'Ого! Первая бувка: S, а последняя: A'],
      position: { row: 8, col: 4, direction: 'down' }
    },
    {
      id: '3',
      word: 'JÄÄKAAPPI',
      tip: 'Он не такой большой и вместительный, как тот, что был у нас в Казани',
      clues: ['И совсем не такого цвета', 'Но вкусностей он повидал побольше', 'Начинается на лёд'],
      position: { row: 12, col: 0, direction: 'across' }
    },
    {
      id: '4',
      word: 'TYYNY',
      tip: 'Она прохладная и мягкая',
      clues: ['Больше ничего не подскажу'],
      position: { row: 7, col: 13, direction: 'down' }
    },
    {
      id: '5',
      word: 'KIRJA',
      tip: 'Твоя мама уже успела поменять несколько таких, а вот твоя всё еще в хорошем состоянии',
      clues: ['Ну, вроде, всё просто, вряд ли нужно подсказка', 'Она не то, чтобы настоящяя', 'Первая буква: K, последняя: A'],
      position: { row: 4, col: 4, direction: 'across' }
    },
    {
      id: '6',
      word: 'KUIVAUSKAAPPI',
      tip: 'Это, как оказалось, чисто финнское изобретение',
      clues: ['Оооочень удобное', 'И даже ухаживать практически не надо', 'И сушится всё сильно лучше', 'Это такой ящик'],
      position: { row: 0, col: 8, direction: 'down' }
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