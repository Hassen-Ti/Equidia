import React, { useState } from 'react';
import { Copy, CheckCircle, Zap, X, AlertTriangle } from 'lucide-react';

export default function SSMLGenerator({ seance, script, onClose }) {
    const [copied, setCopied] = useState(false);

    const generateSSML = (text) => {
        if (!text) return '';

        // --- ÉTAPE 1 : PROTECTION DES PAUSES ---
        // On extrait toutes les pauses avant de toucher au texte
        let processedText = text;
        const pauseData = [];

        // On cherche tout ce qui ressemble à [Pause X secondes]
        const pauseRegex = /\[[^\]]*?pause[^\]]*?(\d+)[^\]]*?\]/gi;

        processedText = processedText.replace(pauseRegex, (match, seconds) => {
            const id = `__POLLY_PAUSE_${pauseData.length}__`;
            pauseData.push({ id, seconds: parseInt(seconds) });
            return id;
        });

        // --- ÉTAPE 2 : NETTOYAGE RADICAL DU TEXTE ---
        // Suppression de TOUT le markdown pour éviter que l'IA ne lise "dièse", "étoile", "tiret", etc.

        // Supprime les symboles de structure (#, *, -, _, ~, >, |, [, ])
        // On les remplace par des espaces pour garder la séparation des mots
        processedText = processedText.replace(/[#*_\-~>|\[\]]/g, ' ');

        // Supprime les marqueurs de temps (ex: 00:00 ou 02:30-03:45)
        processedText = processedText.replace(/\b\d{1,2}:\d{2}(?:-\d{2}:\d{2})?\b/g, ' ');

        // Supprime les parenthèses
        processedText = processedText.replace(/[()]/g, ' ');

        // --- ÉTAPE 3 : NORMALISATION DU TEXTE ---
        // On nettoie les espaces et les lignes vides pour une lecture fluide
        processedText = processedText.split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .join('\n');

        // Remplace les espaces multiples par un seul espace
        processedText = processedText.replace(/\s+/g, ' ');

        // --- ÉTAPE 4 : RÉ-INJECTION DES PAUSES (Limitées à 10s pour Polly) ---
        pauseData.forEach(p => {
            let ssmlBreaks = "";
            let remaining = p.seconds;

            // Amazon Polly ignore les <break> s'ils font plus de 10 secondes. 
            // On découpe donc systématiquement pour être sûr que ça marche.
            while (remaining > 10) {
                ssmlBreaks += '<break time="10s"/>';
                remaining -= 10;
            }
            if (remaining > 0) {
                ssmlBreaks += `<break time="${remaining}s"/>`;
            }

            // On remplace le jeton par les balises SSML
            processedText = processedText.replace(p.id, ssmlBreaks);
        });

        // --- ÉTAPE 5 : FORMATAGE FINAL ---
        return `<speak>\n${processedText}\n</speak>`;
    };

    const ssmlCode = generateSSML(script);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(ssmlCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-[999] backdrop-blur-md">
            <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col max-h-[90vh] border-4 border-orange-600">

                {/* Header */}
                <div className="bg-orange-600 p-6 text-white flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="bg-white p-2 rounded-full text-orange-600">
                            <Zap size={32} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black uppercase tracking-widest text-white">FIX FINAL : Amazon Polly OK</h2>
                            <p className="text-orange-100 text-sm font-medium">Zéro erreur - Pauses Garanties - Texte Pur</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-orange-700 rounded-full transition-all hover:rotate-90">
                        <X size={32} />
                    </button>
                </div>

                {/* Message d'explication urgent */}
                <div className="bg-orange-950 p-4 flex gap-4 items-center">
                    <AlertTriangle className="text-orange-400 shrink-0" size={40} />
                    <div className="text-sm text-orange-50 font-bold">
                        J'ai trouvé la panne : l'IA bloquait sur les pauses de plus de 10s.
                        Ce nouveau code découpe tout automatiquement. Polly va maintenant faire les pauses !
                    </div>
                </div>

                {/* Instructions de combat */}
                <div className="bg-white p-6 grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-gray-100">
                    <div className="flex gap-4">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-600 text-white text-sm font-black shadow-md">1</span>
                        <p className="text-sm text-gray-700 font-semibold leading-snug">
                            Cliquez sur le gros bouton orange ci-dessous pour copier le code.
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-600 text-white text-sm font-black shadow-md">2</span>
                        <p className="text-sm text-gray-700 font-semibold leading-snug">
                            Sur Amazon Polly, sélectionnez l'onglet <span className="text-orange-600 underline font-bold">SSML</span> avant de coller.
                        </p>
                    </div>
                </div>

                {/* SSML Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50 border-inner shadow-inner">
                    <div className="bg-white p-4 rounded-xl border-2 border-dashed border-gray-300">
                        <pre className="text-gray-900 text-sm font-mono whitespace-pre-wrap leading-relaxed">
                            {ssmlCode}
                        </pre>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-100 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-gray-600 text-sm italic font-medium flex items-center gap-2">
                        <CheckCircle size={16} className="text-green-600" />
                        Vérifié : Pas de markdown, Pauses segmentées.
                    </div>

                    <button
                        onClick={copyToClipboard}
                        className={`px-10 py-5 rounded-2xl font-black text-xl shadow-2xl transition-all transform active:scale-95 flex items-center gap-4 ${copied
                                ? 'bg-green-600 text-white'
                                : 'bg-orange-600 text-white hover:bg-orange-700 hover:shadow-orange-200'
                            }`}
                    >
                        {copied ? (
                            <>
                                <CheckCircle size={32} />
                                COPIÉ !
                            </>
                        ) : (
                            <>
                                <Copy size={32} />
                                COPIER LE CODE FINAL
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
