import { useState, useEffect, useCallback } from 'react';

/**
 * Hook pour les commandes vocales
 * Utilise l'API Web Speech Recognition (natif navigateur)
 */
export const useVoiceCommands = (onCommand) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [transcript, setTranscript] = useState('');

  useEffect(() => {
    // Vérifier le support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'fr-FR';

      recognitionInstance.onresult = (event) => {
        const result = event.results[event.results.length - 1];
        const transcriptText = result[0].transcript.toLowerCase().trim();
        setTranscript(transcriptText);
        
        // Détecter les commandes
        if (transcriptText.includes('pause')) {
          onCommand?.('pause');
        } else if (transcriptText.includes('reprendre') || transcriptText.includes('jouer') || transcriptText.includes('play')) {
          onCommand?.('play');
        } else if (transcriptText.includes('retour') || transcriptText.includes('recule')) {
          onCommand?.('backward');
        } else if (transcriptText.includes('avance') || transcriptText.includes('suivant')) {
          onCommand?.('forward');
        } else if (transcriptText.includes('stop') || transcriptText.includes('arrête')) {
          onCommand?.('stop');
        } else if (transcriptText.includes('volume')) {
          // Extraire le volume si possible
          const match = transcriptText.match(/volume.*?(\d+)/);
          if (match) {
            const vol = parseInt(match[1]) / 100;
            onCommand?.('volume', vol);
          }
        }
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [onCommand]);

  const startListening = useCallback(() => {
    if (recognition && !isListening) {
      try {
        recognition.start();
        setIsListening(true);
      } catch (error) {
        console.error('Error starting recognition:', error);
      }
    }
  }, [recognition, isListening]);

  const stopListening = useCallback(() => {
    if (recognition && isListening) {
      recognition.stop();
      setIsListening(false);
    }
  }, [recognition, isListening]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  return {
    isListening,
    isSupported,
    transcript,
    startListening,
    stopListening,
    toggleListening
  };
};

export default useVoiceCommands;
