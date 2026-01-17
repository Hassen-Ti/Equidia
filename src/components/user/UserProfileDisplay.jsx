import React, { useState } from 'react';
import { Edit2, Award, TrendingUp, Calendar, Zap, Layout, Settings, Trophy, Activity } from 'lucide-react';
import profileRiderImg from '/profile_rider.png';
import profileHorseImg from '/profile_horse.png';
import bgPatternImg from '/bg-pattern.png';

export default function UserProfileDisplay({ profile, activeHorse, onEdit, onSwitchHorse }) {
    // --- DONNÉES MOCKÉES DYNAMIQUES ---
    // (Dans une vraie app, cela viendrait du backend)
    const MOCK_HISTORY = [
        { date: "16 Jan", fullDate: new Date(new Date().setDate(new Date().getDate() - 1)), title: "Mise en selle", duration: "30", type: "Plat" },
        { date: "12 Jan", fullDate: new Date(new Date().setDate(new Date().getDate() - 5)), title: "Maintien en forme", duration: "45", type: "Plat" },
        { date: "10 Jan", fullDate: new Date(new Date().setDate(new Date().getDate() - 7)), title: "Travail des transitions", duration: "30", type: "Dressage" },
        { date: "05 Jan", fullDate: new Date(new Date().setDate(new Date().getDate() - 12)), title: "Balade en forêt", duration: "60", type: "Extérieur" },
        { date: "28 Déc", fullDate: new Date(new Date().setDate(new Date().getDate() - 20)), title: "Sauts de puce", duration: "45", type: "Obstacle" },
        { date: "15 Déc", fullDate: new Date(new Date().setDate(new Date().getDate() - 32)), title: "Longe et Liberté", duration: "20", type: "TAP" },
        { date: "02 Nov", fullDate: new Date(new Date().setDate(new Date().getDate() - 75)), title: "Concours Club 2", duration: "N/A", type: "Compétition" },
    ];

    // --- STATE MANAGEMENT ---
    // 4. Gestion de la Période (Time Range) & Interface
    const [timeRange, setTimeRange] = useState('3m'); // Default wider range
    const [isTimeMenuOpen, setIsTimeMenuOpen] = useState(false);
    const [isHistoryExpanded, setIsHistoryExpanded] = useState(false); // Pour le bouton "Voir tout"

    // --- HELPERS ---
    const getTimeRangeLabel = () => {
        switch (timeRange) {
            case '7d': return '7 Derniers Jours';
            case '1m': return 'Ce Mois-ci';
            case '3m': return '3 Derniers Mois';
            case '6m': return '6 Derniers Mois';
            case '1y': return 'Cette Année';
            default: return 'Ce Mois-ci';
        }
    };

    const isDateInRange = (date, range) => {
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        switch (range) {
            case '7d': return diffDays <= 7;
            case '1m': return diffDays <= 30;
            case '3m': return diffDays <= 90;
            case '6m': return diffDays <= 180;
            case '1y': return diffDays <= 365;
            default: return true;
        }
    };

    const getMultiplier = () => {
        switch (timeRange) {
            case '7d': return 0.25;
            case '1m': return 1;
            case '3m': return 3;
            case '6m': return 6;
            case '1y': return 12;
            default: return 1;
        }
    };

    // --- CALCULATIONS ---
    // 1. Filtrer l'historique selon la période et le cheval actif
    const filteredHistoryFull = MOCK_HISTORY.filter(log => {
        return isDateInRange(log.fullDate, timeRange);
    });

    // On limite à 3 items si non-étendu
    const displayHistory = isHistoryExpanded ? filteredHistoryFull : filteredHistoryFull.slice(0, 3);

    // 2. Calculer les statistiques
    const stats = {
        count: filteredHistoryFull.length,
        hours: Math.round(filteredHistoryFull.reduce((acc, curr) => acc + (parseInt(curr.duration) || 0), 0) / 60),
        plat: filteredHistoryFull.filter(h => h.type === 'Plat').length,
        obstacle: filteredHistoryFull.filter(h => h.type === 'Obstacle').length,
        balade: filteredHistoryFull.filter(h => h.type === 'Extérieur').length
    };

    // 3. Calculer les pourcentages pour la répartition
    const totalForCalc = stats.count || 1;
    const dist = {
        plat: Math.round((stats.plat / totalForCalc) * 100),
        obstacle: Math.round((stats.obstacle / totalForCalc) * 100),
        exterieur: Math.round((stats.balade / totalForCalc) * 100)
    };

    // Stats ajustées (On utilise les vraies stats filtrées maintenant, plus de simulation de multiplier sauf si voulu pour demo)
    // NOTE: Si on veut garder la logique de multiplier pour "simuler" plus de données sur les grandes périodes même avec peu de mock data :
    // const displayStats = { count: Math.round(stats.count * getMultiplier()), ... }
    // MAIS ici on a des vraies données mockées filtrées, donc on affiche les VRAIES stats filtrées.
    const displayStats = {
        count: stats.count,
        hours: stats.hours
    };


    const weeklySessions = [true, false, true, true, false, false, false];

    return (
        <div className="min-h-screen relative font-sans text-[#8C9E79] pb-32">

            {/* BACKGROUND - Boho Sketch Pattern (Identical to Form) */}
            <div className="absolute inset-0 z-0 overflow-hidden bg-[#FAF7F2]">
                <div
                    className="absolute inset-0 opacity-25 mix-blend-multiply"
                    style={{
                        backgroundImage: `url('${bgPatternImg}')`,
                        backgroundSize: '250px',
                        backgroundRepeat: 'repeat'
                    }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-b from-[#FDFBF7]/40 via-[#FDFBF7]/80 to-[#FDFBF7]/95 backdrop-blur-[1px]"></div>
            </div>

            {/* CONTENT */}
            <div className="relative z-10 px-6 pt-12 flex flex-col gap-6 animate-in fade-in duration-700">

                {/* 1. HEADER - Identité avec Photo (Optimisé & Remonté) */}
                <div className="flex flex-col items-center pt-6">
                    <div className="relative">
                        <div className="w-36 h-36 rounded-full border-4 border-white shadow-2xl bg-[#E8DCCA] flex items-center justify-center relative z-10 overflow-hidden">
                            <img src={profileRiderImg} alt="Profil Cavalier" className="w-full h-full object-cover" />
                        </div>
                        {/* Level Badge */}
                        <div className="absolute -bottom-2 -right-2 bg-[#8C9E79] text-[#E8DCCA] text-xs font-black uppercase px-3 py-1.5 rounded-full shadow-lg border-2 border-white z-20">
                            {profile.galopLevel || 'G5'}
                        </div>
                        {/* Edit Button */}
                        <button
                            onClick={onEdit}
                            className="absolute top-1 -right-1 bg-white text-[#8C9E79] p-2.5 rounded-full shadow-md border hover:bg-gray-50 transition-colors z-20"
                        >
                            <Edit2 size={16} />
                        </button>
                    </div>

                    <h1 className="font-serif text-3xl font-bold mt-3 text-[#8C9E79] drop-shadow-sm leading-none">
                        {profile.userName || 'Cavalier'}
                    </h1>
                    <p className="text-xs uppercase tracking-[0.2em] opacity-60 font-bold mt-1 mb-3">
                        Membre depuis 2024
                    </p>

                    <button
                        onClick={onEdit}
                        className="flex items-center gap-2 px-5 py-2 bg-white border border-[#8C9E79]/10 rounded-full shadow-sm text-xs font-bold text-[#8C9E79] uppercase tracking-wider hover:bg-[#FAF7F2] transition-colors"
                    >
                        <Edit2 size={12} /> Modifier mon profil
                    </button>
                </div>

                {/* 2. MAIN STATS ROW - The "Gamified" feel */}
                <div className="grid grid-cols-2 gap-4 px-4">
                    <StatCard
                        icon={<Trophy size={16} />}
                        value={profile.stats?.sessionsCompleted || 0}
                        label="Séances"
                    />
                    <StatCard
                        icon={<Activity size={16} />}
                        value={`${Math.round((profile.stats?.totalMinutes || 0) / 60)}h`}
                        label="Pratique"
                    />
                </div>

                {/* 3. CHOICE & PARTNER (Moved Up) - Editorial Style Selector */}
                {profile.horses && profile.horses.length > 1 && (
                    <div className="flex gap-6 overflow-x-auto pb-2 no-scrollbar px-4 mt-4 items-baseline">
                        {profile.horses.map(horse => (
                            <button
                                key={horse.id}
                                onClick={() => onSwitchHorse(horse.id)}
                                className={`group flex flex-col items-center gap-1 transition-all ${activeHorse?.id === horse.id
                                    ? 'opacity-100 scale-105'
                                    : 'opacity-70 hover:opacity-100 scale-95'
                                    }`}
                            >
                                <span className={`font-serif text-lg font-bold uppercase tracking-widest transition-colors ${activeHorse?.id === horse.id ? 'text-[#8C9E79]' : 'text-[#8C9E79]/50'}`}>
                                    {horse.name}
                                </span>
                                <div className={`h-0.5 rounded-full bg-[#8C9E79] transition-all duration-300 ${activeHorse?.id === horse.id ? 'opacity-100 w-full mt-1' : 'opacity-0 w-0'}`}></div>
                            </button>
                        ))}
                    </div>
                )}

                {/* Partner Card - V1 Layout avec Photo Agrandie */}
                <div className="bg-[#8C9E79] text-[#E8DCCA] rounded-[2.5rem] p-6 shadow-2xl relative overflow-hidden group">
                    <div className="absolute -right-4 -bottom-8 text-9xl font-serif opacity-5 select-none pointer-events-none group-hover:opacity-10 transition-opacity">
                        {activeHorse?.name ? activeHorse.name.charAt(0) : 'H'}
                    </div>

                    <div className="flex justify-between items-start relative z-10">
                        <div className="flex-1 pr-2">
                            <span className="text-[10px] font-black uppercase tracking-widest bg-white/10 px-2 py-1 rounded text-white/60">
                                Partenaire Actif
                            </span>
                            <h2 className="font-serif text-3xl font-bold mt-2 text-white leading-tight">
                                {activeHorse?.name || 'Votre Cheval'}
                            </h2>
                            <div className="flex gap-2 mt-2">
                                <Badge text={`${activeHorse?.age || '?'} Ans`} />
                                <Badge text={activeHorse?.color || 'Robe'} />
                            </div>
                        </div>
                        {/* PHOTO CHEVAL (Agrandie) */}
                        <div className="w-28 h-28 rounded-3xl bg-white/10 flex items-center justify-center border-2 border-white/20 overflow-hidden shadow-lg relative shrink-0 -mt-2 -mr-2">
                            <img src={profileHorseImg} alt="Cheval" className="w-full h-full object-cover" />
                            {/* Small Edit Icon Overlay */}
                            <div className="absolute bottom-1 right-1 bg-white/90 p-1.5 rounded-full text-[#8C9E79] shadow-sm cursor-pointer hover:scale-110 transition-transform">
                                <Edit2 size={10} />
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 grid grid-cols-2 gap-4 relative z-10">
                        <div>
                            <p className="text-[9px] uppercase tracking-wider opacity-50 mb-1">Tempérament</p>
                            <p className="font-bold text-lg">{activeHorse?.temperament || 'Non défini'}</p>
                        </div>
                        <div>
                            <p className="text-[9px] uppercase tracking-wider opacity-50 mb-1">Points clés</p>
                            <div className="flex flex-wrap gap-1">
                                {activeHorse?.issues && activeHorse.issues.length > 0 ? (
                                    activeHorse.issues.slice(0, 2).map(issue => (
                                        <span key={issue} className="text-[10px] font-bold bg-white/20 px-1.5 py-0.5 rounded">{issue}</span>
                                    ))
                                ) : (
                                    <p className="font-bold text-lg">-</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. DASHBOARD (Stats + Distribution) */}
                <div className="bg-white/60 backdrop-blur-md rounded-3xl p-6 border border-white/40 shadow-xl transition-all duration-500">
                    <div className="flex flex-col gap-4 mb-6">
                        <div className="flex justify-between items-center">
                            <h3 className="font-serif font-bold text-lg text-[#8C9E79] flex items-center gap-2">
                                <Activity size={18} className="text-[#8C9E79]" /> Tableau de Bord
                            </h3>
                            {/* Time Range Selector */}
                            {/* Time Range Selector - Compact Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setIsTimeMenuOpen(!isTimeMenuOpen)}
                                    className="w-8 h-8 rounded-full bg-[#EAEAE0] flex items-center justify-center text-[#8C9E79] hover:bg-[#8C9E79] hover:text-white transition-all shadow-sm"
                                >
                                    <Calendar size={14} />
                                </button>

                                {isTimeMenuOpen && (
                                    <div className="absolute right-0 top-10 bg-white rounded-xl shadow-xl border border-[#8C9E79]/20 py-2 w-32 z-20 animate-in fade-in zoom-in-95 duration-200">
                                        {['7d', '1m', '3m', '6m', '1y'].map(range => (
                                            <button
                                                key={range}
                                                onClick={() => {
                                                    setTimeRange(range);
                                                    setIsTimeMenuOpen(false);
                                                }}
                                                className={`w-full text-left px-4 py-2 text-[10px] font-bold uppercase hover:bg-[#FAF7F2] transition-colors ${timeRange === range ? 'text-[#8C9E79] bg-[#8C9E79]/5' : 'text-gray-400'
                                                    }`}
                                            >
                                                {range === '7d' ? '7 Jours' :
                                                    range === '1m' ? '1 Mois' :
                                                        range === '3m' ? '3 Mois' :
                                                            range === '6m' ? '6 Mois' : '1 An'}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <p className="text-[10px] uppercase font-bold text-[#8C9E79]/40 tracking-wider -mt-3">
                            {getTimeRangeLabel()}
                        </p>
                    </div>

                    {/* Stats Mensuelles Dynamiques */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-[#FAF7F2] p-3 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden group">
                            <div className="absolute inset-0 bg-[#8C9E79]/5 scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom duration-500"></div>
                            <span className="text-3xl font-serif font-black text-[#8C9E79] z-10">{displayStats.count}</span>
                            <span className="text-[9px] uppercase font-bold text-[#8C9E79]/60 z-10">Séances</span>
                        </div>
                        <div className="bg-[#FAF7F2] p-3 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden group">
                            <div className="absolute inset-0 bg-[#8C9E79]/5 scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom duration-500"></div>
                            <span className="text-3xl font-serif font-black text-[#8C9E79] z-10">{displayStats.hours}h</span>
                            <span className="text-[9px] uppercase font-bold text-[#8C9E79]/60 z-10">Pratique</span>
                        </div>
                    </div>

                    {/* 3. REPARTITION DU TRAVAIL (Welfare Focus) - DYNAMIQUE */}
                    <div>
                        <div className="flex justify-between items-end mb-3">
                            <h3 className="font-bold text-xs uppercase tracking-widest text-[#8C9E79]/70 flex items-center gap-2">
                                <Layout size={14} /> Répartition
                            </h3>
                        </div>

                        {stats.count > 0 ? (
                            <>
                                {/* Distribution Bar */}
                                <div className="flex h-5 w-full rounded-full overflow-hidden shadow-sm mb-3">
                                    <div className="h-full bg-[#8C9E79] transition-all duration-1000" style={{ width: `${dist.plat}%` }}></div>
                                    <div className="h-full bg-[#C17C74] transition-all duration-1000" style={{ width: `${dist.obstacle}%` }}></div>
                                    <div className="h-full bg-[#E8DCCA] transition-all duration-1000" style={{ width: `${dist.exterieur}%` }}></div>
                                </div>

                                {/* Legend */}
                                <div className="flex justify-between px-1">
                                    <div className="flex items-center gap-1">
                                        <div className="w-2 h-2 rounded-full bg-[#8C9E79]"></div>
                                        <span className="text-[9px] font-bold text-equi-olive">Plat {dist.plat}%</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className="w-2 h-2 rounded-full bg-[#C17C74]"></div>
                                        <span className="text-[9px] font-bold text-equi-olive">Saut {dist.obstacle}%</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className="w-2 h-2 rounded-full bg-[#E8DCCA]"></div>
                                        <span className="text-[9px] font-bold text-equi-olive">Ext {dist.exterieur}%</span>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <p className="text-center text-xs text-black/30 italic py-2">Pas assez de données</p>
                        )}
                    </div>
                </div>

                {/* Timeline Historique Dynamique */}
                <div className="space-y-4 pt-4">
                    <div className="flex items-center justify-between px-2">
                        <h4 className="font-black text-[#8C9E79] uppercase text-xs tracking-widest opacity-50">Activités ({filteredHistoryFull.length})</h4>
                        {/* Indicateur de filtre actif pour la liste */}
                        <span className="text-[9px] font-bold text-[#8C9E79]/40">{getTimeRangeLabel()}</span>
                    </div>

                    <div className="relative">
                        {displayHistory.length > 0 ? (
                            <div className="space-y-0">
                                {displayHistory.map((log, idx) => (
                                    <div key={idx} className="flex items-center gap-4 py-3 border-b border-[#8C9E79]/10 last:border-0 animate-in slide-in-from-right-2 duration-300">
                                        <div className="text-center w-12 shrink-0">
                                            <span className="block text-[10px] font-black uppercase text-[#8C9E79]/60">{log.date}</span>
                                        </div>
                                        <div className="px-1 relative">
                                            <div className="w-2 h-2 rounded-full bg-[#8C9E79]"></div>
                                            {/* Ligne connecteur excepté pour le tout dernier si on voit tout, ou juste pour faire joli */}
                                            <div className="absolute top-3 left-0.5 w-0.5 h-full bg-[#8C9E79]/20 -z-10"></div>
                                        </div>
                                        <div className="flex-1">
                                            <h5 className="text-sm font-bold text-equi-clay leading-tight">{log.title}</h5>
                                            <p className="text-[10px] font-medium text-[#8C9E79]/70 mt-0.5">
                                                {log.duration} min • {log.type}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-6 bg-[#FAF7F2] rounded-2xl border border-[#8C9E79]/5">
                                <p className="text-sm font-serif italic text-[#8C9E79]/50">Aucune activité sur cette période.</p>
                            </div>
                        )}

                        {/* Bouton Voir Tout (si plus de 3 items) */}
                        {filteredHistoryFull.length > 3 && (
                            <button
                                onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
                                className="w-full mt-4 py-2 text-[10px] font-black uppercase tracking-widest text-[#8C9E79] hover:bg-[#8C9E79]/5 rounded-xl transition-colors flex items-center justify-center gap-1 group"
                            >
                                {isHistoryExpanded ? 'Réduire la liste' : `Voir l'historique complet (+${filteredHistoryFull.length - 3})`}
                                <div className={`transition-transform duration-300 ${isHistoryExpanded ? 'rotate-180' : ''}`}>▼</div>
                            </button>
                        )}
                    </div>
                </div>

                {/* 5. SUIVI QUALITATIF (Radar & Analyse) */}
                <div className="grid grid-cols-1 gap-4">
                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/50 shadow-lg relative overflow-hidden">
                        <div className="flex justify-between items-center mb-6 relative z-10">
                            <h3 className="font-serif font-bold text-lg text-[#8C9E79] flex items-center gap-2">
                                <Activity size={18} className="text-[#C17C74]" /> Progression
                            </h3>
                            <span className="text-[10px] uppercase font-bold text-[#8C9E79]/60">Technique</span>
                        </div>

                        {/* RADAR CHART (CSS Pur) */}
                        <div className="relative w-full aspect-square max-w-[200px] mx-auto mb-8">
                            {/* Grille Radar Hexagonale */}
                            <svg viewBox="0 0 100 100" className="w-full h-full opacity-30">
                                <circle cx="50" cy="50" r="40" fill="none" stroke="#8C9E79" strokeWidth="0.5" />
                                <circle cx="50" cy="50" r="30" fill="none" stroke="#8C9E79" strokeWidth="0.5" />
                                <circle cx="50" cy="50" r="20" fill="none" stroke="#8C9E79" strokeWidth="0.5" />
                                <circle cx="50" cy="50" r="10" fill="none" stroke="#8C9E79" strokeWidth="0.5" />
                                {/* Axes */}
                                <line x1="50" y1="50" x2="50" y2="10" stroke="#8C9E79" strokeWidth="0.5" />
                                <line x1="50" y1="50" x2="90" y2="50" stroke="#8C9E79" strokeWidth="0.5" />
                                <line x1="50" y1="50" x2="50" y2="90" stroke="#8C9E79" strokeWidth="0.5" />
                                <line x1="50" y1="50" x2="10" y2="50" stroke="#8C9E79" strokeWidth="0.5" />
                                <line x1="50" y1="50" x2="22" y2="22" stroke="#8C9E79" strokeWidth="0.5" />
                                <line x1="50" y1="50" x2="78" y2="78" stroke="#8C9E79" strokeWidth="0.5" />
                                <line x1="50" y1="50" x2="78" y2="22" stroke="#8C9E79" strokeWidth="0.5" />
                                <line x1="50" y1="50" x2="22" y2="78" stroke="#8C9E79" strokeWidth="0.5" />
                            </svg>

                            {/* Forme du Radar (Mock Data) */}
                            {/* Impulsion (80%), Tracé (60%), Equilibre (70%), Connexion (50%), Mental (90%) */}
                            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full drop-shadow-md">
                                <polygon
                                    points="50,18 74,50 64,78 36,78 26,50"
                                    fill="rgba(140, 158, 121, 0.5)"
                                    stroke="#8C9E79"
                                    strokeWidth="1.5"
                                />
                                {/* Points Labels (Absolut Positioned outside SVG usually, but kept simple here) */}
                            </svg>

                            {/* Labels simples */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 text-[8px] font-bold text-[#8C9E79] bg-white/80 px-1 rounded">Impulsion</div>
                            <div className="absolute top-1/2 right-0 translate-x-3 -translate-y-1/2 text-[8px] font-bold text-[#8C9E79] bg-white/80 px-1 rounded">Tracé</div>
                            <div className="absolute bottom-4 right-2 text-[8px] font-bold text-[#8C9E79] bg-white/80 px-1 rounded">Equilibre</div>
                            <div className="absolute bottom-4 left-2 text-[8px] font-bold text-[#8C9E79] bg-white/80 px-1 rounded">Connexion</div>
                            <div className="absolute top-1/2 left-0 -translate-x-3 -translate-y-1/2 text-[8px] font-bold text-[#8C9E79] bg-white/80 px-1 rounded">Mental</div>
                        </div>

                        {/* ANALYSE DU COACH (IA) */}
                        <div className="bg-[#FAF7F2] rounded-2xl p-4 border border-[#8C9E79]/10">
                            <h4 className="font-bold text-[#8C9E79] text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
                                <Zap size={12} fill="currentColor" /> Analyse du Coach
                            </h4>

                            <div className="space-y-3">
                                {/* Point Fort */}
                                <div className="flex gap-3 items-start">
                                    <div className="w-1 h-8 bg-green-400 rounded-full shrink-0 mt-1"></div>
                                    <div>
                                        <p className="text-xs font-bold text-[#5C5C5C]">Acquis: Transitions</p>
                                        <p className="text-[10px] text-[#8C9E79] leading-relaxed">
                                            L'impulsion est constante. Excellent travail.
                                        </p>
                                    </div>
                                </div>
                                {/* Point Faible */}
                                <div className="flex gap-3 items-start">
                                    <div className="w-1 h-8 bg-orange-400 rounded-full shrink-0 mt-1"></div>
                                    <div>
                                        <p className="text-xs font-bold text-[#5C5C5C]">À travailler : Incurvation</p>
                                        <p className="text-[10px] text-[#8C9E79] leading-relaxed">
                                            Blocage détecté à main droite sur les cercles.
                                        </p>
                                        {/* Auto-Recommandation */}
                                        <button className="mt-2 text-[9px] font-bold text-white bg-[#8C9E79] px-3 py-1 rounded-full shadow-sm hover:bg-[#7A9170] transition-colors flex items-center gap-1">
                                            ➜ Voir la séance corrective
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>





            </div>
        </div >
    );
}

// Sub-components
function StatCard({ icon, value, label, highlight = false }) {
    return (
        <div className={`rounded-2xl p-3 flex flex-col items-center justify-center gap-1 shadow-md border 
            ${highlight ? 'bg-[#8C9E79] text-[#E8DCCA] border-[#8C9E79]' : 'bg-white text-[#8C9E79] border-white/50'}`}>
            <div className={`opacity-80 mb-1 ${highlight ? 'text-[#E8DCCA]' : 'text-[#A4CFA4]'}`}>
                {icon}
            </div>
            <span className="font-black text-xl leading-none">{value}</span>
            <span className="text-[8px] uppercase tracking-wider font-bold opacity-60">{label}</span>
        </div>
    );
}

function Badge({ text }) {
    return (
        <span className="px-2 py-0.5 rounded-md bg-white/10 border border-white/10 text-[10px] font-bold text-white/80">
            {text}
        </span>
    );
}
