import React, { useState, useMemo } from 'react';
import { Play, TrendingUp, Star, Clock, Target, ChevronRight } from 'lucide-react';
import SeancesData from '../data/seances';

export default function RiderHome({ onExplore, onPlay, profile, activeHorse }) {
    const [activeCategory, setActiveCategory] = useState('Dressage');
    const [activeSubcategory, setActiveSubcategory] = useState(null);
    const [filterLevel, setFilterLevel] = useState('all');
    const [filterDuration, setFilterDuration] = useState('all');
    const [includeLowerLevels, setIncludeLowerLevels] = useState(true);

    // Définition des sous-catégories
    const subcategories = {
        'Cross & Extérieur sportif': [
            { id: 'all', label: 'Tout Parcourir', themes: null },
            { id: 'galop-cross', label: 'Galop de cross & Condition physique', themes: ['Galop de cross', 'Condition physique', 'Endurance', 'Compétition'] },
            { id: 'gymnastique', label: 'Gymnastique & Préparation technique', themes: ['Gymnastique', 'Technique'] },
            { id: 'obstacles-naturels', label: 'Obstacles spécifiques cross', themes: ['Obstacles naturels'] },
            { id: 'parcours', label: 'Parcours & Mise en situation', themes: ['Parcours', 'Stratégie', 'Mental'] },
            { id: 'recuperation', label: 'Récupération & Soins', themes: ['Récupération'] }
        ],
        'Travail au sol': [
            { id: 'all', label: 'Tout Parcourir', themes: null },
            { id: 'longe', label: 'Longe', themes: ['Longe'] },
            { id: 'liberte', label: 'Travail en main & Liberté', themes: ['Liberté', 'Longues rênes', 'Technique'] },
            { id: 'gymnastique-sol', label: 'Gymnastique & Préparation physique', themes: ['Gymnastique', 'Muscu'] },
            { id: 'education', label: 'Éducation, Confiance & Soins', themes: ['Confiance', 'Éducation', 'Bien-être'] }
        ]
    };

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
        { id: 'Cross & Extérieur sportif', label: 'Cross &\nExtérieur', image: '/trail.png' },
        { id: 'Travail au sol', label: 'Travail\nau Sol', image: '/groundwork.png' },
        { id: 'Détente & Bien-être', label: 'Détente &\nBien-être', image: '/equestrian_lifestyle_bg.png' },
        { id: 'specifique', label: 'Travail\nSpécifique', image: '/equestrian_premium.png' },
        { id: 'corrections', label: 'Corrections\nCiblées', image: '/corrections.png' },
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
                (activeCategory === 'Travail au sol' && s.discipline === 'Travail au sol') ||
                (activeCategory === 'Cross & Extérieur sportif' && s.discipline === 'Cross & Extérieur sportif') ||
                (activeCategory === 'Détente & Bien-être' && s.discipline === 'Détente & Bien-être') ||
                (activeCategory === 'specifique' && s.type === 'Thématique spécifique') ||
                (activeCategory === 'corrections' && s.type === 'Résolution de problème') ||
                (activeCategory !== 'all' && activeCategory !== 'Travail au sol' && activeCategory !== 'Cross & Extérieur sportif' && activeCategory !== 'Détente & Bien-être' && activeCategory !== 'specifique' && activeCategory !== 'corrections' && s.discipline === activeCategory);

            // Filtrage par sous-catégorie
            let matchesSubcategory = true;
            if (activeSubcategory && activeSubcategory !== 'all' && subcategories[activeCategory]) {
                const subcat = subcategories[activeCategory].find(sc => sc.id === activeSubcategory);
                if (subcat && subcat.themes) {
                    matchesSubcategory = subcat.themes.includes(s.theme);
                }
            }

            const matchesLevel = filterLevel === 'all' || isLevelIncluded(s.niveau, filterLevel);
            const matchesDuration = filterDuration === 'all' || s.duree === filterDuration;

            return matchesCategory && matchesSubcategory && matchesLevel && matchesDuration;
        }); // Removed slice(0, 10) to show all sessions
    }, [activeCategory, activeSubcategory, filterLevel, filterDuration, includeLowerLevels]);

    const getHeroImage = (discipline) => {
        if (!discipline) return '/dressage.png'; // Fallback plus vivant
        switch (discipline) {
            case 'Dressage': return '/dressage.png';
            case 'Obstacle': return '/obstacle.png';
            case 'Cross & Extérieur sportif': return '/trail.png';
            case 'Travail au sol': return '/groundwork.png';
            case 'Détente & Bien-être': return '/equestrian_lifestyle_bg.png';
            default: return '/dressage.png';
        }
    };

    return (
        <div className="relative min-h-[800px] rounded-[3rem] overflow-hidden">
            {/* BACKGROUND */}
            <div className="absolute inset-0 z-0 bg-[#FAF7F2]">
                <div className="absolute inset-0 opacity-20 mix-blend-multiply" style={{ backgroundImage: `url('/bg-pattern.png')`, backgroundSize: '250px', backgroundRepeat: 'repeat' }}></div>
                <div className="absolute inset-0 bg-gradient-to-b from-[#FDFBF7]/40 via-[#FDFBF7]/80 to-[#FDFBF7]/95 backdrop-blur-[1px]"></div>
            </div>

            <div className="relative z-10 flex flex-col gap-8 py-6">

                {/* 1. MAGAZINE HERO - PREMIUM & IMMERSIF */}
                <section className="px-6">
                    {recommendedSeance ? (
                        <div className="relative h-[420px] rounded-[3rem] overflow-hidden shadow-[0_30px_60px_rgba(74,93,74,0.15)] group border-[6px] border-[#8C9E79] animate-in fade-in zoom-in duration-1000">
                            <img
                                src={getHeroImage(recommendedSeance.discipline)}
                                alt="Recommandation"
                                className="w-full h-full object-cover object-top transition-transform duration-[5s] group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                            {/* Badge de Niveau flottant */}


                            <div className="absolute inset-x-6 bottom-6 flex flex-col gap-4">
                                <div className="bg-white/10 backdrop-blur-xl p-5 rounded-3xl border border-white/20 shadow-2xl transform transition-all duration-700 group-hover:-translate-y-1 relative overflow-hidden mt-auto">

                                    {/* En-tête de Clarté */}
                                    <div className="flex flex-col gap-1 mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="bg-[#8C9E79] text-white text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded shadow-sm">
                                                Sélection du Jour
                                            </span>
                                            <div className="h-[1px] flex-1 bg-white/30"></div>
                                        </div>
                                        <p className="text-white/90 text-xs font-serif italic">
                                            Recommandé pour <span className="font-bold text-white">{profile?.userName || 'Vous'}</span> & <span className="font-bold text-white">{activeHorse?.name || 'votre cheval'}</span>
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-white text-lg font-bold tracking-wide leading-snug mb-2 drop-shadow-md">
                                                {recommendedSeance.nom}
                                            </h3>
                                            <div className="flex items-center gap-3">
                                                <span className="text-white/90 text-[10px] uppercase font-black tracking-widest bg-black/20 px-2 py-1 rounded backdrop-blur-sm shadow-sm">
                                                    {recommendedSeance.discipline}
                                                </span>
                                                <div className="flex items-center gap-1.5 text-white/80 text-[10px] uppercase font-black tracking-widest">
                                                    <Clock size={12} /> {recommendedSeance.duree}
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => onPlay(recommendedSeance)}
                                            className="w-12 h-12 rounded-full bg-[#8C9E79] text-white flex items-center justify-center shadow-[0_10px_20px_rgba(0,0,0,0.2)] hover:bg-white hover:text-[#8C9E79] hover:scale-110 active:scale-95 transition-all duration-300 group/btn shrink-0 border border-white/20"
                                        >
                                            <Play size={22} fill="currentColor" className="ml-0.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-[420px] rounded-[3rem] bg-equi-cream flex items-center justify-center border-[6px] border-[#8C9E79]">
                            <p className="text-equi-olive font-serif italic text-xl">Aucune séance disponible pour le moment.</p>
                        </div>
                    )
                    }
                </section >

                {/* 2. NAVIGATION STORIES - SÉLECTEUR DE CATÉGORIES */}
                < section >
                    <div className="px-10 mb-8 text-center">
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-equi-clay/60 block mb-2">Explorer</span>
                        <h3 className="text-3xl font-serif italic text-equi-olive font-black tracking-tight">Nos Disciplines</h3>
                    </div>

                    <div className="flex gap-8 px-10 py-8 overflow-x-auto no-scrollbar scroll-smooth">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => {
                                    setActiveCategory(cat.id);
                                    setActiveSubcategory(null); // Reset subcategory when changing category
                                    setFilterLevel('all');
                                    setFilterDuration('all');
                                }}
                                className="flex flex-col items-center gap-4 shrink-0 group min-w-[100px]"
                            >
                                <div className={`w-24 h-24 rounded-full p-1.5 border-[4px] transition-all duration-700 flex items-center justify-center overflow-hidden shrink-0 shadow-lg
                                ${activeCategory === cat.id ? 'border-[#8C9E79] scale-110 bg-white ring-4 ring-[#8C9E79]/10' : 'border-white group-hover:border-[#8C9E79]/30'}`}>
                                    <img src={cat.image} className={`w-full h-full object-cover rounded-full transition-all duration-1000 ${activeCategory === cat.id ? 'grayscale-0 scale-105' : 'grayscale-[60%] group-hover:grayscale-0'}`} alt={cat.label} />
                                </div>
                                <span className={`text-[11px] font-black uppercase tracking-[0.15em] transition-all duration-300 text-center leading-tight whitespace-pre-line
                                ${activeCategory === cat.id ? 'text-equi-olive scale-105' : 'text-equi-clay/60 group-hover:text-equi-olive'}`}>
                                    {cat.label}
                                </span>
                            </button>
                        ))}
                    </div>


                </section >

                {/* 3. SESSION LIST & FILTERS */}
                < section className="px-6 mb-12" >
                    <div className="bg-white/40 backdrop-blur-xl rounded-[3.5rem] p-6 border border-white shadow-2xl relative overflow-hidden">
                        {/* Background decoration */}
                        <div className="absolute top-0 right-0 w-48 h-48 bg-equi-sage/5 rounded-full -mr-24 -mt-24 blur-3xl"></div>



                        {/* Header & Filtres */}
                        <div className="flex flex-col gap-8 mb-10 relative z-10">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-2 h-10 bg-[#8C9E79] rounded-full shadow-[0_0_15px_rgba(148,172,136,0.4)]"></div>
                                    <h3 className="text-2xl font-serif italic font-black text-equi-olive">{categories.find(c => c.id === activeCategory)?.label}</h3>
                                </div>
                                <span className="text-[10px] font-black text-equi-clay uppercase tracking-[0.3em]">
                                    {filteredSeances.length} Séances
                                </span>
                            </div>

                            {/* Sous-catégories (Dropdown Compact avec Label) */}
                            {subcategories[activeCategory] && (
                                <div className="mb-4">
                                    <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-equi-clay/70 ml-2 mb-2">
                                        Filtrer par Thématique :
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={activeSubcategory || 'all'}
                                            onChange={(e) => setActiveSubcategory(e.target.value)}
                                            className="w-full bg-equi-olive/5 border-2 border-transparent hover:border-[#8C9E79]/30 rounded-2xl pl-5 pr-10 py-3.5 text-[11px] uppercase font-black tracking-widest text-equi-olive outline-none focus:ring-4 focus:ring-[#8C9E79]/10 focus:border-[#8C9E79] transition-all appearance-none cursor-pointer"
                                        >
                                            {subcategories[activeCategory].map((subcat) => (
                                                <option key={subcat.id} value={subcat.id}>
                                                    {subcat.label}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-equi-olive/50">
                                            <ChevronRight className="rotate-90" size={16} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Barre de Filtres - Design Minimaliste */}
                            {/* Masquer le filtre de niveau pour "Corrections Ciblées" car séances universelles (G3+) */}
                            <div className="flex flex-col gap-4">
                                <div className="flex gap-4">
                                    {activeCategory !== 'corrections' && (
                                        <select
                                            value={filterLevel}
                                            onChange={(e) => setFilterLevel(e.target.value)}
                                            className="flex-1 bg-white border border-equi-border rounded-2xl px-5 py-3.5 text-[10px] uppercase font-black tracking-widest text-equi-olive outline-none focus:ring-4 focus:ring-[#8C9E79]/10 focus:border-[#8C9E79] transition-all appearance-none cursor-pointer shadow-sm"
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
                                        className={`${activeCategory === 'corrections' ? 'w-full' : 'flex-1'} bg-white border border-equi-border rounded-2xl px-5 py-3.5 text-[10px] uppercase font-black tracking-widest text-equi-olive outline-none focus:ring-4 focus:ring-[#8C9E79]/10 focus:border-[#8C9E79] transition-all appearance-none cursor-pointer shadow-sm`}
                                    >
                                        <option value="all">Toute Durée</option>
                                        <option value="15min">15 min</option>
                                        <option value="20min">20 min</option>
                                        <option value="30min">30 min</option>
                                        <option value="45min">45+ min</option>
                                    </select>
                                </div>

                                {/* Toggle "Inclure niveaux inférieurs" - Visible uniquement si un niveau spécifique est sélectionné */}
                                {activeCategory !== 'corrections' && filterLevel !== 'all' && (
                                    <label className="flex items-center gap-3 px-2 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={includeLowerLevels}
                                            onChange={(e) => setIncludeLowerLevels(e.target.checked)}
                                            className="w-5 h-5 rounded border-2 border-equi-border text-[#8C9E79] focus:ring-4 focus:ring-[#8C9E79]/10 cursor-pointer transition-all"
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
                                    className="flex items-center gap-3 p-4 rounded-[2.5rem] bg-white border border-equi-border/50 hover:border-[#8C9E79] hover:shadow-[0_20px_40px_rgba(74,93,74,0.08)] hover:-translate-y-1 transition-all duration-500 text-left active:scale-[0.98] group"
                                >
                                    <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-inner border-2 border-white shrink-0 group-hover:scale-110 transition-transform bg-equi-cream">
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
                                        <h4 className="font-bold text-equi-olive text-base mb-1.5 leading-snug group-hover:text-[#8C9E79] transition-colors">
                                            {seance.nom}
                                        </h4>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md bg-equi-olive/5 text-equi-olive opacity-80 whitespace-nowrap">
                                                {seance.niveau}
                                            </span>
                                            <div className="flex items-center gap-1.5 text-[10px] font-black text-equi-clay uppercase tracking-widest opacity-60 whitespace-nowrap">
                                                <Clock size={12} /> {seance.duree}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-equi-olive/5 flex items-center justify-center text-equi-olive opacity-20 group-hover:opacity-100 group-hover:bg-[#8C9E79]/10 group-hover:text-[#8C9E79] transition-all duration-500 shrink-0">
                                        <ChevronRight size={18} />
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
            </div></div>
    );
}

function getSeanceVisual(seance) {
    // Priorité absolue aux types spéciaux
    if (seance.type === 'Résolution de problème') return '/corrections.png';
    if (seance.type === 'Thématique spécifique') return '/equestrian_premium.png';

    // Ensuite, mappage strict par discipline
    switch (seance.discipline) {
        case 'Dressage': return '/dressage.png';
        case 'Obstacle': return '/obstacle.png';
        case 'Cross & Extérieur sportif': return '/trail.png';
        case 'Travail au sol': return '/groundwork.png';
        case 'Détente & Bien-être': return '/equestrian_lifestyle_bg.png';
        default: return '/equestrian_lifestyle_bg.png';
    }
}
