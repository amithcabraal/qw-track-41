import React, { useState, useEffect } from 'react';
import { PlaylistSelector } from '../components/PlaylistSelector';
import { GamePlayer } from '../components/GamePlayer';
import { Header } from '../components/Header';
import { ChallengeMode } from '../components/challenge/ChallengeMode';
import { SpotifyPlaylist, SpotifyTrack } from '../types/spotify';
import { getUserPlaylists, getTrackById } from '../services/spotifyApi';
import { GameResult } from '../types/game';
import { usePlaylist } from '../hooks/usePlaylist';
import { cleanupChallenge } from '../utils/navigation';

interface HomeProps {
  challengeData?: GameResult[];
}

export const Home: React.FC<HomeProps> = ({ challengeData }) => {
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [playedTracks, setPlayedTracks] = useState<Set<string>>(new Set());
  const [isReadyForNextTrack, setIsReadyForNextTrack] = useState(true);
  const [playerResults, setPlayerResults] = useState<GameResult[]>([]);
  const [showChallengeResults, setShowChallengeResults] = useState(false);

  const {
    currentPlaylist,
    currentTrack,
    error,
    handlePlaylistSelect: handlePlaylistSelectBase,
    setCurrentTrack
  } = usePlaylist(playedTracks);

  useEffect(() => {
    if (!challengeData) {
      getUserPlaylists()
        .then(data => {
          setPlaylists(data.items);
        })
        .catch(error => {
          console.error('Failed to fetch playlists:', error);
        });
    } else if (challengeData.length > 0 && isReadyForNextTrack) {
      const currentIndex = playedTracks.size;
      
      if (currentIndex < challengeData.length) {
        getTrackById(challengeData[currentIndex].trackId)
          .then(track => {
            setCurrentTrack(track);
            setIsReadyForNextTrack(false);
          })
          .catch(error => {
            console.error('Failed to fetch challenge track:', error);
          });
      } else if (currentIndex === challengeData.length) {
        setShowChallengeResults(true);
        cleanupChallenge(); // Clean up when challenge is complete
      }
    }
  }, [challengeData, playedTracks, isReadyForNextTrack]);

  const handlePlaylistSelect = async (playlist: SpotifyPlaylist) => {
    const success = await handlePlaylistSelectBase(playlist, Boolean(challengeData));
    if (success && challengeData) {
      setIsReadyForNextTrack(true);
    }
  };

  const handleGameComplete = (score: number) => {
    if (currentTrack) {
      const gameResult: GameResult = {
        trackId: currentTrack.id,
        trackName: currentTrack.name,
        artistName: currentTrack.artists[0].name,
        albumImage: currentTrack.album.images[0]?.url || '',
        score,
        time: Number(document.querySelector('.text-4xl.font-bold.mb-2')?.textContent?.replace('s', '') || 0),
        timestamp: Date.now()
      };

      if (challengeData) {
        setPlayerResults(prev => [...prev, gameResult]);
      }
      
      setPlayedTracks(prev => new Set([...prev, currentTrack.id]));
    }
  };

  const handlePlayAgain = () => {
    setIsReadyForNextTrack(true);
    if (!challengeData && currentPlaylist) {
      handlePlaylistSelect(currentPlaylist);
    }
  };

  const handleNewGame = () => {
    cleanupChallenge();
    setCurrentTrack(null);
    setPlayedTracks(new Set());
    setPlayerResults([]);
    setShowChallengeResults(false);
    setIsReadyForNextTrack(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header onNewGame={handleNewGame} />
      
      <main className="pt-16">
        {showChallengeResults && challengeData ? (
          <ChallengeMode
            originalResults={challengeData}
            playerResults={playerResults}
            onClose={handleNewGame}
            onNewGame={handleNewGame}
          />
        ) : !currentTrack ? (
          <div className="max-w-4xl mx-auto p-4">
            <h2 className="text-2xl font-bold mb-6 dark:text-white">
              {challengeData ? 'Challenge Mode' : 'Your Playlists'}
            </h2>
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg text-red-700 dark:text-red-200">
                {error}
              </div>
            )}
            <PlaylistSelector 
              playlists={playlists} 
              onSelect={handlePlaylistSelect}
              challengeData={challengeData}
            />
          </div>
        ) : (
          <GamePlayer 
            track={currentTrack} 
            onGameComplete={handleGameComplete}
            onPlayAgain={handlePlayAgain}
            challengeData={challengeData}
          />
        )}
      </main>
    </div>
  );
};