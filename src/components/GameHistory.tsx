import React from 'react';
import { useGameHistory } from '../context/GameContext';
import { formatTime } from '../utils/formatters';

export const GameHistory: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { gameHistory } = useGameHistory();

  return (
    <div className="fixed inset-0 bg-gray-100 dark:bg-gray-900 pt-16 overflow-auto">
      <div className="max-w-2xl mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold dark:text-white">Recent Games</h2>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors dark:text-white"
          >
            Close
          </button>
        </div>
        
        {gameHistory.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-400 py-8">No games played yet</p>
        ) : (
          <div className="space-y-4">
            {gameHistory.map((game, index) => (
              <div key={`${game.trackId}-${game.timestamp}`} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <div className="flex items-center gap-4">
                  <img
                    src={game.albumImage}
                    alt={game.trackName}
                    className="w-16 h-16 rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold dark:text-white">{game.trackName}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{game.artistName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-500">{game.score}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{formatTime(game.time)}s</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};