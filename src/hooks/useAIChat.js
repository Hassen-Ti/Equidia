import { useState, useCallback } from 'react';
import useAIStore from '../store/aiStore';
import aiService from '../services/aiService';

/**
 * Hook pour gérer le chat AI contextuel
 */
export const useAIChat = (currentSession) => {
  const {
    conversations,
    isAITyping,
    isVoiceMode,
    config,
    addMessage,
    getConversation,
    setAITyping,
    setVoiceMode
  } = useAIStore();

  const [error, setError] = useState(null);

  // Récupérer la conversation actuelle
  const messages = currentSession ? getConversation(currentSession.id) : [];

  // Envoyer un message
  const sendMessage = useCallback(async (userMessage) => {
    if (!currentSession) {
      setError('Aucune séance active');
      return null;
    }

    try {
      setError(null);
      
      // Ajouter le message utilisateur
      addMessage(currentSession.id, 'user', userMessage);
      
      // Préparer les messages pour l'API
      const apiMessages = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      apiMessages.push({ role: 'user', content: userMessage });
      
      setAITyping(true);
      
      // Obtenir la réponse
      const response = await aiService.sendMessage(
        apiMessages,
        currentSession,
        {
          model: config.model,
          temperature: config.temperature,
          maxTokens: config.maxTokens
        }
      );
      
      // Ajouter la réponse de l'assistant
      addMessage(currentSession.id, 'assistant', response);
      
      setAITyping(false);
      
      return response;
    } catch (err) {
      console.error('AI chat error:', err);
      setError(err.message);
      setAITyping(false);
      return null;
    }
  }, [currentSession, messages, config, addMessage, setAITyping]);

  // Envoyer un message vocal
  const sendVoiceMessage = useCallback(async (audioBlob) => {
    if (!currentSession) {
      setError('Aucune séance active');
      return null;
    }

    try {
      setError(null);
      
      // Transcrire l'audio
      const transcription = await aiService.transcribeAudio(audioBlob);
      
      // Envoyer le message transcrit
      const response = await sendMessage(transcription);
      
      // Si mode vocal activé, générer l'audio de la réponse
      if (isVoiceMode && response) {
        const voice = aiService.getVoiceModel(config.voiceGender);
        const audioBlob = await aiService.generateSpeech(response, voice, {
          model: config.voiceModel,
          speed: 1.0
        });
        
        // Jouer l'audio
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.play();
        
        return { text: response, audio: audioBlob };
      }
      
      return { text: response };
    } catch (err) {
      console.error('Voice message error:', err);
      setError(err.message);
      return null;
    }
  }, [currentSession, isVoiceMode, config, sendMessage]);

  // Obtenir les suggestions de questions
  const getSuggestions = useCallback(() => {
    if (!currentSession) return [];
    return aiService.getSuggestedQuestions(currentSession);
  }, [currentSession]);

  // Toggle mode vocal
  const toggleVoiceMode = useCallback(() => {
    setVoiceMode(!isVoiceMode);
  }, [isVoiceMode, setVoiceMode]);

  return {
    messages,
    isAITyping,
    isVoiceMode,
    error,
    sendMessage,
    sendVoiceMessage,
    getSuggestions,
    toggleVoiceMode,
    isConfigured: aiService.isConfigured()
  };
};

export default useAIChat;
