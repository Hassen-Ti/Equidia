import React, { useState } from 'react';
import { Play, Pause, RotateCcw, ChevronLeft, Volume2, Info, Headphones } from 'lucide-react';

export default function RiderPlayer({ seance, onClose }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(35); // Factice pour la maquette

    return (
        <div className="fixed inset-0 bg-equi-paper z-[100] flex flex-col h-full animate-in slide-in-from-bottom duration-1000 overflow-hidden">

            {/* Background Lifestyle Soft - Immersion Totale */}
            <div className="absolute inset-0 z-0 scale-110">
                <img
                    src="/equestrian_lifestyle_bg.png"
                    alt="Equestrian Lifestyle"
                    className="w-full h-full object-cover opacity-[0.15] blur-3xl"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-equi-paper/80 via-transparent to-equi-paper/90"></div>

                {/* Decorative Elements */}
                <div className="absolute top-1/4 -left-20 w-80 h-80 bg-equi-sage/10 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-equi-gold/10 rounded-full blur-[100px]"></div>
            </div>

            {/* Header Moderne & Discret */}
            <header className="px-8 py-10 flex items-center justify-between relative z-10">
                <button
                    onClick={onClose}
                    className="w-14 h-14 rounded-[1.5rem] bg-white shadow-2xl flex items-center justify-center text-equi-olive hover:scale-110 active:scale-95 transition-all border-2 border-white"
                >
                    <ChevronLeft size={32} />
                </button>
                <div className="text-center">
                    <p className="text-[10px] font-black text-equi-gold uppercase tracking-[0.4em] mb-2 drop-shadow-sm">Coaching Vocal</p>
                    <h3 className="text-base font-bold text-equi-olive truncate max-w-[200px] tracking-tight">{seance.nom}</h3>
                </div>
                <div className="w-14 h-14 rounded-[1.5rem] bg-equi-olive flex items-center justify-center text-white shadow-xl opacity-10">
                    <Headphones size={24} />
                </div>
            </header>

            {/* Contenu Central épuré */}
            <div className="flex-1 flex flex-col items-center justify-center p-12 relative z-10">
                <div className="w-[300px] h-[300px] bg-white rounded-[5rem] shadow-[0_60px_120px_rgba(74,93,74,0.12)] flex items-center justify-center relative mb-16 border-[12px] border-white ring-1 ring-equi-olive/5 overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-equi-sage/5 to-white group-hover:scale-110 transition-transform duration-[10s]"></div>
                    <div className="absolute inset-10 rounded-[3.5rem] border-2 border-dashed border-equi-olive/10 animate-[spin_60s_linear_infinite]"></div>

                    <div className="relative z-10 flex flex-col items-center gap-4">
                        <Headphones size={100} className="text-equi-olive opacity-80" />
                        <div className={`flex gap-1.5 ${isPlaying ? 'animate-bounce' : ''}`}>
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="w-1 h-6 bg-equi-gold rounded-full" style={{ animationDelay: `${i * 0.1}s`, height: isPlaying ? `${Math.random() * 20 + 10}px` : '4px' }}></div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Titre & Info */}
                <div className="text-center mb-14 w-full">
                    <h2 className="text-4xl font-serif italic font-black text-equi-olive mb-6 tracking-tight leading-tight">{seance.nom}</h2>
                    <div className="flex gap-8 justify-center items-center">
                        <span className="text-[11px] font-black text-white px-4 py-1.5 rounded-full bg-equi-sage shadow-lg uppercase tracking-[0.2em]">{seance.niveau}</span>
                        <div className="flex items-center gap-2.5 text-[11px] font-black text-equi-clay uppercase tracking-[0.2em]">
                            <Clock size={16} className="text-equi-gold" /> {seance.duree} MIN
                        </div>
                    </div>
                </div>

                {/* Progression Lifestyle */}
                <div className="w-full max-w-sm px-4 mb-8">
                    <div className="flex justify-between text-[11px] font-black text-equi-clay/60 uppercase tracking-widest mb-6">
                        <span>08:42</span>
                        <span className="text-equi-gold">Session Guidée</span>
                    </div>
                    <div className="w-full bg-equi-olive/5 h-4 rounded-full overflow-hidden p-1 border border-white shadow-inner relative group">
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
                        className={`w-32 h-32 rounded-[3.5rem] flex items-center justify-center text-white transition-all duration-700 shadow-[0_30px_60px_rgba(74,93,74,0.3)] relative overflow-hidden active:scale-90 ${isPlaying ? 'bg-equi-olive' : 'bg-equi-sage ring-8 ring-equi-sage/10'}`}
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent"></div>
                        {isPlaying ? (
                            <Pause size={48} fill="currentColor" />
                        ) : (
                            <Play size={48} fill="currentColor" className="ml-2" />
                        )}
                    </button>

                    {/* Volume */}
                    <button className="w-18 h-18 bg-equi-cream border-2 border-white rounded-[1.8rem] flex items-center justify-center text-equi-olive shadow-xl active:scale-90 transition-all hover:bg-white hover:border-equi-gold/30">
                        <Volume2 size={32} />
                    </button>

                </div>
            </div>
        </div>
    );
}
