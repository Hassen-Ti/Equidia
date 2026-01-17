import React, { useState, useEffect } from 'react';
import { Home, Book, User, Play, Menu, X, Bell } from 'lucide-react';
import RiderHome from './RiderHome';
import RiderPrograms from './RiderPrograms';
import RiderPlayer from './RiderPlayer';
import UserProfileDisplay from './UserProfileDisplay';
import UserProfileForm from './UserProfileForm';

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
        /* Mobile: Full Screen, White Bg | Desktop: Gray Bg, Centered Flex */
        <div className="fixed inset-0 bg-[#FAF7F2] sm:bg-gray-100 sm:flex sm:justify-center sm:items-center sm:py-8 z-50">
            {/* Mobile: Full Size, No Border | Desktop: Max Width, Rounded, Bordered Phone Look */}
            <div className="w-full h-full sm:h-[85vh] sm:max-w-[400px] bg-[#FAF7F2] relative font-sans text-[#5C5C5C] sm:shadow-2xl overflow-hidden sm:rounded-[2.5rem] sm:border-[8px] sm:border-white flex flex-col">

                {/* Version Check Banner */}
                {/* <div className="bg-red-500 text-white text-xs text-center p-1 absolute top-0 w-full z-[60]">DEBUG: Phone Layout V3</div> */}

                {/* TOP HEADER (Fixed inside phone) */}
                {/* TOP HEADER (Fixed inside phone) */}
                <div className="absolute top-0 inset-x-0 z-50 h-20 bg-[#FAF7F2]/80 backdrop-blur-xl border-b border-[#8C9E79]/10 flex items-center justify-between px-6 transition-all duration-300">
                    {/* Left: Menu/Drawer */}
                    <button className="p-2 -ml-2 text-[#8C9E79]/50 hover:text-[#8C9E79] transition-colors active:scale-95">
                        <Menu size={24} />
                    </button>

                    {/* Center: Brand */}
                    <div className="flex flex-col items-center animate-in fade-in slide-in-from-top-2 duration-700">
                        <span className="font-serif font-black text-3xl text-[#8C9E79] italic tracking-tighter drop-shadow-sm">
                            EquiCoach
                        </span>
                    </div>

                    {/* Right: Notifications */}
                    <button className="p-2 -mr-2 text-[#8C9E79]/50 hover:text-[#8C9E79] transition-colors relative active:scale-95">
                        <Bell size={24} />
                        <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-400 rounded-full border-2 border-[#FAF7F2]"></span>
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
                <div className="absolute bottom-6 inset-x-6 z-50">
                    <div className="bg-[#8C9E79] text-white backdrop-blur-xl rounded-[2.5rem] p-2 shadow-2xl flex items-center justify-between px-6 border border-white/20">
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
                    className="absolute top-4 right-4 z-50 w-8 h-8 flex items-center justify-center bg-black/10 rounded-full hover:bg-black/20 transition-colors"
                    title="Quitter"
                >
                    <X size={16} color="white" />
                </button>
            </div>
        </div>
    );
}

function NavButton({ icon, label, isActive, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`flex flex-col items-center gap-1 p-3 rounded-2xl transition-all duration-500 w-20
            ${isActive
                    ? 'bg-white text-[#8C9E79] -translate-y-4 shadow-lg scale-110'
                    : 'text-white/70 hover:text-white hover:bg-white/10'}`}
        >
            <div className="relative">
                {icon}
                {isActive && <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#8C9E79] rounded-full"></div>}
            </div>
            {isActive && (
                <span className="text-[9px] font-bold uppercase tracking-widest animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {label}
                </span>
            )}
        </button>
    );
}
