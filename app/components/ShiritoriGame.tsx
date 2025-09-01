"use client";

import { useState, useEffect, useRef } from "react";
import { useShiritoriGame } from "../hooks/useShiritoriGame";
import PlayerCard from "./PlayerCard";
import CountdownModal from "./CountDownModal";

export default function ShiritoriGame() {
  const { gameState, submitWord, skipCountdown, resetGame, updatePlayerName } = useShiritoriGame();
  const [inputs, setInputs] = useState({ player1: "", player2: "" });
  const [error, setError] = useState<string>("");

  const player1InputRef = useRef<HTMLInputElement>(null);
  const player2InputRef = useRef<HTMLInputElement>(null);

  // Auto-focus current player's input
  useEffect(() => {
    if (gameState.gameStatus === "playing") {
      const timeout = setTimeout(() => {
        if (gameState.currentPlayerIndex === 0 && player1InputRef.current) {
          player1InputRef.current.focus();
        } else if (
          gameState.currentPlayerIndex === 1 &&
          player2InputRef.current
        ) {
          player2InputRef.current.focus();
        }
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [gameState.currentPlayerIndex, gameState.gameStatus]);

  const handleSubmit = async (playerId: 1 | 2) => {
    const word = playerId === 1 ? inputs.player1 : inputs.player2;
    const expectedPlayerId = gameState.currentPlayerIndex === 0 ? 1 : 2;

    if (playerId !== expectedPlayerId) {
      setError(
        `It's ${gameState.players[gameState.currentPlayerIndex].name}'s turn!`
      );
      return;
    }

    if (!word.trim()) return;

    setError("");
    const result = await submitWord(word);

    if (result.success) {
      setInputs({ player1: "", player2: "" });
    } else {
      setError(result.reason || "Invalid word");
      setTimeout(() => setError(""), 3000);
    }
  };

  const getNextLetter = () => {
    return gameState.lastWord
      ? gameState.lastWord.slice(-1).toUpperCase()
      : gameState.startingLetter;
  };

  const isPlayerTurn = (playerId: 1 | 2) => {
    return (
      (gameState.currentPlayerIndex === 0 && playerId === 1) ||
      (gameState.currentPlayerIndex === 1 && playerId === 2)
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-4 pb-8">
      {/* Countdown Modal */}
      {gameState.gameStatus === "countdown" && (
        <CountdownModal
          countdownTime={gameState.countdownTime}
          startingLetter={gameState.startingLetter}
          onSkip={skipCountdown}
        />
      )}

      {/* Game Status */}
      <div className="text-center mb-4 sm:mb-6">
        {(gameState.gameStatus === "waiting" ||
          gameState.gameStatus === "countdown") && (
          <div className="space-y-2 px-4">
            <p className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white">
              Game starts with letter:{" "}
              <span className="text-2xl sm:text-3xl font-bold text-blue-600 block sm:inline mt-1 sm:mt-0">
                {gameState.startingLetter}
              </span>
            </p>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
              Player 1 enters the first word starting with "
              {gameState.startingLetter}"
            </p>
          </div>
        )}

         {gameState.gameStatus === "playing" && (
           <div className="space-y-2 px-4">
             <p className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white">
               {gameState.players[gameState.currentPlayerIndex].name}'s Turn
             </p>
           </div>
         )}

         {gameState.gameStatus === "ended" && gameState.winner && (
           <div className="space-y-4 px-4">
             <p className="text-xl sm:text-2xl font-bold text-green-600">
               🎉 {gameState.winner.name} Wins! 🎉
             </p>
             <button
               onClick={resetGame}
               className="w-full sm:w-auto px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
             >
               Play Again
             </button>
           </div>
         )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-center mb-4">
          <div className="inline-block px-4 py-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg">
            {error}
          </div>
        </div>
      )}

      {/* Players */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <PlayerCard
          player={gameState.players[0]}
          isActive={isPlayerTurn(1)}
          timeLeft={isPlayerTurn(1) ? gameState.timeLeft : null}
          input={inputs.player1}
          onInputChange={(value) =>
            setInputs((prev) => ({ ...prev, player1: value }))
          }
          onKeyPress={(e) => e.key === "Enter" && handleSubmit(1)}
          onSubmit={() => handleSubmit(1)}
          onNameChange={(name) => updatePlayerName(1, name)}
          canEditName={gameState.gameStatus === "waiting"}
          inputRef={player1InputRef}
          gameStatus={gameState.gameStatus}
          requiredLetter={getNextLetter()}
          isFirstWord={!gameState.lastWord}
        />

        <PlayerCard
          player={gameState.players[1]}
          isActive={isPlayerTurn(2)}
          timeLeft={isPlayerTurn(2) ? gameState.timeLeft : null}
          input={inputs.player2}
          onInputChange={(value) =>
            setInputs((prev) => ({ ...prev, player2: value }))
          }
          onKeyPress={(e) => e.key === "Enter" && handleSubmit(2)}
          onSubmit={() => handleSubmit(2)}
          onNameChange={(name) => updatePlayerName(2, name)}
          canEditName={gameState.gameStatus === "waiting"}
          inputRef={player2InputRef}
          gameStatus={gameState.gameStatus}
          requiredLetter={getNextLetter()}
          isFirstWord={!gameState.lastWord}
        />
      </div>
    </div>
  );
}
