export interface Player {
  id: 1 | 2;
  name: string;
  points: number;
  words: string[];
  passCount: number;
}

export interface GameWord {
  word: string;
  player: Player;
  timestamp: number;
  isValid: boolean;
}

export interface GameState {
  players: [Player, Player];
  currentPlayerIndex: 0 | 1;
  gameStatus: 'countdown' | 'waiting' | 'playing' | 'ended';
  timeLeft: number;
  turnStartTime: number;
  lastWord: string;
  winner: Player | null;
  startingLetter: string;
  countdownTime: number;
}

export interface DictionaryApiResponse {
  word: string;
  meanings: Array<{
    partOfSpeech: string;
    definitions: Array<{
      definition: string;
    }>;
  }>;
}
