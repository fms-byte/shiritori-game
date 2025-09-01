const CountdownModal = ({
  countdownTime,
  startingLetter,
  onSkip,
}: {
  countdownTime: number;
  startingLetter: string;
  onSkip: () => void;
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 sm:p-8 text-center shadow-xl max-w-sm sm:max-w-md w-full">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-4">
        Get Ready!
      </h2>
      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-6">
        Game starting with letter:{" "}
        <span className="font-bold text-xl sm:text-2xl text-blue-600 block mt-2">
          {startingLetter}
        </span>
      </p>
      <div className="text-5xl sm:text-6xl font-bold text-blue-600 mb-6 animate-pulse">
        {countdownTime}
      </div>
      <button
        onClick={onSkip}
        className="w-full sm:w-auto px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
      >
        Skip Countdown
      </button>
    </div>
  </div>
);

export default CountdownModal;