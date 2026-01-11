# Lecteur Vocal Intelligent & Assistant

Cette application web utilise l'API **Web Speech** (Speech Recognition & Speech Synthesis) pour permettre une interaction naturelle entre l'utilisateur et le texte.

## Fonctionnement du Text-To-Speech (TTS)
Le TTS est géré par l'objet `window.speechSynthesis`.
1. **Découpage** : Le texte est fragmenté en phrases pour permettre une navigation précise.
2. **Configuration** : La langue est fixée sur `fr-FR` avec une vitesse de lecture standard (`rate: 1.0`).
3. **Contrôle** : L'application suit l'index de la phrase en cours, permettant de mettre en pause, de reprendre ou de reculer.

## Commandes Vocales
L'application écoute en permanence via `window.SpeechRecognition`. Voici les commandes disponibles :

| Commande | Action |
| :--- | :--- |
| **"Start"** | Lance ou reprend la lecture du texte. |
| **"Pause"** | Arrête immédiatement la lecture en conservant la position actuelle. |
| **"Recommence"** | Reprend la lecture depuis le tout début du texte. |
| **"Répète"** | Revient à la phrase précédente (équivalent à un recul de ~10s). |

## Assistant Vocal (Nouveau)
L'assistant vous permet de poser des questions simples ou de discuter. Il utilise la reconnaissance vocale pour comprendre vos demandes et la synthèse vocale pour vous répondre.

## Installation
1. Clonez le dépôt ou téléchargez les fichiers.
2. Ouvrez `index.html` dans un navigateur moderne (Chrome ou Edge recommandés).
3. Cliquez sur le bouton d'activation pour autoriser le microphone.
