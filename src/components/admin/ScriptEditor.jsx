import React, { useState } from 'react';
import { X, Save, Edit2 } from 'lucide-react';

export default function ScriptEditor({ seance, existingScript, onSave, onClose }) {
    const [script, setScript] = useState(existingScript || '');

    const handleSave = () => {
        onSave(seance.id, script);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="bg-green-600 p-4 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                {existingScript ? <Edit2 size={24} /> : <Save size={24} />}
                                <h2 className="text-xl font-bold">
                                    {existingScript ? 'Modifier le Script' : 'Sauvegarder le Script'}
                                </h2>
                            </div>
                            <p className="text-green-100 text-sm">#{seance.id} - {seance.nom}</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-green-700 rounded-full transition">
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Instructions */}
                <div className="bg-green-50 p-4 border-b">
                    <h3 className="font-semibold text-green-900 mb-2">💾 Comment sauvegarder ?</h3>
                    <ol className="text-sm text-green-800 space-y-1 list-decimal list-inside">
                        <li>Copiez le script complet généré par ChatGPT/Claude</li>
                        <li>Collez-le dans la zone de texte ci-dessous</li>
                        <li>Cliquez sur "Sauvegarder"</li>
                        <li>Le script sera stocké et accessible à tout moment !</li>
                    </ol>
                </div>

                {/* Editor */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                    <textarea
                        value={script}
                        onChange={(e) => setScript(e.target.value)}
                        placeholder="Collez ici le script complet généré par ChatGPT/Claude..."
                        className="w-full h-full min-h-[400px] p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm resize-none"
                    />
                </div>

                {/* Footer */}
                <div className="bg-gray-100 p-4 border-t flex justify-between items-center">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition"
                    >
                        Annuler
                    </button>

                    <button
                        onClick={handleSave}
                        disabled={!script.trim()}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        <Save size={20} />
                        Sauvegarder le Script
                    </button>
                </div>
            </div>
        </div>
    );
}
