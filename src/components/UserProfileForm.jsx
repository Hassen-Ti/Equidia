import React, { useState } from 'react';
import { User, Award, Target, Save, CheckCircle2 } from 'lucide-react';

export default function UserProfileForm({ profile, onSave }) {
    const [formData, setFormData] = useState(profile || {
        userName: '',
        horseName: '',
        galopLevel: 'G4-5',
        primaryObjectives: [],
        disciplines: []
    });

    const [isSaved, setIsSaved] = useState(false);

    const levels = ['G1-2', 'G3-4', 'G4-5', 'G5-6', 'G6-7', 'G7+'];
    const objectives = ['Compétition', 'Loisir', 'Remise en forme', 'Travail de fond', 'Confiance'];
    const disciplines = ['Dressage', 'Obstacle', 'TAP', 'Balade'];

    const handleToggle = (list, item, field) => {
        const newList = list.includes(item)
            ? list.filter(i => i !== item)
            : [...list, item];
        setFormData({ ...formData, [field]: newList });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
    };

    return (
        <div className="p-8 pb-32 flex flex-col gap-10 animate-in fade-in duration-700">

            {/* Header Editorial */}
            <div className="text-center relative py-6">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-[#E8C07D]"></div>
                <h2 className="text-4xl font-serif italic text-[#4A5D4A] font-black tracking-tighter mb-2">Votre Studio</h2>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#8C867E]">Personnalisation du Coaching</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-10">

                {/* Section Cavalier */}
                <div className="bg-white/60 backdrop-blur-xl rounded-[3rem] p-8 border border-white shadow-xl relative overflow-hidden">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-[#4A5D4A] flex items-center justify-center text-white shadow-lg">
                            <User size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-[#4A5D4A] text-lg">Le Cavalier</h3>
                            <p className="text-[10px] uppercase font-black tracking-widest text-[#8C867E]">Identité & Niveau</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-6">
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-[#4A5D4A] mb-3 block opacity-60">Prénom du Cavalier</label>
                            <input
                                type="text"
                                value={formData.userName}
                                onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                                placeholder="Ex: Jean-Baptiste"
                                className="w-full bg-[#FAF7F2] border-2 border-[#E5E1DA] rounded-2xl py-4 px-6 focus:ring-4 focus:ring-[#7A8D76]/5 focus:border-[#4A5D4A] outline-none transition-all text-sm font-medium"
                            />
                        </div>

                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-[#4A5D4A] mb-4 block opacity-60">Niveau (Galop)</label>
                            <div className="grid grid-cols-3 gap-3">
                                {levels.map(level => (
                                    <button
                                        key={level}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, galopLevel: level })}
                                        className={`py-3 rounded-xl border-2 text-[11px] font-black transition-all ${formData.galopLevel === level
                                            ? 'bg-[#4A5D4A] border-[#4A5D4A] text-white shadow-lg scale-105'
                                            : 'bg-white border-[#E5E1DA] text-[#8C867E] hover:border-[#4A5D4A]/30'
                                            }`}
                                    >
                                        {level}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section Cheval */}
                <div className="bg-white/60 backdrop-blur-xl rounded-[3rem] p-8 border border-white shadow-xl relative overflow-hidden">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-[#E8C07D] flex items-center justify-center text-[#4A5D4A] shadow-lg">
                            <Award size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-[#4A5D4A] text-lg">Le Cheval</h3>
                            <p className="text-[10px] uppercase font-black tracking-widest text-[#8C867E]">Votre partenaire</p>
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-[#4A5D4A] mb-3 block opacity-60">Nom du Cheval</label>
                        <input
                            type="text"
                            value={formData.horseName}
                            onChange={(e) => setFormData({ ...formData, horseName: e.target.value })}
                            placeholder="Ex: Jumper"
                            className="w-full bg-[#FAF7F2] border-2 border-[#E5E1DA] rounded-2xl py-4 px-6 focus:ring-4 focus:ring-[#7A8D76]/5 focus:border-[#4A5D4A] outline-none transition-all text-sm font-medium"
                        />
                    </div>
                </div>

                {/* Section Objectifs */}
                <div className="bg-white/60 backdrop-blur-xl rounded-[3rem] p-8 border border-white shadow-xl relative overflow-hidden">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-[#7A8D76]/20 flex items-center justify-center text-[#4A5D4A] shadow-sm">
                            <Target size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-[#4A5D4A] text-lg">Vos Objectifs</h3>
                            <p className="text-[10px] uppercase font-black tracking-widest text-[#8C867E]">Curation personnalisée</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {objectives.map(obj => (
                            <button
                                key={obj}
                                type="button"
                                onClick={() => handleToggle(formData.primaryObjectives, obj, 'primaryObjectives')}
                                className={`px-4 py-2 rounded-full border-2 text-[9px] font-black uppercase tracking-widest transition-all ${formData.primaryObjectives.includes(obj)
                                    ? 'bg-[#E8C07D] border-[#E8C07D] text-[#4A5D4A] shadow-md'
                                    : 'bg-white/40 border-[#E5E1DA] text-[#8C867E] hover:border-[#4A5D4A]/20'
                                    }`}
                            >
                                {obj}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Bouton Sauvegarder */}
                <button
                    type="submit"
                    className={`fixed bottom-24 left-8 right-8 py-5 rounded-[2rem] font-black uppercase tracking-[0.3em] text-[11px] shadow-2xl transition-all flex items-center justify-center gap-3 z-[100] ${isSaved
                        ? 'bg-green-500 text-white scale-95'
                        : 'bg-[#4A5D4A] text-white hover:bg-[#3A4D3A] active:scale-95'
                        }`}
                >
                    {isSaved ? <CheckCircle2 size={18} /> : <Save size={18} />}
                    {isSaved ? 'Profil Enregistré' : 'Enregistrer mon Profil'}
                </button>

            </form>
        </div>
    );
}
