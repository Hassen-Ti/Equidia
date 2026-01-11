import React, { useState } from 'react';
import { X, Copy, CheckCircle, FileText, Zap } from 'lucide-react';
import SSMLGenerator from './SSMLGenerator';

export default function ScriptViewer({ seance, script, onClose, onEdit }) {
    const [copied, setCopied] = useState(false);
    const [showSSML, setShowSSML] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(script);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="bg-purple-600 p-4 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <FileText size={24} />
                                <h2 className="text-xl font-bold">Script Sauvegardé</h2>
                            </div>
                            <p className="text-purple-100 text-sm">#{seance.id} - {seance.nom}</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-purple-700 rounded-full transition">
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                    <pre className="bg-white p-6 rounded-lg border border-gray-200 whitespace-pre-wrap font-sans text-sm leading-relaxed">
                        {script}
                    </pre>
                </div>

                {/* Footer */}
                <div className="bg-gray-100 p-4 border-t flex justify-between items-center flex-wrap gap-4">
                    <div className="flex gap-3">
                        <button
                            onClick={onEdit}
                            className="px-4 py-2 text-purple-700 hover:bg-purple-50 rounded-lg transition font-semibold text-sm"
                        >
                            Modifier
                        </button>
                        <button
                            onClick={() => setShowSSML(true)}
                            className="px-4 py-2 bg-orange-100 text-orange-700 hover:bg-orange-200 rounded-lg transition font-semibold flex items-center gap-2 text-sm"
                        >
                            <Zap size={16} /> Code Amazon Polly
                        </button>
                    </div>

                    <button
                        onClick={copyToClipboard}
                        className={`px-6 py-2 rounded-lg font-semibold transition flex items-center gap-2 ${copied
                            ? 'bg-green-500 text-white'
                            : 'bg-purple-600 text-white hover:bg-purple-700'
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
                                Copier le Script
                            </>
                        )}
                    </button>
                </div>

                {showSSML && (
                    <SSMLGenerator
                        seance={seance}
                        script={script}
                        onClose={() => setShowSSML(false)}
                    />
                )}
            </div>
        </div>
    );
}
