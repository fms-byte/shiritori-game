"use client";

import { useState, useCallback, useEffect } from "react";
import { GameState, Player, DictionaryApiResponse } from "../types/game";

// Constants
const TURN_DURATION = 15;
const STARTING_POINTS = 100;
const COUNTDOWN_DURATION = 3;

// Helper functions
const generateRandomLetter = (): string => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return letters[Math.floor(Math.random() * letters.length)];
};

const createInitialState = (): GameState => ({
  players: [
    {
      id: 1,
      name: "Player 1",
      points: STARTING_POINTS,
      words: [],
      passCount: 0,
    },
    {
      id: 2,
      name: "Player 2",
      points: STARTING_POINTS,
      words: [],
      passCount: 0,
    },
  ],
  currentPlayerIndex: 0,
  gameStatus: "countdown",
  timeLeft: TURN_DURATION,
  turnStartTime: Date.now(),
  lastWord: "",
  winner: null,
  startingLetter: generateRandomLetter(),
  countdownTime: COUNTDOWN_DURATION,
});

export const useShiritoriGame = () => {
  const [gameState, setGameState] = useState<GameState>(createInitialState());
  const [isValidating, setIsValidating] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (gameState.gameStatus !== "countdown") return;

    const timer = setInterval(() => {
      setGameState((prev) => {
        if (prev.countdownTime <= 1) {
          return {
            ...prev,
            gameStatus: "playing",
            countdownTime: 0,
            timeLeft: TURN_DURATION,
            turnStartTime: Date.now(),
          };
        }
        return { ...prev, countdownTime: prev.countdownTime - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState.gameStatus]);

  // Game timer
  useEffect(() => {
    if (gameState.gameStatus !== "playing") return;

    const timer = setInterval(() => {
      setGameState((prev) => {
        if (prev.timeLeft <= 1) {
          return handleTimeout(prev);
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState.gameStatus]);

  // Handle timeout
  const handleTimeout = (state: GameState): GameState => {
    const currentPlayer = state.players[state.currentPlayerIndex];
    const newPassCount = currentPlayer.passCount + 1;
    const newPoints = Math.max(0, currentPlayer.points - TURN_DURATION);

    const updatedPlayers = [...state.players] as [Player, Player];
    updatedPlayers[state.currentPlayerIndex] = {
      ...currentPlayer,
      points: newPoints,
      passCount: newPassCount,
      words: [...currentPlayer.words, `PASS #${newPassCount}`],
    };

    // Check game over
    if (newPoints <= 0) {
      const otherPlayerIndex = state.currentPlayerIndex === 0 ? 1 : 0;
      return {
        ...state,
        players: updatedPlayers,
        gameStatus: "ended",
        winner: updatedPlayers[otherPlayerIndex],
      };
    }

    // Switch turns
    return {
      ...state,
      players: updatedPlayers,
      currentPlayerIndex: state.currentPlayerIndex === 0 ? 1 : 0,
      timeLeft: TURN_DURATION,
      turnStartTime: Date.now(),
    };
  };

  // Word validation
  const validateWordWithAPI = async (word: string): Promise<boolean> => {
    try {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`
      );
      if (response.ok) {
        const data: DictionaryApiResponse[] = await response.json();
        return data.length > 0 && data[0].meanings.length > 0;
      }
      return false;
    } catch {
      return false;
    }
  };

  const validateWordStructure = (
    word: string
  ): { isValid: boolean; reason?: string } => {
    const normalizedWord = word.toLowerCase().trim();

    if (normalizedWord.length < 4) {
      return { isValid: false, reason: "Word must be at least 4 letters long" };
    }

    const allUsedWords = [
      ...gameState.players[0].words,
      ...gameState.players[1].words,
    ].filter((w) => !w.startsWith("PASS"));

    if (allUsedWords.includes(normalizedWord)) {
      return { isValid: false, reason: "Word has already been used" };
    }

    const requiredLetter = gameState.lastWord
      ? gameState.lastWord.slice(-1).toLowerCase()
      : gameState.startingLetter.toLowerCase();

    if (normalizedWord.charAt(0).toLowerCase() !== requiredLetter) {
      const letterDisplay = gameState.lastWord
        ? gameState.lastWord.slice(-1).toUpperCase()
        : gameState.startingLetter;
      return {
        isValid: false,
        reason: `Word must start with "${letterDisplay}"`,
      };
    }

    return { isValid: true };
  };

  // Submit word
  const submitWord = useCallback(
    async (word: string): Promise<{ success: boolean; reason?: string }> => {
      if (gameState.gameStatus === "ended" || isValidating) {
        return { success: false, reason: "Game not active" };
      }

      setIsValidating(true);

      try {
        // Validate structure
        const structureCheck = validateWordStructure(word);
        if (!structureCheck.isValid) {
          setIsValidating(false);
          return { success: false, reason: structureCheck.reason };
        }

        // Validate with API
        const isValidWord = await validateWordWithAPI(word);
        if (!isValidWord) {
          setIsValidating(false);
          return { success: false, reason: "Word not found in dictionary" };
        }

        // Update game state
        const currentPlayer = gameState.players[gameState.currentPlayerIndex];
        const timeUsed = TURN_DURATION - gameState.timeLeft;
        const newPoints = Math.max(0, currentPlayer.points - timeUsed);

        const updatedPlayers = [...gameState.players] as [Player, Player];
        updatedPlayers[gameState.currentPlayerIndex] = {
          ...currentPlayer,
          points: newPoints,
          words: [...currentPlayer.words, word.toLowerCase().trim()],
        };

        // Check game over
        if (newPoints <= 0) {
          const otherPlayerIndex = gameState.currentPlayerIndex === 0 ? 1 : 0;
          setGameState((prev) => ({
            ...prev,
            players: updatedPlayers,
            gameStatus: "ended",
            winner: updatedPlayers[otherPlayerIndex],
            lastWord: word.toLowerCase().trim(),
          }));
          setIsValidating(false);
          return { success: true };
        }

        // Continue game - switch to next player
        setGameState((prev) => ({
          ...prev,
          players: updatedPlayers,
          currentPlayerIndex: prev.currentPlayerIndex === 0 ? 1 : 0,
          gameStatus: "playing",
          timeLeft: TURN_DURATION,
          turnStartTime: Date.now(),
          lastWord: word.toLowerCase().trim(),
        }));

        setIsValidating(false);
        return { success: true };
      } catch {
        setIsValidating(false);
        return { success: false, reason: "Error validating word" };
      }
    },
    [gameState, isValidating]
  );

  // Game controls
  const skipCountdown = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      gameStatus: "playing",
      countdownTime: 0,
      timeLeft: TURN_DURATION,
      turnStartTime: Date.now(),
    }));
  }, []);

  const resetGame = useCallback(() => {
    setGameState(createInitialState());
  }, []);

  const updatePlayerName = useCallback((playerId: 1 | 2, name: string) => {
    setGameState((prev) => {
      const updatedPlayers = [...prev.players] as [Player, Player];
      const playerIndex = playerId === 1 ? 0 : 1;
      updatedPlayers[playerIndex] = { ...updatedPlayers[playerIndex], name };
      return { ...prev, players: updatedPlayers };
    });
  }, []);

  return {
    gameState,
    isValidating,
    submitWord,
    skipCountdown,
    resetGame,
    updatePlayerName,
    currentPlayer: gameState.players[gameState.currentPlayerIndex],
    otherPlayer: gameState.players[gameState.currentPlayerIndex === 0 ? 1 : 0],
  };
};
