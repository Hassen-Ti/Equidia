import React, { useState } from 'react';
import { Filter, BookOpen, Target, Wrench, Play } from 'lucide-react';
import SeancesData from '../data/seances';
import SessionPlayer from '../components/session/SessionPlayer';

export default function Catalogue({ savedScripts }) {
    // State management
    const [ongletActif, setOngletActif] = useState('technique');
    const [selectedSeance, setSelectedSeance] = useState(null);
    const [filtres, setFiltres] = useState({
        discipline: 'Toutes',
        niveau: 'Tous',
        duree: 'Toutes'
    });

    // Derived data
    const stats = {
        total: SeancesData.length,
        technique: SeancesData.filter(s => s.type === 'Technique classique').length,
        thematique: SeancesData.filter(s => s.type === 'Thématique spécifique').length,
        probleme: SeancesData.filter(s => s.type === 'Résolution de problème').length,
    };

    const onglets = [
        { id: 'technique', label: 'Technique', fullLabel: 'Technique classique', icon: BookOpen, count: stats.technique, color: 'blue' },
        { id: 'thematique', label: 'Thématique', fullLabel: 'Thématique spécifique', icon: Target, count: stats.thematique, color: 'amber' },
        { id: 'probleme', label: 'Problèmes', fullLabel: 'Résolution de problème', icon: Wrench, count: stats.probleme, color: 'red' },
    ];

    const seancesFiltrees = SeancesData.filter(seance => {
        if (ongletActif === 'technique' && seance.type !== 'Technique classique') return false;
        if (ongletActif === 'thematique' && seance.type !== 'Thématique spécifique') return false;
        if (ongletActif === 'probleme' && seance.type !== 'Résolution de problème') return false;

        const matchDiscipline = filtres.discipline === 'Toutes' || seance.discipline === filtres.discipline;
        const matchNiveau = filtres.niveau === 'Tous' || seance.niveau === filtres.niveau;
        const matchDuree = filtres.duree === 'Toutes' || seance.duree === filtres.duree;
        return matchDiscipline && matchNiveau && matchDuree;
    });

    return (
        <div className="animate-fade-in">
            {/* Hero Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {onglets.map(onglet => {
                    const Icon = onglet.icon;
                    const isActive = ongletActif === onglet.id;
                    return (
                        <button
                            key={onglet.id}
                            onClick={() => setOngletActif(onglet.id)}
                            className={`
                     relative overflow-hidden p-6 rounded-2xl transition-all duration-300 border
                     ${isActive
                                    ? 'bg-amber-600 border-amber-500 shadow-xl shadow-amber-900/20 transform scale-[1.02]'
                                    : 'bg-slate-800/50 border-white/5 hover:bg-slate-800 hover:border-white/10'
                                }
                   `}
                        >
                            {/* Background Glow */}
                            {isActive && (
                                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                            )}

                            <div className="flex items-center justify-between mb-4 relative z-10">
                                <div className={`p-3 rounded-lg ${isActive ? 'bg-white/20' : 'bg-slate-700/50'}`}>
                                    <Icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                                </div>
                                <span className={`text-3xl font-bold ${isActive ? 'text-white' : 'text-slate-500'}`}>
                                    {onglet.count}
                                </span>
                            </div>

                            <div className="text-left relative z-10">
                                <h3 className={`font-semibold text-lg ${isActive ? 'text-white' : 'text-slate-300'}`}>
                                    {onglet.label}
                                </h3>
                                <p className={`text-xs ${isActive ? 'text-amber-200' : 'text-slate-500'}`}>
                                    {onglet.fullLabel}
                                </p>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Filters Bar */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-white/5 rounded-2xl p-6 mb-10">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-amber-500/10 rounded-lg">
                        <Filter className="text-amber-500" size={20} />
                    </div>
                    <h2 className="font-bold text-lg text-slate-200">Filtres de recherche</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { label: 'Discipline', key: 'discipline', options: [...new Set(SeancesData.map(s => s.discipline))], default: 'Toutes' },
                        { label: 'Niveau', key: 'niveau', options: [...new Set(SeancesData.map(s => s.niveau))], default: 'Tous' },
                        { label: 'Durée', key: 'duree', options: [...new Set(SeancesData.map(s => s.duree))].sort((a, b) => parseInt(a) - parseInt(b)), default: 'Toutes' }
                    ].map(filter => (
                        <div key={filter.key} className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1">
                                {filter.label}
                            </label>
                            <div className="relative">
                                <select
                                    value={filtres[filter.key]}
                                    onChange={(e) => setFiltres({ ...filtres, [filter.key]: e.target.value })}
                                    className="w-full appearance-none bg-slate-900 border border-white/10 text-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all font-medium"
                                >
                                    <option value={filter.default}>{filter.default}</option>
                                    {filter.options.map(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                                {/* Custom Arrow */}
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Session Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {seancesFiltrees.map(seance => (
                    <div
                        key={seance.id}
                        className="group relative bg-slate-800 border border-white/5 rounded-2xl p-6 hover:border-amber-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-black/50 hover:-translate-y-1"
                    >
                        {/* Badge Categories */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                                {seance.niveau}
                            </span>
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                {seance.duree} min
                            </span>
                        </div>

                        <h3 className="text-xl font-bold text-slate-100 mb-3 group-hover:text-amber-400 transition-colors">
                            {seance.nom}
                        </h3>

                        <p className="text-sm text-slate-400 leading-relaxed mb-6 line-clamp-3">
                            {seance.objectif}
                        </p>

                        <div className="flex items-center gap-3 mt-auto">
                            <button
                                onClick={() => setSelectedSeance(seance)}
                                className="flex-1 flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-200 py-3 rounded-xl font-semibold transition-all text-sm border border-white/5"
                            >
                                <BookOpen size={16} /> Détails
                            </button>
                            <button
                                onClick={onStartRiderMode}
                                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white py-3 rounded-xl font-semibold transition-all text-sm shadow-lg shadow-amber-900/20"
                            >
                                <Play size={16} fill="currentColor" /> Go
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Session Player Modal - Kept minimal for now as it loads on top */}
            {selectedSeance && (
                <SessionPlayer
                    session={selectedSeance}
                    script={null} // Script handling to be refined
                    onClose={() => setSelectedSeance(null)}
                />
            )}
        </div>
    );
}
