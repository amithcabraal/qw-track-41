import React from 'react';
import { Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cleanupChallenge } from '../../utils/navigation';

interface NewGameButtonProps {
  onClick: () => void;
}

export const NewGameButton: React.FC<NewGameButtonProps> = ({ onClick }) => {
  const navigate = useNavigate();

  const handleNewGame = () => {
    cleanupChallenge();
    navigate('/');
    onClick();
  };

  return (
    <button
      onClick={handleNewGame}
      className="mt-8 w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
    >
      <Play size={20} />
      Start New Game
    </button>
  );
};
