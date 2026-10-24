import React from 'react';
import { Terminal, Crosshair, ShieldCheck, Trophy, Sparkles, Activity, LogOut, Zap, Target } from 'lucide-react';
import { UserProfile } from '../types';
import { calculateLevel } from '../services/storage';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  profile: UserProfile | null;
  onOpenOnboarding: () => void;
  onLogout: () => void;
  onLoadDemo: () => void;
  hasActiveMission: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  profile,
  onOpenOnboarding,
  onLogout,
  onLoadDemo,
  hasActiveMission,
}) => {
  const levelInfo = profile ? calculateLevel(profile.totalXp) : null;

  const getRankTitle = (lvl: number) => {
    if (lvl === 1) return 'Scout';
    if (lvl === 2) return 'Initiate';
    if (lvl === 3) return 'Operative';
    if (lvl === 4) return 'Specialist';
    return 'Commander';
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#182234] bg-[#080B11]/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Brand Wordmark (Terminal Style) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setCurrentTab(profile ? 'explorer' : 'landing')}
            className="flex items-center gap-2.5 text-left group transition"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 group-hover:border-emerald-400 transition-colors shadow-sm">
              <Terminal className="h-5 w-5" />
            </div>
            <div>
              <span className="text-base sm:text-lg font-bold font-mono tracking-tight text-white flex items-center gap-2">
                GITQUEST
                <span className="text-[10px] bg-[#141C2B] border border-[#223147] text-emerald-400 px-1.5 py-0.5 rounded font-mono font-semibold">
                  v1.2
                </span>
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-mono font-medium text-slate-300">
          {!profile && (
            <button
              onClick={() => setCurrentTab('landing')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                currentTab === 'landing'
                  ? 'bg-[#151F30] text-emerald-400 font-semibold border border-emerald-500/30'
                  : 'hover:text-white hover:bg-[#121824]'
              }`}
            >
              System Overview
            </button>
          )}

          <button
            onClick={() => setCurrentTab('explorer')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              currentTab === 'explorer'
                ? 'bg-[#151F30] text-emerald-400 font-semibold border border-emerald-500/30 shadow-sm'
                : 'hover:text-white hover:bg-[#121824]'
            }`}
          >
            <Target className="h-3.5 w-3.5 text-emerald-400" />
            <span>Bounty Board</span>
          </button>

          {profile && hasActiveMission && (
            <button
              onClick={() => setCurrentTab('workspace')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                currentTab === 'workspace'
                  ? 'bg-[#151F30] text-cyan-400 font-semibold border border-cyan-500/30 shadow-sm'
                  : 'hover:text-white hover:bg-[#121824]'
              }`}
            >
              <Crosshair className="h-3.5 w-3.5 text-cyan-400" />
              <span>Active Operation</span>
            </button>
          )}

          <button
            onClick={() => setCurrentTab('etiquette')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              currentTab === 'etiquette'
                ? 'bg-[#151F30] text-emerald-400 font-semibold border border-emerald-500/30'
                : 'hover:text-white hover:bg-[#121824]'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Rules of Engagement</span>
          </button>

          <button
            onClick={() => setCurrentTab('radar')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              currentTab === 'radar'
                ? 'bg-[#151F30] text-emerald-400 font-semibold border border-emerald-500/30'
                : 'hover:text-white hover:bg-[#121824]'
            }`}
          >
            <Activity className="h-3.5 w-3.5" />
            <span>Sector Radar</span>
          </button>

          {profile && (
            <button
              onClick={() => setCurrentTab('profile')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                currentTab === 'profile'
                  ? 'bg-[#151F30] text-violet-400 font-semibold border border-violet-500/30'
                  : 'hover:text-white hover:bg-[#121824]'
              }`}
            >
              <Trophy className="h-3.5 w-3.5" />
              <span>Dossier & Medals</span>
            </button>
          )}
        </nav>

        {/* Zone 3: HUD Status & Auth Controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          {profile && levelInfo ? (
            <>
              {/* Tactical Contributor Meter */}
              <button
                onClick={() => setCurrentTab('profile')}
                className="flex items-center gap-3 px-3 py-1.5 rounded-lg border border-[#1E2C42] bg-[#0E1522] text-xs font-mono hover:border-slate-600 transition"
              >
                <div className="flex flex-col text-left">
                  <span className="text-[10px] text-slate-400 leading-tight">
                    RANK {levelInfo.level} · {getRankTitle(levelInfo.level)}
                  </span>
                  <span className="text-emerald-400 font-bold tabular-nums leading-tight">
                    {profile.totalXp} XP
                  </span>
                </div>
                {/* Mini progress bar */}
                <div className="w-12 h-1.5 rounded-full bg-slate-800 overflow-hidden hidden sm:block">
                  <div
                    className="h-full bg-emerald-400 rounded-full"
                    style={{ width: `${levelInfo.progressPercent}%` }}
                  />
                </div>
              </button>

              {/* Log Out Button */}
              <button
                onClick={onLogout}
                title="Log out and reset session to see whole process"
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono text-slate-400 hover:text-rose-400 border border-[#1E2C42] hover:border-rose-900/60 rounded-lg hover:bg-rose-950/20 transition-colors whitespace-nowrap shrink-0"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Eject</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onLoadDemo}
                className="hidden sm:flex items-center gap-1 px-3 py-1.5 text-xs font-mono text-slate-300 hover:text-white border border-[#1E2C42] rounded-lg hover:bg-[#121824] transition whitespace-nowrap shrink-0"
              >
                <Zap className="h-3.5 w-3.5 text-cyan-400" />
                <span>Simulate Demo</span>
              </button>

              <button
                onClick={onOpenOnboarding}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-mono font-bold text-slate-950 bg-emerald-400 rounded-lg hover:bg-emerald-300 transition-colors whitespace-nowrap shrink-0 shadow-md shadow-emerald-500/20"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Enlist / Onboard</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile subnav */}
      <div className="flex md:hidden overflow-x-auto border-t border-[#182234] px-4 py-2 gap-2 text-xs font-mono">
        {!profile && (
          <button
            onClick={() => setCurrentTab('landing')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${currentTab === 'landing' ? 'bg-[#151F30] text-emerald-400' : 'text-slate-400'}`}
          >
            Overview
          </button>
        )}
        <button
          onClick={() => setCurrentTab('explorer')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${currentTab === 'explorer' ? 'bg-[#151F30] text-emerald-400' : 'text-slate-400'}`}
        >
          Bounties
        </button>
        {profile && hasActiveMission && (
          <button
            onClick={() => setCurrentTab('workspace')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${currentTab === 'workspace' ? 'bg-[#151F30] text-cyan-400' : 'text-slate-400'}`}
          >
            Operation
          </button>
        )}
        <button
          onClick={() => setCurrentTab('etiquette')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${currentTab === 'etiquette' ? 'bg-[#151F30] text-emerald-400' : 'text-slate-400'}`}
        >
          Etiquette
        </button>
        <button
          onClick={() => setCurrentTab('radar')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${currentTab === 'radar' ? 'bg-[#151F30] text-emerald-400' : 'text-slate-400'}`}
        >
          Radar
        </button>
        {profile && (
          <button
            onClick={() => setCurrentTab('profile')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${currentTab === 'profile' ? 'bg-[#151F30] text-violet-400' : 'text-slate-400'}`}
          >
            Dossier
          </button>
        )}
      </div>
    </header>
  );
};
