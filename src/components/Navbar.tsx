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
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Brand Wordmark (Terminal Style) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setCurrentTab(profile ? 'explorer' : 'landing')}
            className="flex items-center gap-2.5 text-left group transition cursor-pointer"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 group-hover:border-emerald-400 group-hover:bg-emerald-100 transition-colors shadow-2xs">
              <Terminal className="h-5 w-5" />
            </div>
            <div>
              <span className="text-base sm:text-lg font-bold font-mono tracking-tight text-slate-900 flex items-center gap-2">
                GITQUEST
                <span className="text-[10px] bg-slate-100 border border-slate-200 text-emerald-700 px-1.5 py-0.5 rounded font-mono font-semibold">
                  v1.2
                </span>
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-mono font-medium text-slate-600">
          {!profile && (
            <button
              onClick={() => setCurrentTab('landing')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentTab === 'landing'
                  ? 'bg-slate-100 text-emerald-700 font-semibold border border-slate-200'
                  : 'hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              System Overview
            </button>
          )}

          <button
            onClick={() => setCurrentTab('explorer')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentTab === 'explorer'
                ? 'bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200 shadow-2xs'
                : 'hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Target className="h-3.5 w-3.5 text-emerald-600" />
            <span>Bounty Board</span>
          </button>

          {profile && hasActiveMission && (
            <button
              onClick={() => setCurrentTab('workspace')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentTab === 'workspace'
                  ? 'bg-sky-50 text-sky-800 font-semibold border border-sky-200 shadow-2xs'
                  : 'hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Crosshair className="h-3.5 w-3.5 text-sky-600" />
              <span>Active Operation</span>
            </button>
          )}

          <button
            onClick={() => setCurrentTab('etiquette')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentTab === 'etiquette'
                ? 'bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200'
                : 'hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span>Rules of Engagement</span>
          </button>

          <button
            onClick={() => setCurrentTab('radar')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentTab === 'radar'
                ? 'bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200'
                : 'hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Activity className="h-3.5 w-3.5 text-emerald-600" />
            <span>Sector Radar</span>
          </button>

          {profile && (
            <button
              onClick={() => setCurrentTab('profile')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentTab === 'profile'
                  ? 'bg-violet-50 text-violet-800 font-semibold border border-violet-200'
                  : 'hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Trophy className="h-3.5 w-3.5 text-violet-600" />
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
                className="flex items-center gap-3 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-mono hover:bg-slate-100 hover:border-slate-300 transition cursor-pointer"
              >
                <div className="flex flex-col text-left">
                  <span className="text-[10px] text-slate-500 leading-tight">
                    RANK {levelInfo.level} · {getRankTitle(levelInfo.level)}
                  </span>
                  <span className="text-emerald-700 font-bold tabular-nums leading-tight">
                    {profile.totalXp} XP
                  </span>
                </div>
                {/* Mini progress bar */}
                <div className="w-12 h-1.5 rounded-full bg-slate-200 overflow-hidden hidden sm:block">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${levelInfo.progressPercent}%` }}
                  />
                </div>
              </button>

              {/* Log Out Button */}
              <button
                onClick={onLogout}
                title="Log out and reset session"
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono text-slate-600 hover:text-rose-600 border border-slate-200 hover:border-rose-300 rounded-lg hover:bg-rose-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Eject</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onLoadDemo}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-slate-700 hover:text-slate-900 border border-slate-200 bg-white hover:bg-slate-50 rounded-lg transition whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Zap className="h-3.5 w-3.5 text-sky-600" />
                <span>Simulate Demo</span>
              </button>

              <button
                onClick={onOpenOnboarding}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-mono font-bold text-white bg-emerald-600 rounded-lg hover:bg-emerald-500 transition-colors whitespace-nowrap shrink-0 shadow-sm shadow-emerald-600/20 cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Enlist / Onboard</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile subnav */}
      <div className="flex md:hidden overflow-x-auto border-t border-slate-200 bg-white px-4 py-2 gap-2 text-xs font-mono">
        {!profile && (
          <button
            onClick={() => setCurrentTab('landing')}
            className={`px-2.5 py-1 rounded whitespace-nowrap cursor-pointer ${currentTab === 'landing' ? 'bg-slate-100 text-emerald-700 font-bold' : 'text-slate-600'}`}
          >
            Overview
          </button>
        )}
        <button
          onClick={() => setCurrentTab('explorer')}
          className={`px-2.5 py-1 rounded whitespace-nowrap cursor-pointer ${currentTab === 'explorer' ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-slate-600'}`}
        >
          Bounties
        </button>
        {profile && hasActiveMission && (
          <button
            onClick={() => setCurrentTab('workspace')}
            className={`px-2.5 py-1 rounded whitespace-nowrap cursor-pointer ${currentTab === 'workspace' ? 'bg-sky-50 text-sky-800 font-bold' : 'text-slate-600'}`}
          >
            Operation
          </button>
        )}
        <button
          onClick={() => setCurrentTab('etiquette')}
          className={`px-2.5 py-1 rounded whitespace-nowrap cursor-pointer ${currentTab === 'etiquette' ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-slate-600'}`}
        >
          Etiquette
        </button>
        <button
          onClick={() => setCurrentTab('radar')}
          className={`px-2.5 py-1 rounded whitespace-nowrap cursor-pointer ${currentTab === 'radar' ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-slate-600'}`}
        >
          Radar
        </button>
        {profile && (
          <button
            onClick={() => setCurrentTab('profile')}
            className={`px-2.5 py-1 rounded whitespace-nowrap cursor-pointer ${currentTab === 'profile' ? 'bg-violet-50 text-violet-800 font-bold' : 'text-slate-600'}`}
          >
            Dossier
          </button>
        )}
      </div>
    </header>
  );
};
