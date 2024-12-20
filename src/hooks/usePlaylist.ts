import { useState } from 'react';
import { SpotifyPlaylist, SpotifyTrack } from '../types/spotify';
import { getPlaylistTracks } from '../services/spotifyApi';

export const usePlaylist = (playedTracks: Set<string>) => {
  const [currentPlaylist, setCurrentPlaylist] = useState<SpotifyPlaylist | null>(null);
  const [currentTrack, setCurrentTrack] = useState<SpotifyTrack | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePlaylistSelect = async (playlist: SpotifyPlaylist, isChallenge: boolean) => {
    try {
      setCurrentPlaylist(playlist);
      
      if (isChallenge) {
        return true; // Return success for challenge mode
      }

      const response = await getPlaylistTracks(playlist.id);
      const validTracks = response.items
        .map(item => item.track)
        .filter(track => !playedTracks.has(track.id));

      if (validTracks.length === 0) {
        setError('No more unplayed tracks in this playlist!');
        return false;
      }

      const randomTrack = validTracks[Math.floor(Math.random() * validTracks.length)];
      setCurrentTrack(randomTrack);
      setError(null);
      return true;
    } catch (error) {
      console.error('Failed to get tracks:', error);
      setError('Failed to load tracks. Please try again.');
      return false;
    }
  };

  return {
    currentPlaylist,
    currentTrack,
    error,
    handlePlaylistSelect,
    setCurrentTrack,
    setCurrentPlaylist
  };
};