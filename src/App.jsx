import React, { useState, useEffect } from 'react';
import { Filter, BookOpen, Target, Wrench, Play, FileText, Save, Eye, Smartphone } from 'lucide-react';
import SeancesData from './data/seances';
import SessionPlayer from './components/SessionPlayer';
import PromptGenerator from './components/PromptGenerator';
import ScriptEditor from './components/ScriptEditor';
import ScriptViewer from './components/ScriptViewer';
import RiderApp from './components/RiderApp';
import { scriptSeance1 } from './data/seance_scripts';

export default function CatalogueSeances() {
  // Version 2026-01-17 with Multi-Horse Support active
  // Version 2026-01-17 with Phone Layout Fix & Classic Sage Green & Premium Header & Fixed Padding & Duration Fix & Card Layout V2 & Editorial Disciplines & Hero Text Update & All Images Fixed & Explicit Subcategories & Strict Mapping & Subcat Rename & Programs Integration & Demo Labels & Wallpaper Fixed & Player Refreshed & Fixed & Import Fixed & Prop Fixed & UI Polished & Details Panel & Obstacle Plan & Logbook & Fix & Info Label & Button Moved & Optimized & Timer Fixed & Work Dist & Fix & Form Polish & Dyn Profile & Reordered & Filter Button & Feedback & Radar & History Filters & Fix White Screen & Remove Weekly & Fix Horse Selector Final Opacity & Remove Streak & Photo Support Fix & Photos Injected & Layout Adjusted
  const [isRiderMode, setIsRiderMode] = useState(false);
  const [ongletActif, setOngletActif] = useState('technique');
  const [selectedSeance, setSelectedSeance] = useState(null);
  const [promptSeance, setPromptSeance] = useState(null);
  const [editScriptSeance, setEditScriptSeance] = useState(null);
  const [viewScriptSeance, setViewScriptSeance] = useState(null);
  const [savedScripts, setSavedScripts] = useState({});
  const [filtres, setFiltres] = useState({
    discipline: 'Toutes',
    niveau: 'Tous',
    duree: 'Toutes'
  });

  useEffect(() => {
    const stored = localStorage.getItem('equicoach_scripts');
    if (stored) {
      try {
        setSavedScripts(JSON.parse(stored));
      } catch (e) {
        console.error('Error loading scripts:', e);
      }
    }
  }, []);

  const handleSaveScript = (seanceId, script) => {
    const updated = { ...savedScripts, [seanceId]: script };
    setSavedScripts(updated);
    localStorage.setItem('equicoach_scripts', JSON.stringify(updated));
  };

  const scripts = { 1: scriptSeance1 };

  const stats = {
    total: SeancesData.length,
    technique: SeancesData.filter(s => s.type === 'Technique classique').length,
    thematique: SeancesData.filter(s => s.type === 'Thématique spécifique').length,
    probleme: SeancesData.filter(s => s.type === 'Résolution de problème').length,
  };

  const onglets = [
    { id: 'technique', label: 'Technique classique', icon: BookOpen, count: stats.technique, color: 'blue' },
    { id: 'thematique', label: 'Thématique spécifique', icon: Target, count: stats.thematique, color: 'amber' },
    { id: 'probleme', label: 'Résolution de problème', icon: Wrench, count: stats.probleme, color: 'red' },
  ];

  if (isRiderMode) {
    return <RiderApp onExit={() => setIsRiderMode(false)} />;
  }

  // Filtrer les séances
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col items-center">
          <div className="flex justify-between w-full items-center mb-6">
            <div className="w-10"></div>
            <h1 className="text-4xl font-bold text-amber-900">🐴 EquiCoach Tool</h1>
            <button
              onClick={() => setIsRiderMode(true)}
              className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl font-bold transition shadow-lg transform hover:scale-105"
            >
              <Smartphone size={20} />
              Voir Mode App
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="text-center">
            <div className="text-5xl font-bold text-amber-600 mb-2">{stats.total}</div>
            <div className="text-gray-600">Séances totales</div>
          </div>
        </div>

        {/* Onglets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {onglets.map(onglet => {
            const Icon = onglet.icon;
            const isActive = ongletActif === onglet.id;
            return (
              <button
                key={onglet.id}
                onClick={() => setOngletActif(onglet.id)}
                className={`p-6 rounded-lg shadow-lg transition-all ${isActive ? 'bg-amber-600 text-white scale-105' : 'bg-white'}`}
              >
                <div className="flex items-center justify-center gap-3 mb-2">
                  <Icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-amber-500'}`} />
                  <span className={`font-semibold ${isActive ? 'text-white' : 'text-gray-800'}`}>{onglet.label}</span>
                </div>
                <div className={`text-3xl font-bold ${isActive ? 'text-white' : 'text-amber-600'}`}>{onglet.count}</div>
              </button>
            );
          })}
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="text-amber-600" size={20} />
            <h2 className="font-bold text-gray-800">Filtres</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Filtre Discipline */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Discipline</label>
              <select
                value={filtres.discipline}
                onChange={(e) => setFiltres({ ...filtres, discipline: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition"
              >
                <option value="Toutes">Toutes</option>
                {[...new Set(SeancesData.map(s => s.discipline))].map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Filtre Niveau */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Niveau</label>
              <select
                value={filtres.niveau}
                onChange={(e) => setFiltres({ ...filtres, niveau: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition"
              >
                <option value="Tous">Tous</option>
                {[...new Set(SeancesData.map(s => s.niveau))].map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>

            {/* Filtre Durée */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Durée</label>
              <select
                value={filtres.duree}
                onChange={(e) => setFiltres({ ...filtres, duree: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition"
              >
                <option value="Toutes">Toutes</option>
                {[...new Set(SeancesData.map(s => s.duree))].sort((a, b) => parseInt(a) - parseInt(b)).map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Liste */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {seancesFiltrees.map(seance => (
            <div key={seance.id} className="bg-white rounded-lg shadow p-4">
              <h3 className="font-bold text-gray-900 mb-2">{seance.nom}</h3>
              <p className="text-xs text-gray-500 italic mb-3">{seance.objectif}</p>

              {/* Badges Niveau et Durée */}
              <div className="flex gap-2 mb-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                  {seance.niveau}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                  {seance.duree} min
                </span>
              </div>

              <button
                onClick={() => setIsRiderMode(true)}
                className="w-full flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-lg font-semibold transition text-sm"
              >
                <Play size={16} /> Tester dans l'App
              </button>
            </div>
          ))}
        </div>
      </div>

      {selectedSeance && (
        <SessionPlayer
          session={selectedSeance}
          script={scripts[selectedSeance.id]}
          onClose={() => setSelectedSeance(null)}
        />
      )}
    </div>
  );
}