# Crossword Puzzle App

An interactive crossword puzzle application built with Angular and NGRX, featuring a master puzzle view and individual tip pages for each word.

## Features

- Master crossword grid with visual layout of all words
- Individual tip pages for each word with:
  - Primary clue
  - Initial hint
  - Additional hints that can be revealed
  - Letter-by-letter input with validation
- State management using NGRX
- Material Design UI components
- Success page upon puzzle completion

## Technical Stack

- Angular 16.2.0
- NGRX for state management
- Angular Material for UI components
- RxJS for reactive programming

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Open your browser and navigate to `http://localhost:4200`

## Project Structure

- `src/app/components/` - Angular components
  - `crossword-grid/` - Main puzzle grid component
  - `tip-page/` - Individual word tip pages
  - `success-page/` - Completion congratulations page
- `src/app/store/` - NGRX state management
  - `crossword.actions.ts` - State actions
  - `crossword.effects.ts` - Side effects
  - `crossword.reducer.ts` - State reducer
- `src/app/models/` - TypeScript interfaces and types
- `src/app/services/` - Angular services

## Development

The application uses a mock data service for the crossword puzzle data. In a production environment, this would be replaced with a real API endpoint.

## Features to Add

- User progress persistence
- Multiple puzzles
- Difficulty levels
- Timer/scoring system
- Social sharing
- Mobile-optimized layout 