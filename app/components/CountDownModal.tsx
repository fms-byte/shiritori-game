const CountdownModal = ({
  countdownTime,
  startingLetter,
  onSkip,
}: {
  countdownTime: number;
  startingLetter: string;
  onSkip: () => void;
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center shadow-xl max-w-md mx-4">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
        Get Ready!
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Game starting with letter:{" "}
        <span className="font-bold text-2xl text-blue-600">
          {startingLetter}
        </span>
      </p>
      <div className="text-6xl font-bold text-blue-600 mb-6 animate-pulse">
        {countdownTime}
      </div>
      <button
        onClick={onSkip}
        className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
      >
        Skip Countdown
      </button>
    </div>
  </div>
);

export default CountdownModal;