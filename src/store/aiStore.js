import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * AI Store - Gestion de l'assistant AI contextuel
 */
const useAIStore = create(
  persist(
    (set, get) => ({
      // Conversations par session
      conversations: {}, // { sessionId: [{ role: 'user'|'assistant', content, timestamp }] }
      
      // État du chat
      currentSessionId: null,
      isAITyping: false,
      isVoiceMode: false,
      isListening: false,
      
      // Configuration
      config: {
        model: 'gpt-4-turbo-preview',
        voiceModel: 'tts-1-hd',
        voiceGender: 'nova', // nova (female) | onyx (male)
        temperature: 0.7,
        maxTokens: 500
      },
      
      // Actions
      setCurrentSessionId: (sessionId) => set({ currentSessionId: sessionId }),
      
      setAITyping: (typing) => set({ isAITyping: typing }),
      
      setVoiceMode: (enabled) => set({ isVoiceMode: enabled }),
      
      setListening: (listening) => set({ isListening: listening }),
      
      // Gestion des conversations
      addMessage: (sessionId, role, content) => {
        const conversations = get().conversations;
        const sessionConversation = conversations[sessionId] || [];
        set({
          conversations: {
            ...conversations,
            [sessionId]: [
              ...sessionConversation,
              { role, content, timestamp: Date.now() }
            ]
          }
        });
      },
      
      clearConversation: (sessionId) => {
        const conversations = get().conversations;
        set({
          conversations: {
            ...conversations,
            [sessionId]: []
          }
        });
      },
      
      getConversation: (sessionId) => {
        return get().conversations[sessionId] || [];
      },
      
      // Configuration
      updateConfig: (updates) => set((state) => ({
        config: { ...state.config, ...updates }
      })),
      
      setVoiceGender: (gender) => set((state) => ({
        config: {
          ...state.config,
          voiceGender: gender === 'male' ? 'onyx' : 'nova'
        }
      })),
      
      // Stats
      getTotalMessages: () => {
        const conversations = get().conversations;
        return Object.values(conversations).reduce(
          (total, conv) => total + conv.length,
          0
        );
      },
      
      getSessionMessageCount: (sessionId) => {
        return (get().conversations[sessionId] || []).length;
      }
    }),
    {
      name: 'equicoach-ai-storage',
      partialize: (state) => ({
        conversations: state.conversations,
        config: state.config
      })
    }
  )
);

export default useAIStore;
