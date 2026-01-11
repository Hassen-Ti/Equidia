# Lecteur Vocal Intelligent & Assistant

Cette application web utilise des API de pointe pour une interaction vocale naturelle.

## Modes Disponibles

### 1. Web Speech (Gratuit)
- **Speech-to-Text** : API native du navigateur (Google sur Chrome/Edge)
- **Text-to-Speech** : Voix système Windows
- ✅ Gratuit, pas de configuration
- ⚠️ Qualité variable, voix robotiques

### 2. OpenAI (Premium) ⭐ Recommandé
- **Speech-to-Text** : Whisper (reconnaissance ultra-précise)
- **Text-to-Speech** : Voix neuronales réalistes (Nova, Alloy, Echo, Shimmer)
- ✅ Qualité exceptionnelle, naturelle
- 💰 Nécessite une clé API OpenAI ([Obtenir une clé](https://platform.openai.com/api-keys))

## Configuration OpenAI

1. Cliquez sur l'icône ⚙️ en haut à droite
2. Sélectionnez "**OpenAI (Premium)**"
3. Collez votre clé API OpenAI (`sk-...`)
4. Choisissez votre voix préférée
5. Cliquez sur "**Enregistrer**"

> **⚠️ Sécurité** : La clé API est stockée localement dans votre navigateur. Ne partagez jamais cette clé. Pour une application en production, utilisez un backend pour masquer la clé.

## Commandes Vocales

| Mode | Commande | Action |
| :--- | :--- | :--- |
| **Lecteur** | "Start" | Lance ou reprend la lecture du texte |
| | "Pause" | Arrête la lecture en conservant la position |
| | "Recommence" | Reprend depuis le début |
| | "Répète" | Revient à la phrase précédente (~10s) |
| | "Assistant" | Bascule en mode Assistant |
| **Assistant** | "Bonjour" | Salutation |
| | "Quelle heure est-il ?" | Donne l'heure actuelle |
| | "Qui es-tu ?" | Présentation de l'assistant |
| | "Aide-moi" | Liste des fonctionnalités |
| | "Lecteur" | Bascule en mode Lecteur |

## Installation

1. Clonez ou téléchargez le projet
2. Ouvrez `index.html` dans **Chrome** ou **Edge**
3. Autorisez l'accès au microphone
4. (Optionnel) Configurez OpenAI pour une meilleure qualité

## Coûts OpenAI

- **Whisper** : ~$0.006 par minute d'audio
- **TTS** : ~$0.015 par 1000 caractères

Pour un usage normal (~30 min/jour), comptez < $1/mois.
