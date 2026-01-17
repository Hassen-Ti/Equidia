import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Audio Store - Gestion centralisée de la lecture audio
 * Compatible avec Howler.js et MediaSession API
 */
const useAudioStore = create(
  persist(
    (set, get) => ({
      // État du lecteur
      currentSession: null,
      isPlaying: false,
      isPaused: false,
      isLoading: false,
      currentTime: 0,
      duration: 0,
      volume: 1.0,
      playbackRate: 1.0,
      
      // File d'attente et historique
      queue: [],
      history: [],
      
      // Bookmarks et progression
      bookmarks: {}, // { sessionId: [{ time, label }] }
      progress: {}, // { sessionId: { lastPosition, completedAt } }
      
      // Actions
      setCurrentSession: (session) => set({ currentSession: session }),
      
      setPlaying: (playing) => set({ isPlaying: playing, isPaused: !playing }),
      
      setPaused: (paused) => set({ isPaused: paused, isPlaying: !paused }),
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      setCurrentTime: (time) => set({ currentTime: time }),
      
      setDuration: (duration) => set({ duration: duration }),
      
      setVolume: (volume) => set({ volume: Math.max(0, Math.min(1, volume)) }),
      
      setPlaybackRate: (rate) => set({ playbackRate: Math.max(0.5, Math.min(2, rate)) }),
      
      // Gestion des bookmarks
      addBookmark: (sessionId, time, label) => {
        const bookmarks = get().bookmarks;
        const sessionBookmarks = bookmarks[sessionId] || [];
        set({
          bookmarks: {
            ...bookmarks,
            [sessionId]: [...sessionBookmarks, { time, label, createdAt: Date.now() }]
          }
        });
      },
      
      removeBookmark: (sessionId, index) => {
        const bookmarks = get().bookmarks;
        const sessionBookmarks = bookmarks[sessionId] || [];
        set({
          bookmarks: {
            ...bookmarks,
            [sessionId]: sessionBookmarks.filter((_, i) => i !== index)
          }
        });
      },
      
      // Gestion de la progression
      updateProgress: (sessionId, position) => {
        const progress = get().progress;
        set({
          progress: {
            ...progress,
            [sessionId]: {
              lastPosition: position,
              lastPlayedAt: Date.now(),
              completedAt: position >= get().duration * 0.9 ? Date.now() : progress[sessionId]?.completedAt
            }
          }
        });
      },
      
      // Gestion de l'historique
      addToHistory: (session) => {
        const history = get().history;
        const filtered = history.filter(s => s.id !== session.id);
        set({
          history: [{ ...session, playedAt: Date.now() }, ...filtered].slice(0, 50)
        });
      },
      
      // Gestion de la file d'attente
      addToQueue: (session) => {
        const queue = get().queue;
        set({ queue: [...queue, session] });
      },
      
      removeFromQueue: (sessionId) => {
        const queue = get().queue;
        set({ queue: queue.filter(s => s.id !== sessionId) });
      },
      
      clearQueue: () => set({ queue: [] }),
      
      // Réinitialiser le lecteur
      reset: () => set({
        currentSession: null,
        isPlaying: false,
        isPaused: false,
        isLoading: false,
        currentTime: 0,
        duration: 0
      })
    }),
    {
      name: 'equicoach-audio-storage',
      partialize: (state) => ({
        bookmarks: state.bookmarks,
        progress: state.progress,
        history: state.history,
        volume: state.volume,
        playbackRate: state.playbackRate
      })
    }
  )
);

export default useAudioStore;
