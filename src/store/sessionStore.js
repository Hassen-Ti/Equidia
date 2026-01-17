import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import SeancesData from '../data/seances';

/**
 * Session Store - Gestion des séances d'entraînement
 */
const useSessionStore = create(
  persist(
    (set, get) => ({
      // Données des séances
      sessions: SeancesData,
      
      // Filtres actifs
      filters: {
        discipline: 'all',
        niveau: 'all',
        duree: 'all',
        type: 'all',
        search: ''
      },
      
      // Statistiques utilisateur
      stats: {
        totalSessions: 0,
        totalMinutes: 0,
        completedSessions: [],
        streakDays: 0,
        lastSessionDate: null
      },
      
      // Actions
      setFilters: (filters) => set({ filters }),
      
      updateFilter: (key, value) => set((state) => ({
        filters: { ...state.filters, [key]: value }
      })),
      
      resetFilters: () => set({
        filters: {
          discipline: 'all',
          niveau: 'all',
          duree: 'all',
          type: 'all',
          search: ''
        }
      }),
      
      // Récupérer les séances filtrées
      getFilteredSessions: () => {
        const { sessions, filters } = get();
        let filtered = sessions;
        
        if (filters.discipline !== 'all') {
          filtered = filtered.filter(s => s.discipline === filters.discipline);
        }
        
        if (filters.niveau !== 'all') {
          filtered = filtered.filter(s => s.niveau === filters.niveau);
        }
        
        if (filters.duree !== 'all') {
          filtered = filtered.filter(s => s.duree === filters.duree);
        }
        
        if (filters.type !== 'all') {
          filtered = filtered.filter(s => s.type === filters.type);
        }
        
        if (filters.search) {
          const search = filters.search.toLowerCase();
          filtered = filtered.filter(s =>
            s.nom.toLowerCase().includes(search) ||
            s.theme.toLowerCase().includes(search) ||
            s.objectif.toLowerCase().includes(search)
          );
        }
        
        return filtered;
      },
      
      // Récupérer une séance par ID
      getSessionById: (id) => {
        return get().sessions.find(s => s.id === id);
      },
      
      // Statistiques
      completeSession: (sessionId, durationMinutes) => {
        const stats = get().stats;
        const session = get().getSessionById(sessionId);
        
        set({
          stats: {
            ...stats,
            totalSessions: stats.totalSessions + 1,
            totalMinutes: stats.totalMinutes + (durationMinutes || parseInt(session?.duree) || 0),
            completedSessions: [...stats.completedSessions, {
              id: sessionId,
              completedAt: Date.now(),
              duration: durationMinutes
            }],
            lastSessionDate: Date.now()
          }
        });
        
        // Calculer la streak
        get().calculateStreak();
      },
      
      calculateStreak: () => {
        const stats = get().stats;
        const today = new Date().setHours(0, 0, 0, 0);
        const completedDates = stats.completedSessions
          .map(s => new Date(s.completedAt).setHours(0, 0, 0, 0))
          .filter((date, index, self) => self.indexOf(date) === index)
          .sort((a, b) => b - a);
        
        let streak = 0;
        let currentDate = today;
        
        for (const date of completedDates) {
          if (date === currentDate) {
            streak++;
            currentDate -= 86400000; // 1 jour en ms
          } else if (date < currentDate) {
            break;
          }
        }
        
        set({
          stats: {
            ...stats,
            streakDays: streak
          }
        });
      },
      
      // Recommandations
      getRecommendedSessions: (userLevel, userDiscipline, limit = 5) => {
        const sessions = get().sessions;
        const history = get().stats.completedSessions;
        
        // Exclure les séances déjà complétées récemment
        const recentlyCompleted = history
          .slice(-10)
          .map(s => s.id);
        
        const available = sessions.filter(s => !recentlyCompleted.includes(s.id));
        
        // Filtrer par niveau et discipline si fournis
        let filtered = available;
        if (userLevel) {
          filtered = filtered.filter(s => s.niveau === userLevel);
        }
        if (userDiscipline && userDiscipline !== 'Transversal') {
          filtered = filtered.filter(s => 
            s.discipline === userDiscipline || s.discipline === 'Transversal'
          );
        }
        
        // Mélanger et limiter
        return filtered
          .sort(() => Math.random() - 0.5)
          .slice(0, limit);
      }
    }),
    {
      name: 'equicoach-session-storage',
      partialize: (state) => ({
        filters: state.filters,
        stats: state.stats
      })
    }
  )
);

export default useSessionStore;
