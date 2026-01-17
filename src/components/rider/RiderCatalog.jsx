import React, { useState } from 'react';
import { Search, Clock, ChevronRight } from 'lucide-react';
import SeancesData from '../data/seances';

export default function RiderCatalog({ onPlay }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedNiveau, setSelectedNiveau] = useState('Tous');
    const [selectedDuree, setSelectedDuree] = useState('Toutes');
    const [selectedDiscipline, setSelectedDiscipline] = useState('Toutes');

    // Limiter aux 20 premières séances pour le MVP
    const mvpSeances = SeancesData.slice(0, 20);

    const filteredSeances = mvpSeances.filter(s => {
        const matchSearch = s.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.discipline.toLowerCase().includes(searchTerm.toLowerCase());
        const matchNiveau = selectedNiveau === 'Tous' || s.niveau === selectedNiveau;
        const matchDuree = selectedDuree === 'Toutes' || s.duree === selectedDuree;

        // Filtrage par discipline/type
        const matchDiscipline = selectedDiscipline === 'Toutes' ||
            s.discipline === selectedDiscipline ||
            (selectedDiscipline === 'Thématique spécifique' && s.type === 'Thématique spécifique') ||
            (selectedDiscipline === 'Résolution de problème' && s.type === 'Résolution de problème');

        return matchSearch && matchNiveau && matchDuree && matchDiscipline;
    });

    // Extraire les niveaux et durées uniques de TOUTES les séances
    const niveaux = ['Tous', ...new Set(SeancesData.map(s => s.niveau))];
    const durees = ['Toutes', ...new Set(SeancesData.map(s => s.duree))].sort((a, b) => {
        if (a === 'Toutes') return -1;
        if (b === 'Toutes') return 1;
        return parseInt(a) - parseInt(b);
    });

    // Liste manuelle des disciplines pour inclure toutes les catégories pertinentes
    const disciplines = [
        'Toutes',
        'Dressage',
        'Obstacle',
        'Cross & Extérieur sportif',
        'Travail au sol',
        'Détente & Bien-être',
        'Thématique spécifique',
        'Résolution de problème'
    ];

    return (
        <div className="relative min-h-screen">
            {/* BACKGROUND */}
            <div className="absolute inset-0 z-0 overflow-hidden bg-[#FAF7F2]">
                <div className="absolute inset-0 opacity-20 mix-blend-multiply" style={{ backgroundImage: `url('${import.meta.env.BASE_URL}bg-pattern.png')`, backgroundSize: '250px', backgroundRepeat: 'repeat' }}></div>
                <div className="absolute inset-0 bg-gradient-to-b from-[#FDFBF7]/40 via-[#FDFBF7]/80 to-[#FDFBF7]/95 backdrop-blur-[1px]"></div>
            </div>

            <div className="relative z-10 p-8 flex flex-col gap-10 pb-32">

                {/* Header Editorial Modernisé */}
                <section className="animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="flex flex-col mb-12 text-center relative mt-4">
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-16 h-1 bg-[#8C9E79] rounded-full"></div>
                        <h2 className="text-4xl font-serif italic text-equi-olive font-black tracking-tighter">Bibliothèque</h2>
                        <p className="text-[9px] font-black uppercase tracking-[0.5em] text-equi-clay mt-4 bg-equi-olive/5 py-2 px-6 rounded-full mx-auto shadow-sm">
                            Édition Hiver 2026
                        </p>
                    </div>

                    {/* Barre de Recherche Premium */}
                    <div className="relative group mx-2">
                        <div className="absolute inset-0 bg-[#8C9E79]/5 blur-2xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                        <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-equi-olive/30 group-focus-within:text-[#8C9E79] transition-all" size={24} />
                        <input
                            type="text"
                            placeholder="Qu'allez-vous travailler ?"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/60 backdrop-blur-xl border-2 border-white/50 rounded-[2.5rem] py-6 pl-20 pr-8 shadow-2xl focus:ring-8 focus:ring-[#8C9E79]/5 focus:border-[#8C9E79] outline-none text-base transition-all placeholder:text-equi-clay/40 font-medium text-equi-olive"
                        />
                    </div>

                    {/* Filtres Niveau, Durée et Discipline */}
                    <div className="flex gap-4 mt-6 mx-2">
                        {/* Filtre Discipline */}
                        <div className="flex-1">
                            <label className="text-[9px] font-black uppercase tracking-[0.3em] text-equi-clay mb-2 block ml-4">Discipline</label>
                            <select
                                value={selectedDiscipline}
                                onChange={(e) => setSelectedDiscipline(e.target.value)}
                                className="w-full bg-white/60 backdrop-blur-xl border-2 border-white/50 rounded-[2rem] py-4 px-6 shadow-lg focus:ring-4 focus:ring-[#8C9E79]/10 focus:border-[#8C9E79] outline-none text-sm font-semibold text-equi-olive transition-all cursor-pointer hover:bg-white/80"
                            >
                                {disciplines.map(discipline => (
                                    <option key={discipline} value={discipline}>{discipline}</option>
                                ))}
                            </select>
                        </div>

                        {/* Filtre Niveau */}
                        <div className="flex-1">
                            <label className="text-[9px] font-black uppercase tracking-[0.3em] text-equi-clay mb-2 block ml-4">Niveau</label>
                            <select
                                value={selectedNiveau}
                                onChange={(e) => setSelectedNiveau(e.target.value)}
                                className="w-full bg-white/60 backdrop-blur-xl border-2 border-white/50 rounded-[2rem] py-4 px-6 shadow-lg focus:ring-4 focus:ring-[#8C9E79]/10 focus:border-[#8C9E79] outline-none text-sm font-semibold text-equi-olive transition-all cursor-pointer hover:bg-white/80"
                            >
                                {niveaux.map(niveau => (
                                    <option key={niveau} value={niveau}>{niveau}</option>
                                ))}
                            </select>
                        </div>

                        {/* Filtre Durée */}
                        <div className="flex-1">
                            <label className="text-[9px] font-black uppercase tracking-[0.3em] text-equi-clay mb-2 block ml-4">Durée</label>
                            <select
                                value={selectedDuree}
                                onChange={(e) => setSelectedDuree(e.target.value)}
                                className="w-full bg-white/60 backdrop-blur-xl border-2 border-white/50 rounded-[2rem] py-4 px-6 shadow-lg focus:ring-4 focus:ring-[#8C9E79]/10 focus:border-[#8C9E79] outline-none text-sm font-semibold text-equi-olive transition-all cursor-pointer hover:bg-white/80"
                            >
                                {durees.map(duree => (
                                    <option key={duree} value={duree}>
                                        {duree === 'Toutes' ? 'Toutes' : `${duree} min`}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </section>

                {/* Liste de séances Style Editorial */}
                <section className="flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
                    {filteredSeances.length > 0 ? (
                        filteredSeances.map((seance) => (
                            <button
                                key={seance.id}
                                onClick={() => onPlay(seance)}
                                className="bg-white/40 backdrop-blur-md border border-white/80 p-6 rounded-[3rem] flex items-center gap-6 hover:bg-white hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 text-left group active:scale-[0.98]"
                            >
                                <div className="w-20 h-20 rounded-[1.8rem] overflow-hidden shadow-xl border-4 border-white shrink-0 group-hover:scale-110 transition-transform bg-equi-cream relative">
                                    <img
                                        src={getSeanceVisual(seance)}
                                        className="w-full h-full object-cover grayscale-[30%]"
                                        alt=""
                                    />
                                    <div className="absolute inset-0 bg-equi-olive/10 group-hover:opacity-0 transition-opacity"></div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-equi-olive text-base mb-2 truncate leading-tight tracking-tight group-hover:text-[#8C9E79] transition-colors">{seance.nom}</h4>
                                    <div className="flex items-center gap-5">
                                        <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg bg-equi-olive text-white shadow-md">
                                            {seance.niveau}
                                        </span>
                                        <div className="flex items-center gap-2 text-[10px] font-black text-equi-clay uppercase tracking-[0.2em] opacity-60">
                                            <Clock size={14} className="opacity-40" /> {seance.duree} MIN
                                        </div>
                                    </div>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-equi-olive/5 flex items-center justify-center text-equi-olive opacity-20 group-hover:opacity-100 group-hover:bg-[#8C9E79]/10 group-hover:text-[#8C9E79] transition-all duration-500">
                                    <ChevronRight size={22} />
                                </div>
                            </button>
                        ))
                    ) : (
                        <div className="py-24 text-center flex flex-col items-center gap-8 opacity-30">
                            <div className="w-24 h-24 bg-equi-olive/5 rounded-full flex items-center justify-center border-2 border-white/50">
                                <Search size={40} className="text-equi-olive" />
                            </div>
                            <p className="text-xs font-black uppercase tracking-[0.3em] text-equi-olive">Rien ne correspond à votre recherche</p>
                        </div>
                    )}
                </section>
            </div></div>
    );
}

function getSeanceVisual(seance) {
    const name = seance.nom.toLowerCase();
    const discipline = seance.discipline;

    // Mapping par mot-clé (prioritaire)
    if (name.includes('cross') || name.includes('fossé') || name.includes('tronc') || name.includes('gué')) return `${import.meta.env.BASE_URL}trail.png`;
    if (name.includes('détente') || name.includes('bien-être') || name.includes('relaxation') || name.includes('zen')) return `${import.meta.env.BASE_URL}equestrian_lifestyle_bg.png`;
    if (name.includes('galop')) return `${import.meta.env.BASE_URL}dressage.png`;
    if (name.includes('longe') || name.includes('pied') || name.includes('sol')) return `${import.meta.env.BASE_URL}groundwork.png`;
    if (name.includes('saut') || name.includes('obstacle') || name.includes('cavaletti')) return `${import.meta.env.BASE_URL}obstacle.png`;
    if (name.includes('cession') || name.includes('souplesse') || name.includes('dressage')) return `${import.meta.env.BASE_URL}dressage.png`;

    // Fallback par discipline
    switch (discipline) {
        case 'Dressage': return `${import.meta.env.BASE_URL}dressage.png`;
        case 'Obstacle': return `${import.meta.env.BASE_URL}obstacle.png`;
        case 'Cross & Extérieur sportif': return `${import.meta.env.BASE_URL}trail.png`;
        case 'Travail au sol': return `${import.meta.env.BASE_URL}groundwork.png`;
        case 'Détente & Bien-être': return `${import.meta.env.BASE_URL}equestrian_lifestyle_bg.png`;
        default: return `${import.meta.env.BASE_URL}equestrian_lifestyle_bg.png`;
    }
}
