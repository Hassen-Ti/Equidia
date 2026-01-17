import React, { useState, useEffect } from 'react';
import { Home, Book, User, Play, Menu, X, Bell } from 'lucide-react';
import RiderHome from './RiderHome';
import RiderPrograms from './RiderPrograms';
import RiderPlayer from './RiderPlayer';
import UserProfileDisplay from '../user/UserProfileDisplay';
import UserProfileForm from '../user/UserProfileForm';

export default function RiderApp({ onExit }) {
    const [activeTab, setActiveTab] = useState('home');
    const [currentSession, setCurrentSession] = useState(null);
    const [isEditingProfile, setIsEditingProfile] = useState(false);

    // Initial Profile State (simulated backend)
    const [profile, setProfile] = useState(() => {
        const saved = localStorage.getItem('equicoach_profile');
        return saved ? JSON.parse(saved) : {
            userName: 'Sophie',
            galopLevel: 'G4-5',
            horses: [
                { id: 1, name: 'Spirit', age: '8', color: 'Bai', temperament: 'Calme' }
            ],
            stats: { sessionsCompleted: 14, totalMinutes: 420 },
            primaryObjectives: ['Dressage', 'Confiance']
        };
    });

    const [activeHorseId, setActiveHorseId] = useState(() => {
        return profile.horses && profile.horses.length > 0 ? profile.horses[0].id : null;
    });

    // Save profile on change
    useEffect(() => {
        localStorage.setItem('equicoach_profile', JSON.stringify(profile));
    }, [profile]);

    // Update active horse if horses change and current active is invalid
    useEffect(() => {
        if (profile.horses && profile.horses.length > 0) {
            if (!activeHorseId || !profile.horses.find(h => h.id === activeHorseId)) {
                setActiveHorseId(profile.horses[0].id);
            }
        }
    }, [profile.horses, activeHorseId]);

    const activeHorse = profile.horses?.find(h => h.id === activeHorseId) ||
        (profile.horses?.length > 0 ? profile.horses[0] : { name: 'Mon Cheval' });

    const handlePlaySession = (session) => {
        setCurrentSession(session);
    };

    const handleSaveProfile = (newProfile) => {
        setProfile(newProfile);
        // Ensure active horse remains valid
        setIsEditingProfile(false);
    };

    if (currentSession) {
        return <RiderPlayer session={currentSession} onClose={() => setCurrentSession(null)} />;
    }

    return (
        /* Mobile: Full Screen | Desktop: Centered Android Mockup */
        <div className="fixed inset-0 bg-[#F6F5F2] sm:bg-[#EEF0F2] sm:flex sm:justify-center sm:items-center sm:py-8 z-50">
            {/* Mobile: Full Size, No Border | Desktop: Rounded, Subtle Device Frame */}
            <div className="w-full h-full sm:h-[88vh] sm:max-w-[420px] bg-[#F6F5F2] relative font-sans text-[#3C3C3C] sm:shadow-[0_20px_60px_rgba(34,40,49,0.18)] overflow-hidden sm:rounded-[2rem] sm:border border-[#E3E6EA] flex flex-col">

                {/* Version Check Banner */}
                {/* <div className="bg-red-500 text-white text-xs text-center p-1 absolute top-0 w-full z-[60]">DEBUG: Phone Layout V3</div> */}

                {/* TOP HEADER (Fixed inside phone) */}
                {/* TOP HEADER (Fixed inside phone) */}
                <div className="absolute top-0 inset-x-0 z-50 h-20 bg-white/70 backdrop-blur-xl border-b border-[#E6E4DF] flex items-center justify-between px-6 transition-all duration-300">
                    {/* Left: Menu/Drawer */}
                    <button className="p-2 -ml-2 text-[#6F7F6A]/70 hover:text-[#6F7F6A] transition-colors active:scale-95">
                        <Menu size={24} />
                    </button>

                    {/* Center: Brand */}
                    <div className="flex flex-col items-center animate-in fade-in slide-in-from-top-2 duration-700">
                        <span className="font-serif font-bold text-2xl text-[#6F7F6A] tracking-tight">
                            EquiCoach
                        </span>
                    </div>

                    {/* Right: Notifications */}
                    <button className="p-2 -mr-2 text-[#6F7F6A]/70 hover:text-[#6F7F6A] transition-colors relative active:scale-95">
                        <Bell size={24} />
                        <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-400 rounded-full border-2 border-white"></span>
                    </button>
                </div>

                {/* MAIN SCROLLABLE CONTENT AREA */}
                <main className="flex-1 overflow-y-scroll no-scrollbar pb-24 pt-20">
                    {activeTab === 'home' && (
                        <RiderHome
                            profile={profile}
                            activeHorse={activeHorse}
                            onExplore={() => setActiveTab('catalog')}
                            onPlay={handlePlaySession}
                        />
                    )}
                    {activeTab === 'programs' && (
                        <RiderPrograms
                            profile={profile}
                            activeHorse={activeHorse}
                            onPlay={handlePlaySession}
                        />
                    )}
                    {activeTab === 'profile' && (
                        isEditingProfile ? (
                            <UserProfileForm
                                profile={profile}
                                onSave={handleSaveProfile}
                                onReset={() => setIsEditingProfile(false)}
                            />
                        ) : (
                            <UserProfileDisplay
                                profile={profile}
                                activeHorse={activeHorse}
                                onEdit={() => setIsEditingProfile(true)}
                                onSwitchHorse={setActiveHorseId}
                            />
                        )
                    )}
                </main>

                {/* BOTTOM NAVIGATION BAR (Fixed inside phone) */}
                <div className="absolute bottom-4 inset-x-4 z-50">
                    <div className="bg-white/90 text-[#3C3C3C] backdrop-blur-xl rounded-2xl p-1.5 shadow-[0_10px_30px_rgba(34,40,49,0.12)] flex items-center justify-between px-3 border border-[#E6E4DF]">
                        <NavButton
                            icon={<Home size={24} />}
                            label="Accueil"
                            isActive={activeTab === 'home'}
                            onClick={() => setActiveTab('home')}
                        />
                        <NavButton
                            icon={<Book size={24} />}
                            label="Programmes"
                            isActive={activeTab === 'programs'}
                            onClick={() => setActiveTab('programs')}
                        />
                        <NavButton
                            icon={<User size={24} />}
                            label="Profil"
                            isActive={activeTab === 'profile'}
                            onClick={() => setActiveTab('profile')}
                        />
                    </div>
                </div>

                {/* EXIT BUTTON */}
                <button
                    onClick={onExit}
                    className="absolute top-4 right-4 z-50 w-8 h-8 flex items-center justify-center bg-black/5 rounded-full hover:bg-black/10 transition-colors"
                    title="Quitter"
                >
                    <X size={16} color="#6F7F6A" />
                </button>
            </div>
        </div>
    );
}

function NavButton({ icon, label, isActive, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-300 w-24
            ${isActive
                    ? 'bg-[#6F7F6A]/10 text-[#6F7F6A] shadow-sm'
                    : 'text-[#9AA0A6] hover:text-[#6F7F6A] hover:bg-black/5'}`}
        >
            <div className="relative">
                {icon}
                {isActive && <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#6F7F6A] rounded-full"></div>}
            </div>
            <span className={`text-[10px] font-semibold tracking-wide ${isActive ? 'text-[#6F7F6A]' : 'text-[#9AA0A6]'}`}>
                {label}
            </span>
        </button>
    );
}
