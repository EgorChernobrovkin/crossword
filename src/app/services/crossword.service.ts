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
      position: { row: 7, col: 8, direction: 'across' },
      congratulation: {
        message: 'Кроссовки помогают не только заниматься бегом, но и быстро, как тот ёжик, бежать домой. А пока ты в дороге, тебе нужно что-то послушать, что-то что бы настроило тебя на романтический лад.',
        imageUrl: './assets/images/congratulations/qr_romantic_playlist_for_Kati.png'
      }
    },
    {
      id: '2',
      word: 'SOHVA',
      tip: 'Наверное, на текущий момент, это наше самое любимое место',
      clues: ['Бернардка тоже очень любит это место', 'И гости тоже', 'Ого! Первая бувка: S, а последняя: A'],
      position: { row: 8, col: 4, direction: 'down' },
      congratulation: {
        message: 'Ты большой любитель взремнуть на этом диване, а он все-таки не для этого и не очень удобен. Если все-таки сильно устанешь и всё-таки уснешь крепким сном, то на случай, если вдруг проснешься с больной спиной, то я тебе приготовил купон на 1 массаж от меня.',
        imageUrl: './assets/images/congratulations/massage_coupon.webp'
      }
    },
    {
      id: '3',
      word: 'JÄÄKAAPPI',
      tip: 'Он не такой большой и вместительный, как тот, что был у нас в Казани',
      clues: ['И совсем не такого цвета', 'Но вкусностей он повидал побольше', 'Начинается на лёд'],
      position: { row: 12, col: 0, direction: 'across' },
      congratulation: {
        message: 'Когда кушаешь что-то вкусненькое, или просто пытаешься разгрузиться после тяжелого дня, то всегда ищешь что-то веселое посмотреть. Тут то я и подсуетился.',
        imageUrl: './assets/images/congratulations/qr_funny_videos_for_Kati.png'
      }
    },
    {
      id: '4',
      word: 'KIRJA',
      tip: 'Твоя мама уже успела поменять несколько таких, а вот твоя всё еще в хорошем состоянии',
      clues: ['Ну, вроде, всё просто, вряд ли нужно подсказка', 'Она не то, чтобы настоящяя', 'Первая буква: K, последняя: A'],
      position: { row: 4, col: 4, direction: 'across' },
      congratulation: {
        message: 'Хорошая книга очень расслабляет. Но что еще лучше расслабляет? Правильно, сауна! А если вдвоем, то еще лучше!',
        imageUrl: './assets/images/congratulations/sauna_for_two_coupon.webp'
      }
    },
    {
      id: '5',
      word: 'TYYNY',
      tip: 'Она прохладная и мягкая',
      clues: ['Больше ничего не подскажу'],
      position: { row: 7, col: 13, direction: 'down' },
      congratulation: {
        message: 'От подушечки приходится уходить и идти в этот суровый мир. Иногда, не в очень хорошем настроении. Чтобы в такие моменты ты могла немного приподнять настроение, я приготовил для тебя веселый плейлист.',
        imageUrl: './assets/images/congratulations/qr_funny_playlist_for_Kati.png'
      }
    },    
    {
      id: '6',
      word: 'KUIVAUSKAAPPI',
      tip: 'Это, как оказалось, чисто финнское изобретение',
      clues: ['Оооочень удобное', 'И даже ухаживать практически не надо', 'И сушится всё сильно лучше', 'Это такой ящик'],
      position: { row: 0, col: 8, direction: 'down' },
      congratulation: {
        message: 'В этот раз ты там найдешь, конечно же, не совсем то, что можно было бы ожидать. Но, хотя бы приятное, и то, что можно похомячить вдвоем. А вот и купон специальный.',
        imageUrl: './assets/images/congratulations/spend_evening_together_coupon.webp'
      }
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