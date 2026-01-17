import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * User Store - Gestion du profil utilisateur
 */
const useUserStore = create(
  persist(
    (set, get) => ({
      // Profil utilisateur
      profile: {
        nom: '',
        niveau: '',
        discipline: '',
        objectifs: [],
        experience: ''
      },
      
      // Chevaux
      horses: [],
      currentHorse: null,
      
      // Préférences
      preferences: {
        voiceGender: 'female', // 'female' | 'male'
        voiceSpeed: 1.0,
        autoPlay: true,
        notifications: true,
        theme: 'light' // 'light' | 'dark'
      },
      
      // Sessions favorites
      favorites: [],
      
      // Actions
      setProfile: (profile) => set({ profile }),
      
      updateProfile: (updates) => set((state) => ({
        profile: { ...state.profile, ...updates }
      })),
      
      setHorses: (horses) => set({ horses }),
      
      addHorse: (horse) => set((state) => ({
        horses: [...state.horses, { ...horse, id: Date.now() }]
      })),
      
      removeHorse: (horseId) => set((state) => ({
        horses: state.horses.filter(h => h.id !== horseId),
        currentHorse: state.currentHorse?.id === horseId ? null : state.currentHorse
      })),
      
      setCurrentHorse: (horse) => set({ currentHorse: horse }),
      
      setPreferences: (preferences) => set({ preferences }),
      
      updatePreferences: (updates) => set((state) => ({
        preferences: { ...state.preferences, ...updates }
      })),
      
      // Gestion des favoris
      addFavorite: (sessionId) => set((state) => ({
        favorites: state.favorites.includes(sessionId) 
          ? state.favorites 
          : [...state.favorites, sessionId]
      })),
      
      removeFavorite: (sessionId) => set((state) => ({
        favorites: state.favorites.filter(id => id !== sessionId)
      })),
      
      toggleFavorite: (sessionId) => {
        const favorites = get().favorites;
        if (favorites.includes(sessionId)) {
          get().removeFavorite(sessionId);
        } else {
          get().addFavorite(sessionId);
        }
      },
      
      isFavorite: (sessionId) => get().favorites.includes(sessionId)
    }),
    {
      name: 'equicoach-user-storage'
    }
  )
);

export default useUserStore;
