import React from 'react';
import { Smartphone, LayoutGrid, User, Settings, LogOut } from 'lucide-react';

export default function MainLayout({ children, onSwitchMode, currentMode }) {
    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-amber-500 selection:text-white">
            {/* Premium Header - Glassmorphism */}
            <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/80 border-b border-white/10 shadow-lg">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

                    {/* Logo Area */}
                    <div className="flex items-center gap-3 group cursor-pointer">
                        <div className="bg-gradient-to-br from-amber-400 to-amber-600 w-10 h-10 rounded-xl flex items-center justify-center shadow-amber-500/20 shadow-lg transform group-hover:scale-105 transition-all duration-300">
                            <span className="text-2xl">🐴</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent tracking-tight">
                                EquiCoach
                            </h1>
                            <p className="text-xs text-slate-400 font-medium tracking-wider uppercase">Premium Edition</p>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-6">
                        <button className="text-slate-400 hover:text-amber-400 transition-colors text-sm font-medium">Dashboard</button>
                        <button className="text-slate-400 hover:text-amber-400 transition-colors text-sm font-medium">Séances</button>
                        <button className="text-slate-400 hover:text-amber-400 transition-colors text-sm font-medium">Communauté</button>
                    </nav>

                    {/* Action Area */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onSwitchMode}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-sm transition-all text-sm font-medium text-amber-100 hover:text-white hover:border-amber-500/50 group"
                        >
                            <Smartphone size={18} className="group-hover:text-amber-400 transition-colors" />
                            <span>Mode Rider</span>
                        </button>

                        <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-slate-400 hover:text-amber-400 hover:border-amber-500/30 cursor-pointer transition-all">
                            <User size={20} />
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="max-w-7xl mx-auto px-6 py-8">
                {children}
            </main>

            {/* Footer */}
            <footer className="border-t border-white/5 mt-auto py-12 bg-slate-950/50">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <p className="text-slate-500 text-sm">© 2026 EquiCoach Premium. Tous droits réservés.</p>
                </div>
            </footer>
        </div>
    );
}
