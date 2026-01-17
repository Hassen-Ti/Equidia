import React, { useState } from 'react';
import { Star, Activity, MessageSquare, CheckCircle2, X } from 'lucide-react';

export default function SessionFeedback({ isOpen, onClose, seanceTitle, onSave }) {
    if (!isOpen) return null;

    const [step, setStep] = useState(1); // 1: Cheval, 2: Exos, 3: Notes
    const [horseMood, setHorseMood] = useState(null);
    const [exerciseRatings, setExerciseRatings] = useState({});
    const [notes, setNotes] = useState('');

    // Mock des exercices basés sur la séance (Normalement viendrait des props)
    const mockExercises = [
        { id: 1, name: "Détente au pas" },
        { id: 2, name: "Cercles & Incurvation" },
        { id: 3, name: "Transitions intra-allures" },
        { id: 4, name: "Tracé des coins" }
    ];

    const moodOptions = [
        { id: 'mou', icon: '😴', label: 'Mou', color: 'bg-blue-100 text-blue-600' },
        { id: 'normal', icon: '🦄', label: 'Normal', color: 'bg-green-100 text-green-600' },
        { id: 'energique', icon: '⚡', label: 'Tonique', color: 'bg-orange-100 text-orange-600' },
        { id: 'chaud', icon: '🔥', label: 'Chaud', color: 'bg-red-100 text-red-600' }
    ];

    const handleRating = (exoId, rating) => {
        setExerciseRatings(prev => ({
            ...prev,
            [exoId]: rating
        }));
    };

    const handleSave = () => {
        const feedbackData = {
            date: new Date().toISOString(),
            horseMood,
            exerciseRatings,
            notes
        };
        onSave(feedbackData); // Envoi au parent
        onClose();
        // Reset pour la prochaine fois
        setStep(1);
        setHorseMood(null);
        setExerciseRatings({});
        setNotes('');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop Blur */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

            {/* Modal Content */}
            <div className="relative bg-[#FAF7F2] w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/40 animate-in fade-in zoom-in-95 duration-300">

                {/* Header Progress */}
                <div className="bg-[#8C9E79] p-6 text-center relative">
                    <h2 className="text-[#E8DCCA] font-serif font-bold text-xl mb-1">Bilan de Séance</h2>
                    <p className="text-[#E8DCCA]/80 text-xs font-medium uppercase tracking-widest">{seanceTitle}</p>

                    {/* Progress Dots */}
                    <div className="flex justify-center gap-2 mt-4">
                        {[1, 2, 3].map(s => (
                            <div key={s} className={`h-1.5 rounded-full transition-all duration-300 ${step >= s ? 'w-8 bg-white' : 'w-2 bg-white/30'}`}></div>
                        ))}
                    </div>
                </div>

                <div className="p-8">
                    {/* STEP 1: HORSE MOOD */}
                    {step === 1 && (
                        <div className="animate-in slide-in-from-right-8 duration-300">
                            <h3 className="text-center font-bold text-[#8C9E79] text-lg mb-6">Comment était votre cheval ?</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {moodOptions.map(option => (
                                    <button
                                        key={option.id}
                                        onClick={() => setHorseMood(option.id)}
                                        className={`p-4 rounded-3xl border-2 transition-all flex flex-col items-center gap-2 ${horseMood === option.id
                                                ? 'border-[#8C9E79] bg-[#8C9E79]/10 scale-105 shadow-md'
                                                : 'border-transparent bg-white shadow-sm hover:bg-gray-50'
                                            }`}
                                    >
                                        <span className="text-4xl filter drop-shadow-sm">{option.icon}</span>
                                        <span className="font-bold text-sm text-[#5C5C5C]">{option.label}</span>
                                    </button>
                                ))}
                            </div>
                            <button
                                disabled={!horseMood}
                                onClick={() => setStep(2)}
                                className="mt-8 w-full py-4 rounded-2xl bg-[#8C9E79] text-white font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#7A9170] transition-colors"
                            >
                                Continuer
                            </button>
                        </div>
                    )}

                    {/* STEP 2: EXERCISES */}
                    {step === 2 && (
                        <div className="animate-in slide-in-from-right-8 duration-300">
                            <h3 className="text-center font-bold text-[#8C9E79] text-lg mb-6">Notez les exercices</h3>
                            <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
                                {mockExercises.map(exo => (
                                    <div key={exo.id} className="bg-white p-4 rounded-2xl shadow-sm border border-[#8C9E79]/10">
                                        <p className="font-bold text-[#5C5C5C] text-sm mb-3">{exo.name}</p>
                                        <div className="flex justify-between gap-2">
                                            {[
                                                { val: 1, label: '😞', color: 'bg-red-50 hover:bg-red-100 border-red-200' },
                                                { val: 2, label: '😐', color: 'bg-orange-50 hover:bg-orange-100 border-orange-200' },
                                                { val: 3, label: '😊', color: 'bg-green-50 hover:bg-green-100 border-green-200' },
                                                { val: 4, label: '🤩', color: 'bg-[#8C9E79]/10 hover:bg-[#8C9E79]/20 border-[#8C9E79]/20' }
                                            ].map((rating) => (
                                                <button
                                                    key={rating.val}
                                                    onClick={() => handleRating(exo.id, rating.val)}
                                                    className={`flex-1 py-2 rounded-xl border transition-all text-xl ${exerciseRatings[exo.id] === rating.val
                                                            ? 'ring-2 ring-[#8C9E79] ring-offset-1 scale-105 ' + rating.color
                                                            : 'opacity-60 grayscale hover:grayscale-0 ' + rating.color
                                                        }`}
                                                >
                                                    {rating.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button
                                disabled={Object.keys(exerciseRatings).length < mockExercises.length}
                                onClick={() => setStep(3)}
                                className="mt-6 w-full py-4 rounded-2xl bg-[#8C9E79] text-white font-bold shadow-lg disabled:opacity-50 hover:bg-[#7A9170] transition-colors"
                            >
                                Suivant
                            </button>
                        </div>
                    )}

                    {/* STEP 3: NOTES */}
                    {step === 3 && (
                        <div className="animate-in slide-in-from-right-8 duration-300">
                            <h3 className="text-center font-bold text-[#8C9E79] text-lg mb-6">Une note personelle ?</h3>
                            <div className="bg-white p-4 rounded-3xl shadow-sm border border-[#8C9E79]/10 mb-6">
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Sensations, déclics, difficultés particulières..."
                                    className="w-full h-32 resize-none outline-none text-[#5C5C5C] placeholder:text-gray-300 text-sm font-medium"
                                ></textarea>
                            </div>
                            <button
                                onClick={handleSave}
                                className="w-full py-4 rounded-2xl bg-[#8C9E79] text-white font-bold shadow-lg flex items-center justify-center gap-2 hover:bg-[#7A9170] transition-colors"
                            >
                                <CheckCircle2 size={20} /> Enregistrer le Bilan
                            </button>
                            <button
                                onClick={() => setStep(2)}
                                className="w-full mt-3 py-2 text-xs font-bold text-[#8C9E79]/60 uppercase hover:text-[#8C9E79]"
                            >
                                Retour
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
