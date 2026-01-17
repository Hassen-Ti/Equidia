import React, { useState } from 'react';
import { Play, Pause, RotateCcw, ChevronLeft, Volume2, Info, Headphones, Clock, ListChecks, ArrowLeft, Target, Flag } from 'lucide-react';
import SessionFeedback from './SessionFeedback';

export default function RiderPlayer({ session: seance, onClose }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(35); // Factice pour la maquette
    const [isInfoOpen, setIsInfoOpen] = useState(false);

    // Données factices des exercices (à mettre dans seances.js plus tard)
    const exercices = [
        { title: "Détente au pas", time: "5 min", desc: "Marche rênes longues, extension d'encolure." },
        { title: "Mise en main", time: "10 min", desc: "Transitions pas-arrêt et cercles de 20m." },
        { title: "Travail Principal", time: "15 min", desc: seance.discipline === 'Obstacle' ? "Passage de barres au sol et saut isolé." : "Travail de deux pistes au trot." },
        { title: "Retour au calme", time: "5 min", desc: "Trot enlevé lent et pas rênes longues." }
    ];

    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

    const handleFinishSession = () => {
        setIsPlaying(false);
        setIsFeedbackOpen(true);
    };

    const handleFeedbackSave = (data) => {
        console.log("Feedback saved:", data);
        // Ici on enverrait au backend
        onClose(); // Ferme le player après sauvegarde
    };

    return (
        <div className="fixed inset-0 bg-equi-paper z-[100] flex flex-col h-full animate-in slide-in-from-bottom duration-1000 overflow-hidden">

            {/* Background Lifestyle Soft - Immersion Totale */}
            <div className="absolute inset-0 z-0 scale-110">
                <div className="absolute inset-0 opacity-25 mix-blend-multiply" style={{ backgroundImage: `url('/bg-pattern.png')`, backgroundSize: '250px', backgroundRepeat: 'repeat' }}></div>
                <div className="absolute inset-0 bg-gradient-to-b from-[#FAF7F2]/90 via-[#FAF7F2]/95 to-[#FAF7F2]"></div>

                {/* Decorative Elements */}
                <div className="absolute top-1/4 -left-20 w-80 h-80 bg-[#8C9E79]/5 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-[#8C9E79]/10 rounded-full blur-[100px]"></div>
            </div>

            {/* PANEL D'INFORMATION (OVERLAY) */}
            {isInfoOpen && (
                <div className="absolute inset-0 z-50 bg-[#FAF7F2]/95 backdrop-blur-md flex flex-col animate-in slide-in-from-right duration-300">
                    <div className="px-8 py-10 flex items-center justify-between">
                        <button
                            onClick={() => setIsInfoOpen(false)}
                            className="w-14 h-14 rounded-[1.5rem] bg-white shadow-xl flex items-center justify-center text-equi-olive hover:scale-110 active:scale-95 transition-all border-2 border-white"
                        >
                            <ArrowLeft size={24} />
                        </button>
                        <h3 className="text-lg font-black text-[#8C9E79] uppercase tracking-widest">Programme</h3>
                        <div className="w-14"></div> {/* Spacer */}
                    </div>

                    <div className="flex-1 overflow-y-auto px-8 pb-10 space-y-6">
                        {/* Card Objectif */}
                        <div className="bg-white p-6 rounded-[2rem] shadow-lg border border-[#8C9E79]/10">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-[#8C9E79]/10 rounded-xl text-[#8C9E79]">
                                    <Target size={20} />
                                </div>
                                <h4 className="font-bold text-equi-clay uppercase text-xs tracking-widest">Objectif Séance</h4>
                            </div>
                            <p className="text-equi-olive leading-relaxed font-medium">
                                Améliorer la précision du tracé et la réactivité du cheval dans les transitions descendantes.
                            </p>
                        </div>

                        {seance.discipline === 'Obstacle' && (
                            <div className="bg-white p-6 rounded-[2rem] shadow-lg border border-[#8C9E79]/10">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-[#8C9E79]/10 rounded-xl text-[#8C9E79]">
                                        <Target size={20} />
                                    </div>
                                    <h4 className="font-bold text-equi-clay uppercase text-xs tracking-widest">Plan du Dispositif</h4>
                                </div>
                                <div className="rounded-2xl overflow-hidden shadow-sm border border-[#8C9E79]/20">
                                    <img src="/cso_schema_1.png" alt="Plan Obstacle" className="w-full h-auto" />
                                </div>
                                <p className="text-[10px] text-center text-equi-olive/60 mt-3 font-medium">
                                    Distances : 21m (5 foulées) • Hauteur : 0.80m
                                </p>
                            </div>
                        )}

                        {/* Liste Exercices */}
                        <div className="space-y-4">
                            <h4 className="font-black text-equi-clay uppercase text-xs tracking-widest ml-2 opacity-50">Déroulé ({exercices.length} étapes)</h4>
                            {exercices.map((exo, idx) => (
                                <div key={idx} className="bg-white p-5 rounded-[2rem] shadow-sm flex gap-4 items-start relative overflow-hidden">
                                    {/* Filigrane numéro */}
                                    <span className="absolute -right-2 -top-4 text-[4rem] font-black text-[#8C9E79]/5 select-none font-serif italic">
                                        {idx + 1}
                                    </span>

                                    <div className="mt-1 w-6 h-6 rounded-full bg-[#8C9E79] flex items-center justify-center text-white text-[10px] font-bold shrink-0 shadow-md">
                                        {idx + 1}
                                    </div>
                                    <div className="relative z-10">
                                        <div className="flex items-center justify-between w-full mb-1">
                                            <h5 className="font-bold text-equi-clay">{exo.title}</h5>
                                            <span className="text-[10px] font-black text-[#8C9E79] bg-[#8C9E79]/10 px-2 py-0.5 rounded-full">{exo.time}</span>
                                        </div>
                                        <p className="text-xs text-equi-olive/70 leading-relaxed font-medium">
                                            {exo.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Header Moderne & Discret */}
            <header className="px-6 py-6 flex items-center justify-between relative z-10 shrink-0">
                <button
                    onClick={onClose}
                    className="w-12 h-12 rounded-[1.2rem] bg-white shadow-xl flex items-center justify-center text-equi-olive hover:scale-110 active:scale-95 transition-all border-2 border-white"
                >
                    <ChevronLeft size={24} />
                </button>
                <div className="text-center w-full mx-4">
                    <h3 className="text-sm font-black text-[#8C9E79] tracking-widest uppercase mb-1">{seance.discipline}</h3>
                </div>

                {/* Spacer d'équilibre (à droite) */}
                <div className="w-14"></div>
            </header>

            {/* Contenu Central épuré - Compacté pour Mobile */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10 shrink-0">
                <div className="w-[220px] h-[220px] bg-white rounded-[4rem] shadow-[0_30px_60px_rgba(140,158,121,0.2)] flex items-center justify-center relative mb-6 border-[8px] border-white ring-1 ring-[#8C9E79]/5 overflow-hidden group shrink-0">
                    <img
                        src={getSeanceVisual(seance)}
                        alt={seance.nom}
                        className="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform duration-[20s] group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#8C9E79]/40 to-transparent mix-blend-multiply"></div>
                    <div className="absolute inset-8 rounded-[3rem] border-2 border-dashed border-white/30 animate-[spin_60s_linear_infinite]"></div>

                    <div className="relative z-10 flex flex-col items-center gap-4">
                        {!isPlaying && (
                            <div className="bg-black/40 backdrop-blur-sm px-6 py-2 rounded-full border border-white/20">
                                <span className="text-white font-black tracking-[0.3em] text-xs">PAUSE</span>
                            </div>
                        )}
                        <div className={`flex gap-1.5 ${isPlaying ? 'animate-bounce' : 'opacity-50 scale-90'}`}>
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="w-1 h-6 bg-white rounded-full shadow-lg" style={{ animationDelay: `${i * 0.1}s`, height: isPlaying ? `${Math.random() * 30 + 15}px` : '4px' }}></div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Titre & Info */}
                <div className="text-center mb-8 w-full shrink-0">
                    <h2 className="text-2xl font-serif italic font-black text-equi-olive mb-4 tracking-tight leading-none px-4 line-clamp-2">{seance.nom}</h2>
                    <div className="flex gap-6 justify-center items-center">
                        <span className="text-[10px] font-black text-white px-3 py-1 rounded-full bg-[#8C9E79] shadow-lg uppercase tracking-[0.2em]">{seance.niveau}</span>
                        <div className="flex items-center gap-2 text-[10px] font-black text-[#8C9E79] uppercase tracking-[0.2em]">
                            <Clock size={14} className="text-[#8C9E79]" /> {seance.duree}
                        </div>
                    </div>

                    {/* BOUTON DÉROULÉ - Texte Dynamique */}
                    <button
                        onClick={() => setIsInfoOpen(true)}
                        className="mt-6 flex items-center justify-center gap-2 px-6 py-3 mx-auto rounded-full bg-white border border-[#8C9E79]/20 shadow-md text-[#8C9E79] hover:bg-[#8C9E79] hover:text-white transition-all group"
                    >
                        <ListChecks size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">
                            {seance.discipline === 'Obstacle' ? 'Détail & Schéma' : 'Consulter le Programme'}
                        </span>
                    </button>
                </div>

                {/* Progression Lifestyle */}
                <div className="w-full max-w-xs px-4 mb-4 shrink-0">
                    <div className="flex justify-between text-[10px] font-black text-[#8C9E79] uppercase tracking-widest mb-2">
                        <span className="opacity-60">{formatTime(calculateTimes(seance.duree, progress).current)}</span>
                        <span>-{formatTime(calculateTimes(seance.duree, progress).remaining)}</span>
                    </div>
                    <div className="w-full bg-equi-olive/5 h-3 rounded-full overflow-hidden p-[2px] border border-white shadow-inner relative group">
                        <div
                            className="bg-equi-sage h-full rounded-full transition-all duration-1000 shadow-[0_0_20px_rgba(122,141,118,0.4)] relative"
                            style={{ width: `${progress}%` }}
                        >
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full shadow-2xl border-4 border-equi-sage scale-0 group-hover:scale-100 transition-transform"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contrôles Clean Tech */}
            <div className="bg-white px-10 pt-10 pb-20 rounded-t-[5rem] shadow-[0_-30px_60px_rgba(0,0,0,0.05)] border-t border-white relative z-20">
                <div className="flex items-center justify-between gap-10 max-w-sm mx-auto">

                    {/* Reculer */}
                    <button className="w-18 h-18 bg-equi-cream border-2 border-white rounded-[1.8rem] flex items-center justify-center text-equi-olive shadow-xl active:scale-90 transition-all hover:bg-white hover:border-equi-gold/30">
                        <RotateCcw size={32} />
                    </button>

                    {/* PLAY PAUSE MAJEUR */}
                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className={`w-32 h-32 rounded-[3.5rem] flex items-center justify-center text-white transition-all duration-700 shadow-[0_30px_60px_rgba(140,158,121,0.4)] relative overflow-hidden active:scale-90 bg-[#8C9E79] hover:scale-105`}
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent"></div>
                        {isPlaying ? (
                            <Pause size={48} fill="currentColor" />
                        ) : (
                            <Play size={48} fill="currentColor" className="ml-2" />
                        )}
                    </button>

                    {/* FINIR (Flag) - Remplace Volume pour l'UX */}
                    <button
                        onClick={handleFinishSession}
                        className="w-18 h-18 bg-equi-cream border-2 border-white rounded-[1.8rem] flex items-center justify-center text-equi-olive shadow-xl active:scale-90 transition-all hover:bg-[#8C9E79] hover:text-white hover:border-[#8C9E79]"
                    >
                        <Flag size={32} />
                    </button>

                </div>
            </div>

            {/* FEEDBACK MODAL */}
            <SessionFeedback
                isOpen={isFeedbackOpen}
                onClose={() => setIsFeedbackOpen(false)}
                seanceTitle={seance.nom}
                onSave={handleFeedbackSave}
            />
        </div>
    );
}

function getSeanceVisual(seance) {
    if (seance.type === 'Résolution de problème') return '/corrections.png';
    if (seance.type === 'Thématique spécifique') return '/equestrian_premium.png';

    switch (seance.discipline) {
        case 'Dressage': return '/dressage.png';
        case 'Obstacle': return '/obstacle.png';
        case 'Cross & Extérieur sportif': return '/trail.png';
        case 'Travail au sol': return '/groundwork.png';
        case 'Détente & Bien-être': return '/equestrian_lifestyle_bg.png';
        default: return '/equestrian_lifestyle_bg.png';
    }
}

// Helpers pour le temps
function calculateTimes(dureeStr, progressPercent) {
    const totalMinutes = parseInt(dureeStr) || 20; // Default 20 min if parse fails
    const totalSeconds = totalMinutes * 60;
    const currentSeconds = Math.floor(totalSeconds * (progressPercent / 100));
    const remainingSeconds = totalSeconds - currentSeconds;
    return { current: currentSeconds, remaining: remainingSeconds };
}

function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}
