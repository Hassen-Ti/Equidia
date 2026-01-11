import React, { useState, useMemo } from 'react';
import { Play, TrendingUp, Star, Clock, Target, ChevronRight } from 'lucide-react';
import SeancesData from '../data/seances';

export default function RiderHome({ onExplore, onPlay, profile }) {
    const [activeCategory, setActiveCategory] = useState('Dressage');
    const [filterLevel, setFilterLevel] = useState('all');
    const [filterDuration, setFilterDuration] = useState('all');
    const [includeLowerLevels, setIncludeLowerLevels] = useState(false);

    // Recommendation personnalisée selon le niveau du cavalier
    const recommendedSeance = useMemo(() => {
        if (!SeancesData || SeancesData.length === 0) return null;
        const userLevel = profile?.galopLevel || 'G4-5';
        const levelMatches = SeancesData.filter(s => s.niveau === userLevel);
        const source = levelMatches.length > 0 ? levelMatches : SeancesData;

        // Seed based on date to keep recommendation stable for "Today"
        const today = new Date().toDateString();
        let seed = 0;
        for (let i = 0; i < today.length; i++) seed += today.charCodeAt(i);

        return source[seed % source.length];
    }, [profile?.galopLevel]);

    const categories = [
        { id: 'Dressage', label: 'Dressage', image: '/dressage.png' },
        { id: 'Obstacle', label: 'Obstacle', image: '/obstacle.png' },
        { id: 'Balade', label: 'Balade', image: '/trail.png' },
        { id: 'Travail à pied', label: 'TAP', image: '/groundwork.png' },
        { id: 'specifique', label: 'Travail Spécifique', image: '/equestrian_premium.png' },
        { id: 'corrections', label: 'Corrections Ciblées', image: '/equestrian_lifestyle_bg.png' },
    ];

    // Fonction pour vérifier si un niveau est inférieur ou égal au niveau sélectionné
    const isLevelIncluded = (seanceLevel, selectedLevel) => {
        if (selectedLevel === 'all') return true;
        if (!includeLowerLevels) return seanceLevel === selectedLevel;

        // Ordre des niveaux
        const levelOrder = ['G2-3', 'G3-4', 'G4-5', 'G5-6', 'G6-7', 'G7+'];
        const selectedIndex = levelOrder.indexOf(selectedLevel);
        const seanceIndex = levelOrder.indexOf(seanceLevel);

        // Inclure si le niveau de la séance est <= au niveau sélectionné
        return seanceIndex <= selectedIndex;
    };

    const filteredSeances = useMemo(() => {
        return SeancesData.filter(s => {
            const matchesCategory = activeCategory === 'all' ||
                (activeCategory === 'Travail à pied' && s.discipline === 'Travail à pied') ||
                (activeCategory === 'specifique' && s.type === 'Thématique spécifique') ||
                (activeCategory === 'corrections' && s.type === 'Résolution de problème') ||
                (activeCategory !== 'all' && activeCategory !== 'Travail à pied' && activeCategory !== 'specifique' && activeCategory !== 'corrections' && s.discipline === activeCategory);

            const matchesLevel = filterLevel === 'all' || isLevelIncluded(s.niveau, filterLevel);
            const matchesDuration = filterDuration === 'all' || s.duree === filterDuration;

            return matchesCategory && matchesLevel && matchesDuration;
        }).slice(0, 10); // Keep the slice(0, 10) from original
    }, [activeCategory, filterLevel, filterDuration, includeLowerLevels]);

    const getHeroImage = (discipline) => {
        if (!discipline) return '/dressage.png'; // Fallback plus vivant
        switch (discipline) {
            case 'Dressage': return '/dressage.png';
            case 'Obstacle': return '/obstacle.png';
            case 'Balade': return '/trail.png'; // Trail is usually good
            case 'Travail à pied': return '/groundwork.png';
            default: return '/dressage.png';
        }
    };

    return (
        <div className="flex flex-col gap-8 py-6">

            {/* 1. MAGAZINE HERO - PREMIUM & IMMERSIF */}
            <section className="px-6">
                {recommendedSeance ? (
                    <div className="relative h-[420px] rounded-[3rem] overflow-hidden shadow-[0_30px_60px_rgba(74,93,74,0.15)] group border-[6px] border-white animate-in fade-in zoom-in duration-1000">
                        <img
                            src={getHeroImage(recommendedSeance.discipline)}
                            alt="Recommandation"
                            className="w-full h-full object-cover object-top transition-transform duration-[5s] group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                        {/* Badge de Niveau flottant */}


                        <div className="absolute inset-x-6 bottom-6 flex flex-col gap-4">
                            <div className="bg-white/10 backdrop-blur-2xl p-5 rounded-[2rem] border border-white/20 shadow-2xl transform transition-all duration-700 group-hover:-translate-y-1 relative overflow-hidden">
                                <div className="absolute top-0 left-0 bg-equi-gold text-equi-olive text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-br-xl shadow-sm z-10">
                                    Sélection du Jour
                                </div>
                                <h2 className="text-white text-xl font-serif italic mb-2 pt-5 leading-tight tracking-tight">
                                    Notre recommandation du jour pour <span className="text-equi-gold">votre progression :</span>
                                </h2>
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-white text-sm font-bold truncate tracking-wide">{recommendedSeance.nom}</h3>
                                        <div className="flex items-center gap-3 mt-1.5">
                                            <span className="text-white/60 text-[8px] uppercase font-black tracking-[0.2em]">
                                                {recommendedSeance.discipline}
                                            </span>
                                            <span className="w-1 h-1 rounded-full bg-equi-gold opacity-50"></span>
                                            <span className="text-white/60 text-[8px] uppercase font-black tracking-[0.2em]">
                                                {recommendedSeance.duree}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => onPlay(recommendedSeance)}
                                        className="w-12 h-12 rounded-full bg-equi-gold text-equi-olive flex items-center justify-center shadow-xl hover:bg-white hover:scale-110 active:scale-95 transition-all duration-500 group/btn"
                                    >
                                        <Play size={22} fill="currentColor" className="ml-0.5 transition-transform group-hover/btn:scale-110" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="h-[420px] rounded-[3rem] bg-equi-cream flex items-center justify-center border-[6px] border-white">
                        <p className="text-equi-olive font-serif italic text-xl">Aucune séance disponible pour le moment.</p>
                    </div>
                )
                }
            </section >

            {/* 2. NAVIGATION STORIES - SÉLECTEUR DE CATÉGORIES */}
            < section >
                <div className="px-10 mb-8 flex justify-between items-center">
                    <h3 className="text-2xl font-serif italic text-equi-olive font-black tracking-tight">Studio Coaching</h3>
                    <div className="h-[2px] w-12 bg-equi-gold rounded-full"></div>
                </div>

                <div className="flex gap-8 px-10 pb-8 overflow-x-auto no-scrollbar scroll-smooth">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => {
                                setActiveCategory(cat.id);
                                setFilterLevel('all');
                                setFilterDuration('all');
                            }}
                            className="flex flex-col items-center gap-4 shrink-0 group min-w-[100px]"
                        >
                            <div className={`w-24 h-24 rounded-full p-1.5 border-[4px] transition-all duration-700 flex items-center justify-center overflow-hidden shrink-0 shadow-lg
                                ${activeCategory === cat.id ? 'border-equi-gold scale-110 bg-white ring-4 ring-equi-gold/10' : 'border-white group-hover:border-equi-gold/30'}`}>
                                <img src={cat.image} className={`w-full h-full object-cover rounded-full transition-all duration-1000 ${activeCategory === cat.id ? 'grayscale-0 scale-105' : 'grayscale-[60%] group-hover:grayscale-0'}`} alt={cat.label} />
                            </div>
                            <span className={`text-[11px] font-black uppercase tracking-[0.15em] transition-all duration-300 text-center leading-tight
                                ${activeCategory === cat.id ? 'text-equi-olive scale-105' : 'text-equi-clay/60 group-hover:text-equi-olive'}`}>
                                {cat.label}
                            </span>
                        </button>
                    ))}
                </div>
            </section >

            {/* 3. SESSION LIST & FILTERS */}
            < section className="px-6 mb-12" >
                <div className="bg-white/40 backdrop-blur-xl rounded-[3.5rem] p-10 border border-white shadow-2xl relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-48 h-48 bg-equi-sage/5 rounded-full -mr-24 -mt-24 blur-3xl"></div>

                    {/* Header & Filtres */}
                    <div className="flex flex-col gap-8 mb-10 relative z-10">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-2 h-10 bg-equi-gold rounded-full shadow-[0_0_15px_rgba(232,192,125,0.4)]"></div>
                                <h3 className="text-2xl font-serif italic font-black text-equi-olive">{categories.find(c => c.id === activeCategory)?.label}</h3>
                            </div>
                            <span className="text-[10px] font-black text-equi-clay uppercase tracking-[0.3em]">
                                {filteredSeances.length} Séances
                            </span>
                        </div>

                        {/* Barre de Filtres - Design Minimaliste */}
                        {/* Masquer le filtre de niveau pour "Corrections Ciblées" car séances universelles (G3+) */}
                        <div className="flex flex-col gap-4">
                            <div className="flex gap-4">
                                {activeCategory !== 'corrections' && (
                                    <select
                                        value={filterLevel}
                                        onChange={(e) => setFilterLevel(e.target.value)}
                                        className="flex-1 bg-white border border-equi-border rounded-2xl px-5 py-3.5 text-[10px] uppercase font-black tracking-widest text-equi-olive outline-none focus:ring-4 focus:ring-equi-gold/10 focus:border-equi-gold transition-all appearance-none cursor-pointer shadow-sm"
                                    >
                                        <option value="all">Tout Niveau</option>
                                        <option value="G2-3">Galop 2-3</option>
                                        <option value="G4-5">Galop 4-5</option>
                                        <option value="G6-7">Galop 6-7</option>
                                    </select>
                                )}
                                <select
                                    value={filterDuration}
                                    onChange={(e) => setFilterDuration(e.target.value)}
                                    className={`${activeCategory === 'corrections' ? 'w-full' : 'flex-1'} bg-white border border-equi-border rounded-2xl px-5 py-3.5 text-[10px] uppercase font-black tracking-widest text-equi-olive outline-none focus:ring-4 focus:ring-equi-gold/10 focus:border-equi-gold transition-all appearance-none cursor-pointer shadow-sm`}
                                >
                                    <option value="all">Toute Durée</option>
                                    <option value="15">15 min</option>
                                    <option value="20">20 min</option>
                                    <option value="30">30 min</option>
                                    <option value="45">45+ min</option>
                                </select>
                            </div>

                            {/* Toggle "Inclure niveaux inférieurs" - Visible uniquement si un niveau spécifique est sélectionné */}
                            {activeCategory !== 'corrections' && filterLevel !== 'all' && (
                                <label className="flex items-center gap-3 px-2 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={includeLowerLevels}
                                        onChange={(e) => setIncludeLowerLevels(e.target.checked)}
                                        className="w-5 h-5 rounded border-2 border-equi-border text-equi-gold focus:ring-4 focus:ring-equi-gold/10 cursor-pointer transition-all"
                                    />
                                    <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-equi-olive/70 group-hover:text-equi-olive transition-colors">
                                        Inclure les niveaux inférieurs
                                    </span>
                                </label>
                            )}
                        </div>
                    </div>

                    {/* Liste des séances */}
                    <div className="flex flex-col gap-4 relative z-10">
                        {filteredSeances.length > 0 ? filteredSeances.map((seance) => (
                            <button
                                key={seance.id}
                                onClick={() => onPlay(seance)}
                                className="flex items-center gap-6 p-5 rounded-[2.5rem] bg-white border border-equi-border/50 hover:border-equi-gold hover:shadow-[0_20px_40px_rgba(74,93,74,0.08)] hover:-translate-y-1 transition-all duration-500 text-left active:scale-[0.98] group"
                            >
                                <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-inner border-2 border-white shrink-0 group-hover:scale-110 transition-transform bg-equi-cream">
                                    <img
                                        src={getSeanceVisual(seance)}
                                        className="w-full h-full object-cover transition-all duration-700"
                                        style={{
                                            filter: `grayscale(20%) brightness(1.05)`
                                        }}
                                        alt=""
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-equi-olive text-sm mb-1.5 truncate leading-tight tracking-tight group-hover:text-equi-gold transition-colors">{seance.nom}</h4>
                                    <div className="flex items-center gap-4">
                                        <span className="text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md bg-equi-olive/5 text-equi-olive opacity-60">
                                            {seance.niveau}
                                        </span>
                                        <div className="flex items-center gap-1.5 text-[9px] font-black text-equi-clay uppercase tracking-widest opacity-50">
                                            <Clock size={12} /> {seance.duree} min
                                        </div>
                                    </div>
                                </div>
                                <div className="w-12 h-12 rounded-2xl bg-equi-olive/5 flex items-center justify-center text-equi-olive opacity-20 group-hover:opacity-100 group-hover:bg-equi-gold/10 group-hover:text-equi-gold transition-all duration-500">
                                    <ChevronRight size={24} />
                                </div>
                            </button>
                        )) : (
                            <div className="py-16 text-center flex flex-col items-center gap-6 opacity-30">
                                <div className="w-20 h-20 rounded-full bg-equi-olive/5 flex items-center justify-center">
                                    <Target size={32} className="text-equi-olive" />
                                </div>
                                <p className="text-[11px] font-black uppercase tracking-[0.3em] text-equi-olive">À la recherche de nouvelles pépites...</p>
                            </div>
                        )}
                    </div>
                </div>
            </section >
        </div >
    );
}

function getSeanceVisual(seance) {
    const name = seance.nom.toLowerCase();
    const discipline = seance.discipline;

    // Mapping par mot-clé (prioritaire)
    if (name.includes('galop')) return '/dressage.png'; // Remplacer par galop.png si dispos
    if (name.includes('longe') || name.includes('pied') || name.includes('tap')) return '/groundwork.png';
    if (name.includes('saut') || name.includes('obstacle') || name.includes('cavaletti')) return '/obstacle.png';
    if (name.includes('extérieur') || name.includes('balade')) return '/trail.png';
    if (name.includes('cession') || name.includes('souplesse') || name.includes('dressage')) return '/dressage.png';

    // Fallback par discipline
    switch (discipline) {
        case 'Dressage': return '/dressage.png';
        case 'Obstacle': return '/obstacle.png';
        case 'Travail à pied': return '/groundwork.png';
        case 'Balade': return '/trail.png';
        default: return '/equestrian_lifestyle_bg.png';
    }
}
