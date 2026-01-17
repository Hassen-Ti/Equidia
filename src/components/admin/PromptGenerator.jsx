import React, { useState } from 'react';
import { Copy, CheckCircle, FileText } from 'lucide-react';

export default function PromptGenerator({ seance, onClose }) {
    const [copied, setCopied] = useState(false);

    const generatePrompt = () => {
        const dureeNum = parseInt(seance.duree);

        return `Rédige-moi un script audio COMPLET et DÉTAILLÉ de ${seance.duree} pour une séance d'équitation niveau ${seance.niveau}.

INFORMATIONS DE LA SÉANCE :
- Titre : "${seance.nom}"
- Discipline : ${seance.discipline}
- Thème : ${seance.theme}
- Niveau : ${seance.niveau}
- Durée : ${seance.duree}
- Intensité : ${seance.intensite}
- Objectif : ${seance.objectif}

FORMAT OBLIGATOIRE À RESPECTER EXACTEMENT :

# Script Audio : ${seance.nom}
**Durée totale : ${seance.duree} | Niveau : ${seance.niveau} | Intensité : ${seance.intensite}**

---

## [00:00] INTRODUCTION (30 secondes)

[Texte d'accueil chaleureux présentant l'objectif de la séance]

---

## [00:30] ÉCHAUFFEMENT - PHASE 1 : [Titre] (X minutes)

### [XX:XX-XX:XX] [Nom de l'exercice] (X minutes)

[Instructions détaillées avec conseils de position]

*[Pause X secondes]*

[Suite des instructions]

### [XX:XX-XX:XX] [Exercice suivant]

[...]

---

## [XX:XX] TRAVAIL PRINCIPAL : [Titre] (X minutes)

### [XX:XX-XX:XX] Exercice 1 : [Nom] (Xmin)

[Instructions très détaillées avec :
- Position des mains, jambes, assiette
- Conseils techniques précis
- Corrections possibles
- Encouragements]

*[Pause X secondes]*

[Suite]

### [XX:XX-XX:XX] PAUSE CHEVAL (30 secondes)

Rênes longues, laissez votre cheval marcher librement au pas. Il a bien travaillé, il mérite une pause. Vous aussi, relâchez vos épaules, respirez.

### [XX:XX-XX:XX] Exercice 2 : [...]

[...]

---

## [XX:XX] RETOUR AU CALME (X minutes)

### [XX:XX-XX:XX] Détente au pas rênes longues (X minutes)

[Instructions de retour au calme]

*[Pause musicale douce X secondes]*

[...]

### [XX:XX-XX:XX] Étirements en selle (X minutes)

[Instructions d'étirements]

---

## [XX:XX] CONCLUSION (2 minutes)

### [XX:XX-XX:XX] Bilan et félicitations (1min30)

[Récapitulatif de la séance, encouragements, conseils]

*[Pause 5 secondes]*

[...]

### [XX:XX-XX:XX] Mot de fin (30 secondes)

Merci d'avoir suivi cette séance. N'hésitez pas à la refaire régulièrement pour ancrer les exercices. À très bientôt pour une nouvelle séance d'entraînement. Bonne continuation avec votre cheval ! 🐴

---

**FIN DE LA SÉANCE - Durée totale : ${seance.duree}**

---

## NOTES TECHNIQUES POUR L'ENREGISTREMENT

**Ton de voix :** Calme, encourageant, pédagogue, chaleureux
**Rythme :** Posé, avec des pauses régulières pour laisser le temps d'exécuter
**Musique de fond :** Douce et discrète (optionnelle), seulement pendant les pauses
**Effet sonores :** Possibilité d'ajouter un petit "ding" doux lors des changements de section

**Conseils de lecture :**
- Ralentir sur les instructions techniques
- Insister légèrement sur les mots-clés (jambe intérieure, main extérieure, etc.)
- Garder une énergie positive tout au long
- Les pauses indiquées sont cruciales : respecter les silences

---

INSTRUCTIONS SPÉCIFIQUES POUR CETTE SÉANCE :

1. STRUCTURE TEMPORELLE :
   - Introduction : 30 secondes [00:00-00:30]
   - Échauffement : ${Math.floor(dureeNum * 0.25)} minutes environ
   - Travail principal : ${Math.floor(dureeNum * 0.5)} minutes environ (avec 2-3 pauses cheval de 30s)
   - Retour au calme : ${Math.floor(dureeNum * 0.17)} minutes environ
   - Conclusion : 2 minutes

2. CONTENU À ADAPTER SELON LE NIVEAU :
   ${seance.niveau === 'G2-3' ? `
   - Niveau DÉBUTANT : Instructions très détaillées, exercices simples
   - Vocabulaire accessible, explications claires
   - Beaucoup d'encouragements et de patience
   - Exercices : grands cercles, lignes droites, transitions simples
   - Pas de mouvements complexes` : ''}
   ${seance.niveau === 'G3-4' ? `
   - Niveau INTERMÉDIAIRE : Instructions précises avec corrections
   - Exercices variés mais accessibles
   - Introduction de figures plus techniques
   - Travail de la précision et de la régularité` : ''}
   ${seance.niveau === 'G4-5' ? `
   - Niveau INTERMÉDIAIRE CONFIRMÉ : Exercices techniques
   - Finesse des aides, précision demandée
   - Enchaînements plus complexes
   - Travail de la qualité et de la fluidité` : ''}
   ${seance.niveau === 'G5-6' || seance.niveau === 'G6-7' ? `
   - Niveau CONFIRMÉ : Exercices avancés
   - Mouvements latéraux, variations d'amplitude
   - Précision et finesse exigées
   - Travail de perfectionnement` : ''}
   ${seance.niveau === 'G7+' ? `
   - Niveau AVANCÉ : Exercices de haute école
   - Mouvements complexes (épaule en dedans, appuyer, etc.)
   - Très haute précision technique
   - Travail de raffinement` : ''}

3. CONTENU À ADAPTER SELON LA DISCIPLINE :
   ${seance.discipline === 'Dressage' ? `
   - Focus sur la position, l'incurvation, les transitions
   - Travail sur le plat avec précision
   - Exercices de souplesse et d'équilibre` : ''}
   ${seance.discipline === 'Travail à pied' ? `
   - Pas de cavalier monté
   - Instructions pour le travail en longe, en liberté, ou en main
   - Focus sur la communication, le respect, la musculation du cheval
   - Exercices au sol (barres, cavalettis si applicable)` : ''}
   ${seance.discipline === 'Obstacle' ? `
   - Échauffement sur le plat puis passage aux obstacles
   - Instructions pour l'abord, la trajectoire, l'équilibre
   - Progression graduelle dans la hauteur/difficulté
   - Conseils de sécurité renforcés` : ''}
   ${seance.discipline === 'Balade' ? `
   - Contexte extérieur (chemins, forêt, terrain varié)
   - Gestion du cheval en extérieur
   - Exercices adaptés au terrain
   - Sécurité et vigilance accrues` : ''}
   ${seance.discipline === 'Transversal' ? `
   - Exercices applicables à toutes disciplines
   - Focus sur le thème spécifique (${seance.theme})
   - Adaptable au contexte du cavalier` : ''}

4. EXERCICES À INCLURE SELON LE THÈME "${seance.theme}" :
   - Créer 3-4 exercices progressifs en lien direct avec ce thème
   - Chaque exercice doit avoir un timing précis
   - Inclure des variantes et des corrections
   - Terminer par un exercice de synthèse

5. STYLE D'ÉCRITURE :
   - Tutoiement
   - Ton chaleureux et encourageant
   - Instructions à la 2ème personne du pluriel ("Tracez", "Pensez à", "Veillez à")
   - Pauses régulières marquées *[Pause X secondes]*
   - Félicitations fréquentes ("Très bien !", "Parfait !", "Excellent !")

6. IMPORTANT :
   - TOUS les timings doivent être indiqués au format [MM:SS]
   - Les durées doivent être cohérentes et totaliser exactement ${seance.duree}
   - Inclure des pauses cheval de 30 secondes toutes les 3-4 minutes de travail
   - Le script doit être COMPLET et prêt à être lu/enregistré tel quel

Génère maintenant le script audio complet en suivant EXACTEMENT ce format !`;
    };

    const prompt = generatePrompt();

    const copyToClipboard = () => {
        navigator.clipboard.writeText(prompt);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="bg-blue-600 p-4 text-white">
                    <div className="flex items-center gap-3 mb-2">
                        <FileText size={24} />
                        <h2 className="text-xl font-bold">Générateur de Prompt</h2>
                    </div>
                    <p className="text-blue-100 text-sm">#{seance.id} - {seance.nom}</p>
                </div>

                {/* Instructions */}
                <div className="bg-blue-50 p-4 border-b">
                    <h3 className="font-semibold text-blue-900 mb-2">📋 Comment utiliser ce prompt ?</h3>
                    <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                        <li>Cliquez sur le bouton "Copier le prompt" ci-dessous</li>
                        <li>Allez sur ChatGPT, Claude, ou une autre IA</li>
                        <li>Collez le prompt et appuyez sur Entrée</li>
                        <li>L'IA va générer le script audio complet au format détaillé</li>
                        <li>Utilisez ensuite ce script avec une IA vocale (ElevenLabs, etc.)</li>
                    </ol>
                </div>

                {/* Prompt Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                    <pre className="bg-white p-4 rounded-lg border border-gray-200 text-sm whitespace-pre-wrap font-mono leading-relaxed">
                        {prompt}
                    </pre>
                </div>

                {/* Footer Actions */}
                <div className="bg-gray-100 p-4 border-t flex justify-between items-center">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition"
                    >
                        Fermer
                    </button>

                    <button
                        onClick={copyToClipboard}
                        className={`px-6 py-2 rounded-lg font-semibold transition flex items-center gap-2 ${copied
                                ? 'bg-green-500 text-white'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                    >
                        {copied ? (
                            <>
                                <CheckCircle size={20} />
                                Copié !
                            </>
                        ) : (
                            <>
                                <Copy size={20} />
                                Copier le prompt
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
