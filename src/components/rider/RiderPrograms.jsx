import React, { useState } from 'react';
import { Play, Calendar, Star, ChevronRight, Target, Trophy, Clock, Lock } from 'lucide-react';
import SeancesData from '../../data/seances';

export default function RiderPrograms({ profile, activeHorse, onPlay }) {
    const [activeProgram, setActiveProgram] = useState(null);

    // Programmes fictifs générés dynamiquement selon le cheval
    const programs = [
        {
            id: 'resume',
            title: 'Remise en forme',
            subtitle: 'Post-trêve hivernale',
            duration: '4 semaines',
            sessionsCount: 12,
            level: 'Tout niveau',
            description: `Un programme progressif pour remuscler ${activeHorse?.name || 'votre cheval'} en douceur après une période de repos.`,
            image: `${import.meta.env.BASE_URL}equestrian_lifestyle_bg.png`,
            progress: 33, // 33% complété
            locked: false,
            sessions: [
                SeancesData.find(s => s.id === 6), // Décontraction
                SeancesData.find(s => s.id === 19), // Longe
                SeancesData.find(s => s.id === 127) // Détente pas
            ]
        },
        {
            id: 'cso_prep',
            title: 'Saison Concours',
            subtitle: 'Objectif CSO Club 2',
            duration: '6 semaines',
            sessionsCount: 18,
            level: 'G4-5',
            description: `Préparation spécifique pour enchaîner un parcours type sans faute. Travail sur la franchise et la technique.`,
            image: `${import.meta.env.BASE_URL}obstacle.png`,
            progress: 0,
            locked: false,
            sessions: [
                SeancesData.find(s => s.id === 27),
                SeancesData.find(s => s.id === 28),
                SeancesData.find(s => s.id === 29)
            ]
        },
        {
            id: 'dressage_finesse',
            title: 'Finesse & Légèreté',
            subtitle: 'Perfectionnement Dressage',
            duration: '8 semaines',
            sessionsCount: 24,
            level: 'G5+',
            description: `Un cycle dédié à l'amélioration du contact et de l'équilibre pour un cheval disponible et léger.`,
            image: `${import.meta.env.BASE_URL}dressage.png`,
            progress: 0,
            locked: true, // Exemple verrouillé
            sessions: []
        }
    ];

    if (activeProgram) {
        return (
            <div className="relative min-h-full pb-32 animate-in slide-in-from-right duration-500">
                {/* BACKGROUND */}
                <div className="fixed inset-0 z-0 bg-[#FAF7F2]">
                    <div className="absolute inset-0 opacity-25 mix-blend-multiply" style={{ backgroundImage: `url('${import.meta.env.BASE_URL}bg-pattern.png')`, backgroundSize: '250px', backgroundRepeat: 'repeat' }}></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-[#FDFBF7]/40 via-[#FDFBF7]/80 to-[#FDFBF7]/95 backdrop-blur-[1px]"></div>
                </div>

                <div className="relative z-10 p-6">
                    {/* Header Programme Détail */}
                    <button
                        onClick={() => setActiveProgram(null)}
                        className="flex items-center gap-2 text-[#8C9E79] font-bold text-sm mb-6 hover:underline"
                    >
                        <ChevronRight className="rotate-180" size={16} />
                        Retour aux programmes
                    </button>

                    <div className="relative h-48 rounded-3xl overflow-hidden shadow-2xl mb-8">
                        <img src={activeProgram.image} alt={activeProgram.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                        <div className="absolute bottom-6 left-6 text-white">
                            <div className="text-[10px] font-black uppercase tracking-widest bg-[#8C9E79] inline-block px-2 py-1 rounded mb-2">
                                {activeProgram.duration}
                            </div>
                            <h1 className="text-3xl font-serif italic mb-1">{activeProgram.title}</h1>
                            <p className="text-white/80 text-sm font-medium">{activeProgram.subtitle}</p>
                        </div>
                    </div>

                    <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 mb-8 flex items-start gap-3">
                        <div className="text-orange-400 mt-0.5"><Lock size={16} /></div>
                        <div>
                            <h4 className="text-orange-800 font-bold text-xs uppercase tracking-wide mb-1">Programme de Démonstration</h4>
                            <p className="text-orange-700/80 text-xs leading-relaxed">
                                Ceci est un modèle type. Il n'est pas encore adapté spécifiquement aux besoins de {activeHorse?.name}.
                            </p>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h3 className="text-[#8C9E79] font-black uppercase tracking-widest text-xs mb-3">Objectif du cycle</h3>
                        <p className="text-equi-clay/80 text-sm leading-relaxed font-medium">
                            {activeProgram.description}
                        </p>
                    </div>

                    {/* Liste des séances du programme */}
                    <div className="space-y-4">
                        <h3 className="text-[#8C9E79] font-black uppercase tracking-widest text-xs mb-3">Séances ({activeProgram.sessions?.length || 0})</h3>
                        {activeProgram.sessions?.map((seance, index) => (
                            seance ? (
                                <div key={index} className="bg-white p-4 rounded-2xl shadow-sm border border-[#8C9E79]/10 flex items-center justify-between group hover:border-[#8C9E79]/50 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-full bg-[#8C9E79]/10 flex items-center justify-center text-[#8C9E79] font-black text-xs shrink-0">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <h4 className="text-equi-clay font-bold text-sm leading-tight">{seance.nom}</h4>
                                            <span className="text-xs text-equi-olive/60 font-medium">{seance.duree} • {seance.discipline}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => onPlay(seance)}
                                        className="w-8 h-8 rounded-full bg-[#8C9E79] text-white flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-all"
                                    >
                                        <Play size={14} fill="currentColor" className="ml-0.5" />
                                    </button>
                                </div>
                            ) : null
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-full pb-32 animate-in fade-in duration-700">
            {/* BACKGROUND */}
            <div className="fixed inset-0 z-0 bg-[#FAF7F2]">
                <div className="absolute inset-0 opacity-25 mix-blend-multiply" style={{ backgroundImage: `url('${import.meta.env.BASE_URL}bg-pattern.png')`, backgroundSize: '250px', backgroundRepeat: 'repeat' }}></div>
                <div className="absolute inset-0 bg-gradient-to-b from-[#FDFBF7]/40 via-[#FDFBF7]/80 to-[#FDFBF7]/95 backdrop-blur-[1px]"></div>
            </div>

            <div className="relative z-10 p-6 space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-serif italic text-equi-clay mb-2">
                        Programmes
                    </h1>
                    <p className="text-sm text-equi-olive font-medium">
                        Exemples de programmes types <span className="opacity-60 text-xs ml-1">(Personnalisation à venir)</span>
                    </p>
                </div>

                {/* Liste des Programmes */}
                <div className="grid gap-6">
                    {programs.map((prog) => (
                        <button
                            key={prog.id}
                            disabled={prog.locked}
                            onClick={() => setActiveProgram(prog)}
                            className={`group relative w-full text-left rounded-[2rem] overflow-hidden shadow-lg transform transition-all duration-500 hover:scale-[1.02] active:scale-95
                        ${prog.locked ? 'opacity-80 grayscale cursor-not-allowed' : 'hover:shadow-xl'}`}
                        >
                            {/* Image background */}
                            <div className="absolute inset-0">
                                <img src={prog.image} alt={prog.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-equi-clay/90 via-equi-clay/40 to-transparent"></div>
                            </div>

                            {/* Content */}
                            <div className="relative p-6 pt-24 flex flex-col h-full justify-end">
                                {prog.locked && (
                                    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                                        <Lock size={12} /> Bientôt
                                    </div>
                                )}

                                {!prog.locked && prog.progress > 0 && (
                                    <div className="absolute top-4 right-4 bg-[#8C9E79] px-3 py-1 rounded-full text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow-lg">
                                        {prog.progress}% Complété
                                    </div>
                                )}

                                <div className="flex items-end justify-between">
                                    <div>
                                        <span className="text-[#8C9E79] text-[10px] font-black uppercase tracking-widest bg-white/10 px-2 py-1 rounded mb-2 inline-block backdrop-blur-sm">
                                            {prog.duration}
                                        </span>
                                        <h3 className="text-white text-2xl font-serif italic mb-1 drop-shadow-md">
                                            {prog.title}
                                        </h3>
                                        <p className="text-white/80 text-xs font-medium max-w-[80%]">
                                            {prog.subtitle}
                                        </p>
                                    </div>
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300
                                ${prog.locked ? 'border-white/30 text-white/50' : 'bg-white text-[#8C9E79] shadow-lg group-hover:scale-110'}`}>
                                        {prog.locked ? <Lock size={16} /> : <ChevronRight size={20} />}
                                    </div>
                                </div>

                                {/* Stats bar */}
                                {!prog.locked && (
                                    <div className="mt-4 flex items-center gap-4 text-white/60 text-[10px] font-black uppercase tracking-widest">
                                        <div className="flex items-center gap-1">
                                            <Trophy size={12} /> {prog.level}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Target size={12} /> {prog.sessionsCount} Séances
                                        </div>
                                    </div>
                                )}
                            </div>
                        </button>
                    ))}
                </div>

                {/* Note en bas */}
                <div className="text-center mt-8 p-6 bg-white/50 rounded-3xl border border-[#8C9E79]/10">
                    <Star className="w-8 h-8 text-[#8C9E79] mx-auto mb-3 opacity-50" />
                    <h4 className="text-[#8C9E79] font-black uppercase text-xs tracking-widest mb-1">Bientôt disponible</h4>
                    <p className="text-xs text-equi-olive/80">
                        Des programmes sur-mesure, générés spécifiquement pour la progression de {activeHorse?.name}, arriveront dans une prochaine mise à jour.
                    </p>
                </div>
            </div>
        </div>
    );
}
