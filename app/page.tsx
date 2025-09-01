import ShiritoriGame from './components/ShiritoriGame';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-2">
            Shiritori Game
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 px-4">
            Take turns making words that start with the last letter of the previous word
          </p>
        </div>
        <ShiritoriGame />
      </div>
    </div>
  );
}
