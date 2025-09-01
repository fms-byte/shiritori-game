const PlayerCard = ({
  player,
  isActive,
  timeLeft,
  input,
  onInputChange,
  onKeyPress,
  onSubmit,
  onNameChange,
  canEditName,
  inputRef,
  gameStatus,
  requiredLetter,
  isFirstWord,
}: {
  player: any;
  isActive: boolean;
  timeLeft: number | null;
  input: string;
  onInputChange: (value: string) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  onSubmit: () => void;
  onNameChange: (name: string) => void;
  canEditName: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
  gameStatus: string;
  requiredLetter: string;
  isFirstWord: boolean;
}) => {
  const borderColor = player.id === 1 ? "border-blue-500" : "border-green-500";
  const bgColor =
    player.id === 1
      ? "bg-blue-50 dark:bg-blue-900/20"
      : "bg-green-50 dark:bg-green-900/20";
  const focusColor =
    player.id === 1 ? "focus:border-blue-600" : "focus:border-green-600";

  const getTimerColor = (time: number) => {
    if (time <= 5) return "text-red-500";
    if (time <= 10) return "text-yellow-500";
    return "text-green-500";
  };

  return (
    <div
      className={`p-6 rounded-lg border-2 transition-all ${
        isActive
          ? `${borderColor} ${bgColor}`
          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-center md:justify-between mb-4">
        <input
          type="text"
          value={player.name}
          onChange={(e) => onNameChange(e.target.value)}
          disabled={!canEditName}
          className="text-xl font-bold bg-transparent border-none focus:outline-none focus:border-b-2 text-gray-800 dark:text-white"
          maxLength={15}
        />
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-800 dark:text-white">
            {player.points}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">points</div>
        </div>
      </div>

      {/* Timer */}
      <div className="text-center mb-4">
        {isActive && gameStatus === "playing" && timeLeft !== null && (
          <div className={`text-3xl sm:text-4xl font-bold ${getTimerColor(timeLeft)}`}>
            {timeLeft}s
          </div>
        )}
        {!isActive && gameStatus === "playing" && (
          <div className="text-xl sm:text-2xl font-bold text-gray-400">Waiting...</div>
        )}
      </div>

      {/* Required Letter Display */}
      {gameStatus === "playing" && (
        <div className="text-center mb-3">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {isFirstWord ? "First word starts with:" : "Next word starts with:"}
          </p>
          <div className="text-2xl font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/30 rounded-lg py-2 px-4 inline-block">
            {requiredLetter}
          </div>
        </div>
      )}

      {/* Input and Submit */}
      <div className="space-y-3">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) =>
            onInputChange(e.target.value.replace(/[^a-zA-Z]/g, ""))
          }
          onKeyPress={onKeyPress}
          disabled={gameStatus === "ended" || gameStatus === "countdown"}
          placeholder={
            gameStatus === "countdown" ? "Wait for countdown..." :
            !isActive ? "Wait for your turn" :
            `Type word starting with "${requiredLetter}" (Press Enter to submit)`
          }
          enterKeyHint="done"
          inputMode="text"
          autoCapitalize="none"
          autoComplete="off"
          className={`w-full px-4 py-3 text-base sm:text-lg border-2 rounded-lg focus:outline-none transition-colors dark:bg-gray-700 dark:text-white ${
            isActive
              ? `${borderColor} ${focusColor}`
              : "border-gray-300 dark:border-gray-600 focus:border-gray-400"
          } ${gameStatus === "ended" ? "opacity-50" : ""}`}
          maxLength={20}
        />
        
        {/* Submit Button for Mobile Only */}
        {isActive && gameStatus === "playing" && (
          <button
            onClick={onSubmit}
            disabled={!input.trim() || input.length < 4}
            className={`w-full md:hidden py-3 px-4 text-base font-semibold rounded-lg transition-colors ${
              player.id === 1
                ? "bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300"
                : "bg-green-500 hover:bg-green-600 disabled:bg-green-300"
            } text-white disabled:cursor-not-allowed disabled:opacity-50`}
          >
            Submit Word {input.length >= 4 ? `(${input.toUpperCase()})` : `(${4 - input.length} more letters needed)`}
          </button>
        )}

        {/* Desktop hint */}
        {isActive && gameStatus === "playing" && (
          <p className="hidden md:block text-xs text-gray-500 text-center">
            Press Enter to submit • {input.length >= 4 ? "Ready to submit!" : `Need ${4 - input.length} more letters`}
          </p>
        )}
      </div>

      {/* Words History */}
      <div className="mt-4">
        <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
          {player.name}&apos;s Words:
        </h4>
        <div className="space-y-1 max-h-40 overflow-y-auto">
          {player.words.length === 0 ? (
            <p className="text-gray-500 text-sm">No words yet</p>
          ) : (
            player.words.map((word: string, index: number) => (
              <div
                key={index}
                className={`flex items-center justify-between p-2 rounded ${
                  word.startsWith("PASS")
                    ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                    : "bg-gray-100 dark:bg-gray-700"
                }`}
              >
                <span className="font-medium">{word}</span>
                <span className="text-xs text-gray-500">#{index + 1}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;