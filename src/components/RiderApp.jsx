import React, { useState, useEffect } from 'react';
import { Home, BookOpen, User, Home as HomeIcon, BookOpen as BookIcon, User as UserIcon, PlayCircle } from 'lucide-react';
import RiderHome from './RiderHome';
import RiderCatalog from './RiderCatalog';
import RiderPlayer from './RiderPlayer';
import UserProfileForm from './UserProfileForm';

export default function RiderApp({ onExit }) {
    const [activeTab, setActiveTab] = useState('home');
    const [playingSeance, setPlayingSeance] = useState(null);

    // Initialisation robuste du profil
    const [profile, setProfile] = useState(() => {
        const defaultProfile = {
            userName: '',
            horseName: '',
            galopLevel: 'G4-5',
            primaryObjectives: [],
            disciplines: []
        };
        try {
            const saved = localStorage.getItem('equicoach_profile');
            if (saved && saved !== 'undefined') {
                const parsed = JSON.parse(saved);
                return { ...defaultProfile, ...parsed };
            }
        } catch (e) {
            console.error('Erreur profil:', e);
        }
        return defaultProfile;
    });

    // Onboarding : Vers le profil si le prénom est vide
    useEffect(() => {
        if (!profile?.userName || profile.userName.trim() === '') {
            setActiveTab('profile');
        }
    }, []); // One-time check on mount

    const handleSaveProfile = (newProfile) => {
        setProfile(newProfile);
        localStorage.setItem('equicoach_profile', JSON.stringify(newProfile));
        setTimeout(() => setActiveTab('home'), 1500);
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'home':
                return <RiderHome
                    profile={profile}
                    onExplore={() => setActiveTab('catalog')}
                    onPlay={(s) => setPlayingSeance(s)}
                />;
            case 'catalog':
                return <RiderCatalog onPlay={(s) => setPlayingSeance(s)} />;
            case 'profile':
                return <UserProfileForm profile={profile} onSave={handleSaveProfile} />;
            default:
                return <RiderHome profile={profile} />;
        }
    };

    return (
        <div className="flex flex-col h-screen max-w-md mx-auto bg-equi-cream shadow-2xl relative overflow-hidden font-sans border-x border-equi-border transition-all duration-500">

            {/* Texture de papier subtile */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-multiply z-50 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]"></div>

            {/* Header Premium */}
            <header className="px-6 py-6 flex justify-between items-center bg-equi-olive z-[60] shadow-xl border-b border-white/5">
                <div className="flex flex-col gap-0.5">
                    <h1 className="text-2xl font-serif text-equi-paper italic font-black tracking-tight">EquiCoach</h1>
                    <span className="text-[8px] uppercase tracking-[0.5em] font-extrabold text-equi-gold opacity-80">Studio de Excellence</span>
                </div>
                <button
                    onClick={onExit}
                    className="text-[9px] bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-full font-black uppercase tracking-widest border border-white/10 transition-all active:scale-95"
                >
                    Fermer
                </button>
            </header>

            {/* Content Area */}
            <main className="flex-1 overflow-y-auto pb-28 relative z-10 scroll-smooth">
                {renderContent()}
            </main>

            {/* Navigation Tab Bar Glassmorphism */}
            <nav className="fixed bottom-6 left-6 right-6 max-w-[calc(448px-3rem)] mx-auto bg-white/70 backdrop-blur-2xl border border-white/40 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex justify-around items-center py-4 px-2 z-[60]">
                <NavButton
                    active={activeTab === 'home'}
                    onClick={() => setActiveTab('home')}
                    icon={<HomeIcon size={20} />}
                    label="Studio"
                />
                <NavButton
                    active={activeTab === 'catalog'}
                    onClick={() => setActiveTab('catalog')}
                    icon={<BookIcon size={20} />}
                    label="Bibliothèque"
                />
                <NavButton
                    active={activeTab === 'profile'}
                    onClick={() => setActiveTab('profile')}
                    icon={<UserIcon size={20} />}
                    label="Profil"
                />
            </nav>

            {/* Player Overlay */}
            {playingSeance && (
                <RiderPlayer
                    seance={playingSeance}
                    onClose={() => setPlayingSeance(null)}
                />
            )}
        </div>
    );
}

function NavButton({ active, onClick, icon, label }) {
    return (
        <button
            onClick={onClick}
            className={`flex flex-col items-center gap-1.5 transition-all duration-300 relative group`}
        >
            <div className={`p-2.5 rounded-2xl transition-all duration-300 ${active ? 'bg-equi-olive text-equi-paper shadow-lg scale-110' : 'text-equi-clay opacity-40 group-hover:opacity-100 group-hover:bg-equi-olive/5'}`}>
                {icon}
            </div>
            <span className={`text-[8px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${active ? 'text-equi-olive' : 'text-equi-clay opacity-0'}`}>{label}</span>
            {active && (
                <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-equi-gold animate-pulse"></div>
            )}
        </button>
    );
}
