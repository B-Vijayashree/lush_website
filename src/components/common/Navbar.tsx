import React from 'react';
import { ActiveTab } from '../../types/garden';
import { Sprout, Layout, BookOpen, FolderHeart, Sparkles, ArrowRight } from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onStartDesigning: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onStartDesigning,
}) => {
  const navItems: { id: ActiveTab; label: string; icon: any }[] = [
    { id: 'home', label: 'Home', icon: Sparkles },
    { id: 'planner', label: 'Garden Planner', icon: Layout },
    { id: 'library', label: 'Plant Library', icon: BookOpen },
    { id: 'my-gardens', label: 'My Gardens', icon: FolderHeart },
  ];

  return (
    <nav className="h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Brand Logo */}
      <div
        onClick={() => onSelectTab('home')}
        className="flex items-center gap-3 cursor-pointer select-none group"
      >
        <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-emerald-700 to-emerald-950 flex items-center justify-center text-white shadow-soft group-hover:scale-105 transition-transform">
          <Sprout className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-xl font-extrabold tracking-tight text-emerald-950 font-sans">
              LUSH
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
              Smart Planner
            </span>
          </div>
          <p className="text-[10px] text-slate-400 font-medium tracking-wide">
            Landscape Garden Planner
          </p>
        </div>
      </div>

      {/* Main Navigation Links */}
      <div className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-2xl border border-slate-200/60">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                isActive
                  ? 'bg-white text-emerald-950 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-700' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Primary CTA Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={onStartDesigning}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-800 hover:bg-emerald-700 active:bg-emerald-900 text-white rounded-2xl text-xs font-bold shadow-soft hover:shadow-elevated transition-all"
        >
          <span>Start Designing</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </nav>
  );
};
