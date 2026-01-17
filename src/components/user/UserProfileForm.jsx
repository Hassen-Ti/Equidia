import React, { useState } from 'react';
import { User, Award, Target, Save, CheckCircle2, Trophy, Settings, MapPin, Plus, X } from 'lucide-react';

export default function UserProfileForm({ profile, onSave, onReset }) {
    const [formData, setFormData] = useState({
        ...profile,
        horses: profile.horses || (profile.horseName ? [{
            id: Date.now(),
            name: profile.horseName,
            age: profile.horseAge || '',
            color: profile.horseColor || 'Bai',
            temperament: profile.horseTemperament || 'Calme',
            issues: profile.horseIssues || []
        }] : [])
    });

    const [editingHorseId, setEditingHorseId] = useState(null);
    const [tempHorse, setTempHorse] = useState(null); // Horse being edited/added

    const [isSaved, setIsSaved] = useState(false);

    // États pour les ajouts personnalisés
    const [newObjective, setNewObjective] = useState('');
    const [newFacility, setNewFacility] = useState('');
    const [isAddingObjective, setIsAddingObjective] = useState(false);
    const [isAddingFacility, setIsAddingFacility] = useState(false);

    const levels = ['G1-2', 'G3-4', 'G4-5', 'G5-6', 'G6-7', 'G7+'];
    // Listes de base (qui seront étendues par l'utilisateur)
    const [availableObjectives, setAvailableObjectives] = useState([
        'Compétition', 'Loisir', 'Remise en forme', 'Travail de fond', 'Confiance', 'Jeune Cheval'
    ]);
    const [availableFacilities, setAvailableFacilities] = useState([
        'Carrière', 'Manège', 'Rond de longe', 'Obstacles', 'Lettres'
    ]);

    const temperaments = [
        { id: 'Calme', label: 'Calme', bg: 'bg-[#8C9E79]', text: 'text-white' },
        { id: 'Énergique', label: 'Énergique', bg: 'bg-[#E8DCCA]', text: 'text-[#8C9E79]' },
        { id: 'Mou', label: 'Mou', bg: 'bg-white/50', text: 'text-[#8C9E79]' },
        { id: 'Chaud', label: 'Chaud', bg: 'bg-[#8C9E79]', text: 'text-white' },
        { id: 'Sensible', label: 'Sensible', bg: 'bg-[#B5C1B5]', text: 'text-[#8C9E79]' },
    ];

    const issues = ['Raideur', 'Manque d\'impulsion', 'Précipite', 'Tire sur la main', 'Déséquilibre', 'Stress'];

    const handleToggle = (list, item, field) => {
        const currentList = list || [];
        const newList = currentList.includes(item)
            ? currentList.filter(i => i !== item)
            : [...currentList, item];
        setFormData({ ...formData, [field]: newList });
    };

    const handleAddItem = (e, type) => {
        e.preventDefault();
        if (type === 'objective' && newObjective.trim()) {
            setAvailableObjectives([...availableObjectives, newObjective.trim()]);
            handleToggle(formData.primaryObjectives, newObjective.trim(), 'primaryObjectives');
            setNewObjective('');
            setIsAddingObjective(false);
        } else if (type === 'facility' && newFacility.trim()) {
            setAvailableFacilities([...availableFacilities, newFacility.trim()]);
            handleToggle(formData.facilities, newFacility.trim(), 'facilities');
            setNewFacility('');
            setIsAddingFacility(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
    };

    const handleSaveHorse = () => {
        if (!tempHorse.name) return;

        let updatedHorses;
        if (editingHorseId === 'new') {
            updatedHorses = [...formData.horses, { ...tempHorse, id: Date.now() }];
        } else {
            updatedHorses = formData.horses.map(h => h.id === editingHorseId ? tempHorse : h);
        }

        setFormData({ ...formData, horses: updatedHorses });
        setEditingHorseId(null);
        setTempHorse(null);
    };

    const handleDeleteHorse = (id) => {
        setFormData({ ...formData, horses: formData.horses.filter(h => h.id !== id) });
    };

    const startEditHorse = (horse) => {
        setEditingHorseId(horse ? horse.id : 'new');
        setTempHorse(horse ? { ...horse } : {
            name: '', age: '', color: 'Bai', temperament: 'Calme', issues: []
        });
    };

    const getInitials = (name) => name ? name.substring(0, 2).toUpperCase() : 'EC';

    return (
        <div className="min-h-screen font-sans pb-32 relative overflow-hidden">

            {/* BACKGROUND ARTISTIC - "Nature Punchy" (Gradient Mesh) */}
            {/* BACKGROUND - PAPIER PEINT "TOILE DE JOUY" */}
            <div className="absolute inset-0 z-0 overflow-hidden bg-[#FAF7F2]">
                {/* Image Illustration répétée ou cover */}
                <div
                    className="absolute inset-0 opacity-25 mix-blend-multiply"
                    style={{
                        backgroundImage: `url('${import.meta.env.BASE_URL}bg-pattern.png')`,
                        backgroundSize: '250px', // Taille ajustée pour voir le motif
                        backgroundRepeat: 'repeat'
                    }}
                ></div>

                {/* Overlay Cream/Warm pour adoucir le contraste */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#FDFBF7]/20 via-[#FDFBF7]/60 to-[#FDFBF7]/90 backdrop-blur-[0px]"></div>
            </div>

            {/* Formulaire contenu */}
            <form onSubmit={handleSubmit} className="relative z-10 px-6 pt-12 flex flex-col gap-6 animate-in fade-in duration-700">

                {/* Header Section */}
                <div className="flex flex-col items-center justify-center text-center mt-4 mb-6">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#8C9E79] to-[#556B51] p-[3px] shadow-lg mb-4">
                        <div className="w-full h-full rounded-full bg-[#FAF7F2] flex items-center justify-center border-4 border-white overflow-hidden">
                            {/* Optionnel : mettre une vraie photo ici si dispo */}
                            <span className="font-serif font-bold text-3xl text-[#8C9E79] italic">
                                {getInitials(formData.userName)}
                            </span>
                        </div>
                    </div>
                    <input
                        type="text"
                        value={formData.userName}
                        onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                        placeholder="Votre Prénom"
                        className="text-3xl font-serif font-bold text-[#8C9E79] bg-transparent text-center outline-none placeholder:text-[#8C9E79]/30 w-full drop-shadow-sm"
                    />
                    <div className="mt-2 inline-block px-4 py-1 rounded-full bg-[#8C9E79] text-[#E8DCCA] text-[10px] font-bold uppercase tracking-widest shadow-sm">
                        {formData.galopLevel}
                    </div>
                </div>

                {/* Rider Profile Card - Premium Glass */}
                <div className="bg-white/60 backdrop-blur-md rounded-[2rem] p-6 shadow-xl border border-white/40 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-5">
                        <User size={64} className="text-[#8C9E79]" />
                    </div>

                    <h3 className="text-xl font-serif font-bold text-[#8C9E79] mb-4">Profil Cavalier</h3>

                    <div className="space-y-4">
                        <div>
                            <label className="text-[10px] uppercase font-bold text-[#8C9E79]/60 tracking-wider">Niveau</label>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {levels.map(level => (
                                    <button
                                        key={level}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, galopLevel: level })}
                                        className={`px-3 py-1.5 rounded-full text-xs font-bold border border-[#8C9E79]/10 transition-all ${formData.galopLevel === level
                                            ? 'bg-[#8C9E79] text-[#E8DCCA] shadow-md'
                                            : 'bg-white/50 text-[#5C5C5C] hover:bg-white'
                                            }`}
                                    >
                                        {level}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Multi-Horse Management Section */}
                <div className="bg-white/60 backdrop-blur-md rounded-[2rem] p-6 shadow-xl border border-white/40 relative overflow-hidden group">
                    <h3 className="text-xl font-serif font-bold text-[#8C9E79] mb-4 flex items-center justify-between">
                        <span>L'Écurie ({formData.horses?.length || 0})</span>
                        {!editingHorseId && (
                            <button
                                type="button"
                                onClick={() => startEditHorse(null)}
                                className="bg-[#8C9E79] text-white p-2 rounded-full hover:bg-[#7A9170] transition-colors"
                            >
                                <Plus size={16} />
                            </button>
                        )}
                    </h3>

                    {editingHorseId ? (
                        /* EDIT MODE FOR HORSE */
                        <div className="bg-white/60 p-4 rounded-xl animate-in fade-in zoom-in duration-300">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-sm font-bold text-[#8C9E79] uppercase">{editingHorseId === 'new' ? 'Nouveau Cheval' : 'Modifier Cheval'}</h4>
                                <button type="button" onClick={() => setEditingHorseId(null)}><X size={16} className="text-gray-400" /></button>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] uppercase font-bold text-[#8C9E79]/60 tracking-wider">Nom</label>
                                        <input
                                            type="text"
                                            value={tempHorse.name}
                                            onChange={(e) => setTempHorse({ ...tempHorse, name: e.target.value })}
                                            className="w-full bg-white/40 border-b border-[#8C9E79]/20 rounded-t-lg px-3 py-2 text-[#8C9E79] font-bold focus:bg-white/60 outline-none transition-colors"
                                            placeholder="Nom"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase font-bold text-[#8C9E79]/60 tracking-wider">Âge</label>
                                        <input
                                            type="number"
                                            value={tempHorse.age}
                                            onChange={(e) => setTempHorse({ ...tempHorse, age: e.target.value })}
                                            className="w-full bg-white/40 border-b border-[#8C9E79]/20 rounded-t-lg px-3 py-2 text-[#8C9E79] font-bold focus:bg-white/60 outline-none transition-colors"
                                            placeholder="Ans"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] uppercase font-bold text-[#8C9E79]/60 tracking-wider mb-2 block">Tempérament</label>
                                    <div className="flex flex-wrap gap-2">
                                        {temperaments.map(t => (
                                            <button
                                                key={t.id}
                                                type="button"
                                                onClick={() => setTempHorse({ ...tempHorse, temperament: t.id })}
                                                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm ${tempHorse.temperament === t.id
                                                    ? `${t.bg} ${t.text} scale-105 ring-2 ring-white/50`
                                                    : 'bg-white/30 text-[#8C9E79] hover:bg-white/50'
                                                    }`}
                                            >
                                                {t.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleSaveHorse}
                                    className="w-full py-2 bg-[#8C9E79] text-white rounded-lg font-bold shadow-md hover:bg-[#7A9170] transition-colors"
                                >
                                    {editingHorseId === 'new' ? 'Ajouter ce cheval' : 'Mettre à jour'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* LIST MODE */
                        <div className="space-y-3">
                            {formData.horses && formData.horses.length > 0 ? (
                                formData.horses.map(horse => (
                                    <div key={horse.id} className="flex items-center justify-between bg-white/50 p-4 rounded-xl border border-white/40 shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-[#8C9E79] text-white flex items-center justify-center font-serif italic text-lg shadow-inner">
                                                {horse.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-bold text-[#8C9E79]">{horse.name}</div>
                                                <div className="text-[10px] text-gray-500 font-bold uppercase">{horse.age} ans • {horse.temperament}</div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button type="button" onClick={() => startEditHorse(horse)} className="p-2 text-[#8C9E79] hover:bg-white rounded-full">
                                                <Settings size={14} />
                                            </button>
                                            <button type="button" onClick={() => handleDeleteHorse(horse.id)} className="p-2 text-red-400 hover:bg-white rounded-full">
                                                <X size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-6 opacity-50 text-[#8C9E79] text-sm italic">
                                    Aucun cheval enregistré. Ajoutez votre partenaire !
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Objectives & Facilities - Expandable */}
                <div className="bg-white/90 backdrop-blur-md rounded-[2rem] p-6 shadow-lg border border-[#E5E1DA]">
                    <h3 className="text-xl font-serif font-bold text-[#8C9E79] mb-4">Objectifs & Lieux</h3>

                    <div className="space-y-6">
                        {/* Objectifs Section */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <Target size={16} className="text-[#A4CFA4]" />
                                    <label className="text-xs font-bold text-[#8C867E] uppercase tracking-wider">Mes Objectifs</label>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {availableObjectives.map(obj => (
                                    <button
                                        key={obj}
                                        type="button"
                                        onClick={() => handleToggle(formData.primaryObjectives, obj, 'primaryObjectives')}
                                        className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${formData.primaryObjectives.includes(obj)
                                            ? 'bg-[#8C9E79] text-white shadow-md'
                                            : 'bg-[#F5F5F0] text-[#8C867E] hover:bg-[#EAEAE0]'
                                            }`}
                                    >
                                        {obj}
                                    </button>
                                ))}
                                {/* Bouton "Autre" */}
                                {isAddingObjective ? (
                                    <form onSubmit={(e) => handleAddItem(e, 'objective')} className="flex items-center">
                                        <input
                                            autoFocus
                                            type="text"
                                            value={newObjective}
                                            onChange={(e) => setNewObjective(e.target.value)}
                                            className="bg-[#F5F5F0] border border-[#8C9E79] rounded-l-xl px-3 py-2 text-xs outline-none w-24"
                                            placeholder="..."
                                        />
                                        <button type="submit" className="bg-[#8C9E79] text-white rounded-r-xl px-2 py-2 hover:bg-[#6A7D66]">
                                            <Plus size={14} />
                                        </button>
                                        <button type="button" onClick={() => setIsAddingObjective(false)} className="ml-1 text-red-400">
                                            <X size={14} />
                                        </button>
                                    </form>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => setIsAddingObjective(true)}
                                        className="px-3 py-2 rounded-xl text-xs font-bold border border-dashed border-[#8C867E]/50 text-[#8C867E] hover:bg-[#F5F5F0] hover:text-[#8C9E79] transition-all flex items-center gap-1"
                                    >
                                        <Plus size={12} /> Autre
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="h-px bg-[#E5E1DA] w-full"></div>

                        {/* Facilities Section */}
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <MapPin size={16} className="text-[#A4CFA4]" />
                                <label className="text-xs font-bold text-[#8C867E] uppercase tracking-wider">Installations</label>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {availableFacilities.map(fac => (
                                    <button
                                        key={fac}
                                        type="button"
                                        onClick={() => handleToggle(formData.facilities, fac, 'facilities')}
                                        className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${(formData.facilities || []).includes(fac)
                                            ? 'bg-[#8C9E79] text-white shadow-md'
                                            : 'bg-[#F5F5F0] text-[#8C867E] hover:bg-[#EAEAE0]'
                                            }`}
                                    >
                                        {fac}
                                    </button>
                                ))}
                                {/* Bouton "Autre" Facility */}
                                {isAddingFacility ? (
                                    <form onSubmit={(e) => handleAddItem(e, 'facility')} className="flex items-center">
                                        <input
                                            autoFocus
                                            type="text"
                                            value={newFacility}
                                            onChange={(e) => setNewFacility(e.target.value)}
                                            className="bg-[#F5F5F0] border border-[#8C9E79] rounded-l-xl px-3 py-2 text-xs outline-none w-24"
                                            placeholder="..."
                                        />
                                        <button type="submit" className="bg-[#8C9E79] text-white rounded-r-xl px-2 py-2 hover:bg-black">
                                            <Plus size={14} />
                                        </button>
                                        <button type="button" onClick={() => setIsAddingFacility(false)} className="ml-1 text-red-400">
                                            <X size={14} />
                                        </button>
                                    </form>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => setIsAddingFacility(true)}
                                        className="px-3 py-2 rounded-xl text-xs font-bold border border-dashed border-[#8C867E]/50 text-[#8C867E] hover:bg-[#F5F5F0] hover:text-[#8C9E79] transition-all flex items-center gap-1"
                                    >
                                        <Plus size={12} /> Autre
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons Container */}
                <div className="flex flex-col items-center gap-6 mt-4 mb-20">

                    {/* Save Button - Static & Smaller */}
                    <button
                        type="submit"
                        className={`w-full py-3 rounded-xl font-serif font-bold text-base shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2 border border-white/20 ${isSaved
                            ? 'bg-[#8C9E79] text-white'
                            : 'bg-[#8C9E79] text-[#E8DCCA] hover:bg-[#7A9170]'
                            }`}
                    >
                        {isSaved ? <CheckCircle2 size={18} /> : <Save size={18} />}
                        {isSaved ? 'Enregistré !' : 'Enregistrer le profil'}
                    </button>

                    {/* Reset Button */}
                    <button type="button" onClick={onReset} className="text-[#8C9E79]/60 text-xs font-bold uppercase tracking-widest hover:text-[#8C9E79] flex items-center gap-2 transition-colors">
                        <Settings size={14} /> Réinitialiser
                    </button>
                </div>

            </form>
        </div>
    );
}
