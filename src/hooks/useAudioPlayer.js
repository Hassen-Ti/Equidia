import { useEffect, useCallback } from 'react';
import useAudioStore from '../store/audioStore';
import audioService from '../services/audioService';

/**
 * Hook personnalisé pour gérer le lecteur audio
 */
export const useAudioPlayer = () => {
  const {
    currentSession,
    isPlaying,
    isPaused,
    isLoading,
    currentTime,
    duration,
    volume,
    playbackRate,
    setPlaying,
    setLoading,
    setCurrentTime,
    setDuration,
    setVolume,
    setPlaybackRate,
    updateProgress,
    addToHistory,
    reset
  } = useAudioStore();

  // Charger une séance audio
  const loadSession = useCallback(async (session, audioUrl) => {
    try {
      setLoading(true);
      
      const metadata = {
        title: session.nom,
        artist: 'EquiCoach',
        album: session.discipline,
        discipline: session.discipline
      };

      const audioDuration = await audioService.load(audioUrl, metadata);
      setDuration(audioDuration);
      addToHistory(session);
      
      setLoading(false);
      return true;
    } catch (error) {
      console.error('Error loading audio:', error);
      setLoading(false);
      return false;
    }
  }, [setLoading, setDuration, addToHistory]);

  // Lire
  const play = useCallback(() => {
    audioService.play();
    setPlaying(true);
  }, [setPlaying]);

  // Pause
  const pause = useCallback(() => {
    audioService.pause();
    setPlaying(false);
  }, [setPlaying]);

  // Toggle play/pause
  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  // Chercher une position
  const seek = useCallback((time) => {
    audioService.seek(time);
    setCurrentTime(time);
  }, [setCurrentTime]);

  // Avancer
  const forward = useCallback((seconds = 10) => {
    audioService.forward(seconds);
  }, []);

  // Reculer
  const backward = useCallback((seconds = 10) => {
    audioService.backward(seconds);
  }, []);

  // Changer le volume
  const changeVolume = useCallback((newVolume) => {
    audioService.setVolume(newVolume);
    setVolume(newVolume);
  }, [setVolume]);

  // Changer la vitesse
  const changePlaybackRate = useCallback((rate) => {
    audioService.setPlaybackRate(rate);
    setPlaybackRate(rate);
  }, [setPlaybackRate]);

  // Arrêter complètement
  const stop = useCallback(() => {
    audioService.stop();
    reset();
  }, [reset]);

  // Cleanup à la fin
  useEffect(() => {
    // Callbacks du service audio
    audioService.onTimeUpdate = (time) => {
      setCurrentTime(time);
      if (currentSession) {
        updateProgress(currentSession.id, time);
      }
    };

    audioService.onEnded = () => {
      setPlaying(false);
      if (currentSession) {
        updateProgress(currentSession.id, duration);
      }
    };

    audioService.onError = (error) => {
      console.error('Audio error:', error);
      setPlaying(false);
      setLoading(false);
    };

    // Cleanup
    return () => {
      audioService.onTimeUpdate = null;
      audioService.onEnded = null;
      audioService.onError = null;
    };
  }, [currentSession, duration, setCurrentTime, setPlaying, setLoading, updateProgress]);

  return {
    // État
    currentSession,
    isPlaying,
    isPaused,
    isLoading,
    currentTime,
    duration,
    volume,
    playbackRate,
    
    // Actions
    loadSession,
    play,
    pause,
    togglePlayPause,
    seek,
    forward,
    backward,
    changeVolume,
    changePlaybackRate,
    stop
  };
};

export default useAudioPlayer;
