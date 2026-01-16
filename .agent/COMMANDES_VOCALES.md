# 🎙️ SYSTÈME DE COMMANDES VOCALES - EQUICOACH

**Document de référence pour l'implémentation des commandes vocales dans l'application**

---

## 🎯 APPROCHE RETENUE : SYSTÈME HYBRIDE

### Principe :
L'audio attend **SOIT** la fin du timeout **SOIT** une commande vocale du cavalier.
- Si le cavalier dit **"C'est fait"** → Passe immédiatement à la consigne suivante
- Si le cavalier ne dit rien → L'audio continue automatiquement après le timeout

**Avantages :**
- ✅ Fonctionne même si les commandes vocales échouent (fallback automatique)
- ✅ Cavaliers avancés peuvent accélérer la séance
- ✅ Cavaliers débutants peuvent prendre leur temps
- ✅ Pas de friction technique bloquante
- ✅ Optimise le temps de séance (pas de silences inutiles)

---

## 📋 COMMANDES VOCALES - PHASE 1 (MVP)

### Commandes essentielles à implémenter :

| Commande | Action | Priorité |
|----------|--------|----------|
| **"C'est fait"** / **"Exercice terminé"** | Passe à la consigne suivante immédiatement | 🔴 CRITIQUE |
| **"Stop"** / **"Pause"** | Met l'audio en pause | 🔴 CRITIQUE |
| **"Continue"** / **"Reprends"** | Reprend l'audio | 🔴 CRITIQUE |
| **"Répète"** / **"Redis"** | Répète la dernière consigne | 🟡 IMPORTANT |
| **"Explique [mot]"** | Explique un terme technique | 🟢 BONUS |

---

## 🔧 IMPLÉMENTATION TECHNIQUE

### Pseudo-code :
```javascript
function waitForUserOrTimeout(timeoutSeconds, voiceCommands = ["C'est fait", "Exercice terminé"]) {
  return Promise.race([
    waitForVoiceCommand(voiceCommands),  // Écoute les commandes vocales
    sleep(timeoutSeconds * 1000)         // OU attend X secondes
  ]);
}

// Exemple d'utilisation dans un script :
await playAudio("Engage-toi sur la ligne d'obstacles.");
await playAudio("Garde ton galop stable.");
await waitForUserOrTimeout(60);  // Attend max 60s ou "C'est fait"
await playAudio("Très bien, reviens au pas.");
```

### Technologies recommandées :
- **Speech Recognition API** (Web Speech API) pour le navigateur
- **Google Speech-to-Text** ou **Whisper (OpenAI)** pour plus de précision
- **Wake word detection** optionnel pour éviter les faux positifs

---

## 📝 FORMAT DES SCRIPTS AUDIO

### Structure avec système hybride :

```markdown
## [EXERCICE X : Nom de l'exercice]

Consigne de préparation.
[Pause : 5 secondes]
Consigne d'action.
[Pause : 3 secondes]

[ATTENTE : 60 secondes OU commande "C'est fait"]

Feedback positif.
[Pause : 3 secondes]
Consigne suivante.
```

### Notation dans les scripts :
- `[ATTENTE : X secondes OU commande "C'est fait"]` → Indique un point d'attente hybride
- `[Pause : X secondes]` → Pause fixe (pas d'interruption possible)

---

## 🎯 RÈGLES D'ÉCRITURE DES SCRIPTS

### Quand utiliser l'attente hybride :

✅ **À UTILISER pour :**
- Passages d'obstacles
- Exercices longs (cercles, serpentines)
- Transitions d'allure
- Tout exercice dont la durée varie selon le cheval/cavalier

❌ **NE PAS UTILISER pour :**
- Consignes courtes (< 10 secondes)
- Instructions de position
- Transitions pédagogiques (explications)

### Exemple BON :
```markdown
Engage-toi sur la ligne d'obstacles.
[Pause : 3 secondes]
Garde ton galop stable.
[Pause : 3 secondes]

[ATTENTE : 60 secondes OU commande "C'est fait"]

Très bien, reviens au pas.
```

### Exemple MAUVAIS :
```markdown
Relâche tes épaules.
[ATTENTE : 5 secondes OU commande "C'est fait"]  ❌ Trop court, pas nécessaire
```

---

## 🚀 ÉVOLUTION FUTURE

### PHASE 2 : IA Conversationnelle (6-12 mois)

**Commandes avancées à ajouter :**
- 🎤 **"Mon cheval a refusé"** → IA donne des conseils
- 🎤 **"Il manque d'impulsion"** → IA adapte les consignes
- 🎤 **"Il accélère trop"** → IA donne des corrections
- 🎤 **"Je n'ai pas compris"** → IA réexplique
- 🎤 **"Qu'est-ce que je fais maintenant ?"** → IA rappelle la consigne

**Technologies nécessaires :**
- GPT-4 ou Claude pour le dialogue
- Base de données de conseils par type de problème
- Historique des séances pour personnalisation

### PHASE 3 : IA Contextuelle + Caméra (12-24 mois)

**Détection automatique :**
- 📹 Caméra détecte les refus, dérobades, problèmes
- 🎙️ IA intervient automatiquement avec des conseils
- 🎤 Cavalier peut confirmer ou demander plus de détails

---

## 📌 NOTE IMPORTANTE POUR LES SCRIPTS

**Tous les scripts doivent inclure une introduction aux commandes vocales :**

```markdown
## [INTRODUCTION]

Bonjour et bienvenue dans cette séance...
[Pause : 5 secondes]

Pendant cette séance, tu peux utiliser des commandes vocales pour adapter le rythme à ton cheval.
[Pause : 3 secondes]
Dis "C'est fait" pour passer plus rapidement à la consigne suivante.
[Pause : 3 secondes]
Dis "Stop" pour mettre en pause, et "Continue" pour reprendre.
[Pause : 5 secondes]

C'est parti.
[Pause : 3 secondes]
```

---

## ✅ CHECKLIST DÉVELOPPEMENT

### Pour la V1 (MVP) :
- [ ] Implémenter la reconnaissance vocale (Web Speech API ou équivalent)
- [ ] Gérer les 5 commandes essentielles
- [ ] Système hybride : timeout OU commande vocale
- [ ] Tester avec différents accents/voix
- [ ] Gérer les erreurs (micro non disponible, etc.)
- [ ] Ajouter un indicateur visuel "En écoute" dans l'app
- [ ] Permettre de désactiver les commandes vocales (mode manuel)

### Pour la V2 (IA conversationnelle) :
- [ ] Intégrer GPT-4/Claude
- [ ] Base de données de conseils
- [ ] Gestion du contexte de la séance
- [ ] Historique des problèmes récurrents
- [ ] Personnalisation selon le profil cavalier

---

## 🎯 OBJECTIF FINAL

**Créer une expérience fluide où :**
1. Les cavaliers débutants peuvent suivre à leur rythme (timeouts longs)
2. Les cavaliers avancés peuvent optimiser leur temps ("C'est fait")
3. Tous les cavaliers peuvent gérer les imprévus (pause, répéter)
4. L'IA s'adapte progressivement aux besoins de chacun (Phase 2+)

---

**Date de création :** 11/01/2026  
**Dernière mise à jour :** 11/01/2026
