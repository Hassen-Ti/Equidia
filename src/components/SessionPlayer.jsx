import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, X, Volume2, Clock, Settings } from 'lucide-react';

export default function SessionPlayer({ session, script, onClose }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [waitTimer, setWaitTimer] = useState(0);
    const [isWaiting, setIsWaiting] = useState(false);

    // Voice management
    const [voices, setVoices] = useState([]);
    const [selectedVoice, setSelectedVoice] = useState(null);
    const [showVoiceSettings, setShowVoiceSettings] = useState(false);

    const synth = window.speechSynthesis;
    const timerRef = useRef(null);

    // Load voices
    useEffect(() => {
        const loadVoices = () => {
            const allVoices = synth.getVoices();
            const frVoices = allVoices.filter(v => v.lang.startsWith('fr'));
            setVoices(frVoices);

            // Try to find a good default voice
            const preferred = frVoices.find(v => v.name.includes('Google') || v.name.includes('Natural')) || frVoices[0];
            setSelectedVoice(preferred);
        };

        loadVoices();
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = loadVoices;
        }
    }, []);

    // Stop everything on unmount
    useEffect(() => {
        return () => {
            synth.cancel();
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    // Handle current block execution
    useEffect(() => {
        if (!isPlaying) {
            synth.pause();
            if (timerRef.current) clearInterval(timerRef.current);
            return;
        }

        const currentBlock = script[currentIndex];

        // If finished
        if (!currentBlock) {
            setIsPlaying(false);
            return;
        }

        if (currentBlock.type === 'speak') {
            // Resume if paused
            if (synth.paused) {
                synth.resume();
            } else if (!synth.speaking) {
                // Start speaking
                const utterance = new SpeechSynthesisUtterance(currentBlock.text);
                utterance.lang = 'fr-FR';
                utterance.rate = 1.0; // Slightly slower might sound better, but keep 1.0 for now

                if (selectedVoice) {
                    utterance.voice = selectedVoice;
                }

                utterance.onend = () => {
                    // Move to next block automatically
                    setCurrentIndex(prev => prev + 1);
                };

                // Error handling
                utterance.onerror = (e) => {
                    console.error("TTS Error", e);
                    // Move next anyway to not get stuck
                    setCurrentIndex(prev => prev + 1);
                };

                synth.speak(utterance);
            }
        } else if (currentBlock.type === 'wait') {
            // Start timer if not already running
            if (!isWaiting) {
                setIsWaiting(true);
                setWaitTimer(currentBlock.duration);

                timerRef.current = setInterval(() => {
                    setWaitTimer(prev => {
                        if (prev <= 1) {
                            clearInterval(timerRef.current);
                            setIsWaiting(false);
                            setCurrentIndex(prevIndex => prevIndex + 1);
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);
            } else {
                // Resume timer logic if needed
                if (!timerRef.current) {
                    timerRef.current = setInterval(() => {
                        setWaitTimer(prev => {
                            if (prev <= 1) {
                                clearInterval(timerRef.current);
                                setIsWaiting(false);
                                setCurrentIndex(prevIndex => prevIndex + 1);
                                return 0;
                            }
                            return prev - 1;
                        });
                    }, 1000);
                }
            }
        }

    }, [isPlaying, currentIndex, script, selectedVoice]);

    // Handle manual navigation
    const next = () => {
        synth.cancel();
        setIsWaiting(false);
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = null;
        if (currentIndex < script.length - 1) setCurrentIndex(c => c + 1);
    };

    const prev = () => {
        synth.cancel();
        setIsWaiting(false);
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = null;
        if (currentIndex > 0) setCurrentIndex(c => c - 1);
    };

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    const currentBlock = script[currentIndex];
    const progress = ((currentIndex + 1) / script.length) * 100;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="bg-amber-600 p-4 text-white flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold">{session.nom}</h2>
                        <p className="text-amber-100 text-sm flex items-center gap-2">
                            {currentBlock?.title || "Séance terminée"}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowVoiceSettings(!showVoiceSettings)}
                            className={`p-2 rounded-full transition ${showVoiceSettings ? 'bg-amber-800' : 'hover:bg-amber-700'}`}
                            title="Choisir la voix"
                        >
                            <Settings size={20} />
                        </button>
                        <button onClick={onClose} className="p-2 hover:bg-amber-700 rounded-full transition">
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Voice Settings Dropdown */}
                {showVoiceSettings && (
                    <div className="bg-gray-100 p-4 border-b border-gray-200 animate-in slide-in-from-top-2">
                        <label className="block text-xs font-semibold text-gray-600 uppercase mb-2">
                            Voix du coach
                        </label>
                        <select
                            className="w-full p-2 rounded border border-gray-300 text-sm"
                            value={selectedVoice?.name || ''}
                            onChange={(e) => {
                                const voice = voices.find(v => v.name === e.target.value);
                                setSelectedVoice(voice);
                                // Optional: speak a test phrase
                            }}
                        >
                            {voices.map(v => (
                                <option key={v.name} value={v.name}>
                                    {v.name} ({v.lang})
                                </option>
                            ))}
                            {voices.length === 0 && <option>Aucune voix française trouvée</option>}
                        </select>
                        <p className="text-xs text-gray-500 mt-2">
                            Astuce : Les voix "Google" ou "Natural" sont souvent plus fluides.
                        </p>
                    </div>
                )}

                {/* Content */}
                <div className="p-8 flex-1 flex flex-col items-center justify-center text-center overflow-y-auto">
                    {currentBlock ? (
                        <>
                            {currentBlock.type === 'speak' ? (
                                <div className="space-y-6">
                                    <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto animate-pulse">
                                        <Volume2 size={40} className="text-amber-600" />
                                    </div>
                                    <p className="text-2xl font-medium text-gray-800 leading-relaxed font-serif">
                                        "{currentBlock.text}"
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                                        <Clock size={40} className="text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-blue-900 mb-2">{currentBlock.label}</h3>
                                        <div className="text-6xl font-bold text-blue-600 font-mono">
                                            {waitTimer}s
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">Séance terminée !</h3>
                            <p className="text-gray-600">Bravo pour cette session.</p>
                            <button onClick={onClose} className="mt-6 px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700">
                                Fermer
                            </button>
                        </div>
                    )}
                </div>

                {/* Controls */}
                <div className="bg-gray-50 p-6 border-t">
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                        <div
                            className="bg-amber-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    <div className="flex items-center justify-center gap-8">
                        <button
                            onClick={prev}
                            disabled={currentIndex === 0}
                            className="p-3 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-full disabled:opacity-30 disabled:hover:bg-transparent"
                        >
                            <SkipBack size={28} />
                        </button>

                        <button
                            onClick={togglePlay}
                            className="p-5 bg-amber-600 text-white rounded-full hover:bg-amber-700 shadow-lg hover:scale-105 transition-all"
                        >
                            {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
                        </button>

                        <button
                            onClick={next}
                            disabled={!currentBlock}
                            className="p-3 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-full disabled:opacity-30 disabled:hover:bg-transparent"
                        >
                            <SkipForward size={28} />
                        </button>
                    </div>
                    <p className="text-center text-xs text-gray-400 mt-4">
                        {selectedVoice ? `Voix : ${selectedVoice.name}` : 'Chargement des voix...'} • {currentIndex + 1} / {script.length}
                    </p>
                </div>
            </div>
        </div>
    );
}
