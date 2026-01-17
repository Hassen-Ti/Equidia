import OpenAI from 'openai';

/**
 * AI Service - Intégration OpenAI (GPT-4, Whisper, TTS)
 * Assistant contextuel pour les séances équestres
 */
class AIService {
  constructor() {
    // Initialiser avec la clé API depuis les variables d'environnement
    this.client = new OpenAI({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true // Pour dev uniquement - utiliser proxy en production
    });
  }

  /**
   * Générer un prompt système contextuel pour une séance
   */
  getSystemPrompt(session) {
    return `Tu es un assistant coach équestre expert, spécialisé dans l'accompagnement personnalisé.

**CONTEXTE DE LA SÉANCE ACTUELLE:**
- Nom: ${session.nom}
- Discipline: ${session.discipline}
- Niveau: ${session.niveau}
- Durée: ${session.duree}
- Thème: ${session.theme}
- Objectif: ${session.objectif}

**TES RESPONSABILITÉS:**
1. Répondre UNIQUEMENT aux questions concernant CETTE séance spécifique
2. Expliquer les exercices, techniques et concepts mentionnés
3. Adapter les conseils au niveau du cavalier (${session.niveau})
4. Encourager et motiver avec bienveillance
5. Assurer la sécurité du cavalier et du cheval

**LIMITES STRICTES:**
- NE PAS répondre à des questions hors contexte de cette séance
- NE PAS donner de conseils vétérinaires ou médicaux
- NE PAS proposer d'autres séances (rester sur celle-ci)
- Si question hors sujet, dire: "Je suis spécialisé sur cette séance. Pose-moi une question sur les exercices ou techniques qu'elle contient."

**TON & STYLE:**
- Professionnel mais accessible
- Phrases courtes et claires
- Vocabulaire équestre précis
- Encouragements positifs
- Maximum 3-4 phrases par réponse (sauf explication technique complexe)`;
  }

  /**
   * Envoyer un message au chat
   */
  async sendMessage(messages, session, options = {}) {
    try {
      const systemPrompt = this.getSystemPrompt(session);
      
      const response = await this.client.chat.completions.create({
        model: options.model || 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 500,
        stream: options.stream || false
      });

      if (options.stream) {
        return response; // Stream object
      } else {
        return response.choices[0].message.content;
      }
    } catch (error) {
      console.error('OpenAI chat error:', error);
      throw new Error(`Erreur de communication avec l'assistant: ${error.message}`);
    }
  }

  /**
   * Transcrire l'audio (Speech-to-Text avec Whisper)
   */
  async transcribeAudio(audioBlob) {
    try {
      // Créer un FormData avec le blob audio
      const file = new File([audioBlob], 'audio.webm', { type: 'audio/webm' });

      const response = await this.client.audio.transcriptions.create({
        file: file,
        model: 'whisper-1',
        language: 'fr',
        response_format: 'text'
      });

      return response;
    } catch (error) {
      console.error('Whisper transcription error:', error);
      throw new Error(`Erreur de transcription: ${error.message}`);
    }
  }

  /**
   * Générer de l'audio (Text-to-Speech)
   */
  async generateSpeech(text, voice = 'nova', options = {}) {
    try {
      const response = await this.client.audio.speech.create({
        model: options.model || 'tts-1-hd',
        voice: voice, // nova (female) | onyx (male) | alloy | echo | fable | shimmer
        input: text,
        speed: options.speed || 1.0,
        response_format: options.format || 'mp3'
      });

      // Retourner l'audio en tant que blob
      const buffer = await response.arrayBuffer();
      return new Blob([buffer], { type: 'audio/mpeg' });
    } catch (error) {
      console.error('OpenAI TTS error:', error);
      throw new Error(`Erreur de synthèse vocale: ${error.message}`);
    }
  }

  /**
   * Générer des suggestions de questions
   */
  getSuggestedQuestions(session) {
    const suggestions = [
      `Quels sont les exercices principaux de cette séance?`,
      `Comment réussir "${session.theme}"?`,
      `Quelles sont les erreurs à éviter?`,
      `Comment adapter au niveau ${session.niveau}?`
    ];

    // Ajouter des suggestions spécifiques selon la discipline
    switch (session.discipline) {
      case 'Dressage':
        suggestions.push(`Comment améliorer la légèreté?`);
        break;
      case 'Obstacle':
        suggestions.push(`Comment aborder les barres?`);
        break;
      case 'Cross & Extérieur sportif':
        suggestions.push(`Comment gérer le terrain varié?`);
        break;
      case 'Travail au sol':
        suggestions.push(`Comment établir la connexion?`);
        break;
    }

    return suggestions.slice(0, 4);
  }

  /**
   * Vérifier si l'API key est configurée
   */
  isConfigured() {
    return !!import.meta.env.VITE_OPENAI_API_KEY;
  }

  /**
   * Obtenir le modèle vocal selon le genre
   */
  getVoiceModel(gender = 'female') {
    return gender === 'male' ? 'onyx' : 'nova';
  }
}

// Instance singleton
const aiService = new AIService();

export default aiService;
