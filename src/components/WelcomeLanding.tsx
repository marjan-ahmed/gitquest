import React, { useState } from 'react';
import {
  Compass,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FolderGit2,
  Terminal,
  Trophy,
  Zap,
  Target,
  Radio,
  ExternalLink,
  ChevronRight,
  Activity,
  Cpu,
} from 'lucide-react';
import { CURATED_REPOSITORIES } from '../data/curatedData';

interface WelcomeLandingProps {
  onStartOnboarding: () => void;
  onLoadDemo: () => void;
  onExplorePublicMissions: () => void;
}

export const WelcomeLanding: React.FC<WelcomeLandingProps> = ({
  onStartOnboarding,
  onLoadDemo,
  onExplorePublicMissions,
}) => {
  const [quickHandle, setQuickHandle] = useState('');

  const sampleHandles = ['octocat', 'leerob', 'shadcn', 'antfu'];

  const handleQuickLaunch = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickHandle.trim()) {
      onStartOnboarding();
    } else {
      onStartOnboarding();
    }
  };

  return (
    <div className="space-y-10 py-2">
      {/* Tactical Station Header & Hero Flight Deck */}
      <div className="relative rounded-xl border border-slate-800 bg-[#0A0F1D] p-6 sm:p-10 shadow-2xl overflow-hidden bg-grid-pattern">
        {/* Ambient Phosphor Lighting */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

        {/* Top Status Teletype */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-slate-800/80 text-[11px] font-mono">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 font-bold tracking-wider">STATION: GITQUEST CONTROLLER</span>
            <span className="text-slate-600">/</span>
            <span className="text-slate-400">SECTOR: OPEN_SOURCE_DISCOVERY</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <Cpu className="h-3 w-3" />
              <span>GEMMA-3.1 TACTICAL LINK ACTIVE</span>
            </span>
            <span className="text-slate-600">/</span>
            <span className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px]">
              PRD V1.2 SPEC
            </span>
          </div>
        </div>

        {/* Hero Headline & Callout */}
        <div className="relative z-10 pt-8 max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-mono">
            <Radio className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
            <span>AUTHENTIC GITHUB MISSIONS · REAL PROFILE SYNTHESIS · ZERO SPAM</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
            Discover your true skills.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-400">
              Claim your first mission.
            </span>{' '}
            Become a trusted contributor.
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            GitQuest eliminates the dread of open source for beginners. We inspect your real GitHub repositories, calculate actual demonstrated capabilities, match you to health-vetted unassigned issues, and guide your pull request with the Gemma AI mentor.
          </p>

          {/* Quick Launch Console Input */}
          <div className="pt-2">
            <form onSubmit={handleQuickLaunch} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 max-w-xl">
              <div className="relative flex-1">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-sm">
                  @
                </span>
                <input
                  type="text"
                  value={quickHandle}
                  onChange={(e) => setQuickHandle(e.target.value)}
                  placeholder="Enter GitHub handle (e.g. your-username)"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/90 pl-8 pr-3 py-3 text-sm font-mono text-white placeholder-slate-500 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 focus:outline-none transition"
                />
              </div>
              <button
                type="submit"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-400 text-slate-950 font-bold text-sm rounded-lg hover:bg-emerald-300 transition shadow-lg shadow-emerald-500/20 active:scale-[0.99] whitespace-nowrap"
              >
                <span>Initiate Contributor Dossier</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            {/* Quick Chips & Demo Alternative */}
            <div className="flex flex-wrap items-center gap-2 pt-3 text-xs text-slate-400">
              <span className="font-mono text-slate-500">Quick test handles:</span>
              {sampleHandles.map((handle) => (
                <button
                  key={handle}
                  onClick={() => {
                    setQuickHandle(handle);
                    onStartOnboarding();
                  }}
                  className="px-2 py-0.5 rounded border border-slate-800 bg-slate-900 font-mono text-[11px] text-slate-300 hover:text-emerald-400 hover:border-slate-700 transition"
                >
                  @{handle}
                </button>
              ))}
              <span className="text-slate-600">or</span>
              <button
                onClick={onLoadDemo}
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded border border-cyan-500/30 bg-cyan-500/10 font-mono text-[11px] text-cyan-300 hover:bg-cyan-500/20 transition font-bold"
              >
                <Zap className="h-3 w-3 text-cyan-400" />
                <span>Launch Demo Scout (@octo-dev)</span>
              </button>
            </div>
          </div>

          {/* Guarantees Matrix */}
          <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-400 border-t border-slate-800/80">
            <span className="flex items-center gap-1.5 text-slate-300">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Real GitHub API Profile Introspection</span>
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Unassigned & Active Issues Only</span>
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Zero PR Spam Maintainer Guarantee</span>
            </span>
          </div>
        </div>
      </div>

      {/* Real-time Sector Telemetry Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            label: 'VETTED ACTIVE REPOSITORIES',
            val: '42+ Repos',
            sub: 'Audited for maintainer responsiveness',
            color: 'text-emerald-400',
            border: 'border-emerald-500/20',
          },
          {
            label: 'LIVE UNASSIGNED BOUNTIES',
            val: '128 Issues',
            sub: 'Verified open with Good First Issue tags',
            color: 'text-cyan-400',
            border: 'border-cyan-500/20',
          },
          {
            label: 'GEMMA MENTOR LATENCY',
            val: '< 3.2s Avg',
            sub: 'Server-side progressive intelligence',
            color: 'text-violet-400',
            border: 'border-violet-500/20',
          },
          {
            label: 'OSS KARMA REPUTATION',
            val: '100% Etiquette',
            sub: 'Strict maintainer-friendly protocols',
            color: 'text-amber-400',
            border: 'border-amber-500/20',
          },
        ].map((stat, i) => (
          <div
            key={i}
            className={`p-4 rounded-xl border ${stat.border} bg-[#0D1322] space-y-1`}
          >
            <div className="text-[10px] font-mono tracking-wider text-slate-400">
              {stat.label}
            </div>
            <div className={`text-xl sm:text-2xl font-bold font-mono ${stat.color} tabular-nums`}>
              {stat.val}
            </div>
            <div className="text-[11px] text-slate-500 leading-snug">
              {stat.sub}
            </div>
          </div>
        ))}
      </div>

      {/* The 4-Stage Operational Mission Architecture */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <Target className="h-4 w-4" />
              <span>THE 4-STAGE FLIGHT PLAN</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              From First Reconnaissance to Maintainer Merge
            </h2>
          </div>
          <button
            onClick={onStartOnboarding}
            className="text-xs font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1 self-start sm:self-auto font-semibold"
          >
            <span>Begin Contributor Induction</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
          {[
            {
              phase: 'PHASE 01',
              title: 'Recon & Capability Audit',
              desc: 'Gemma examines your real GitHub repositories, separating self-claimed buzzwords from demonstrated languages to calibrate difficulty.',
              tag: 'GitHub Introspect',
              color: 'text-emerald-400',
              badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
            },
            {
              phase: 'PHASE 02',
              title: 'Dynamic Affinity Match',
              desc: 'Every active bounty is scored (0-100% Affinity) against your demonstrated skill stack, experience tier, and maintainer response velocity.',
              tag: 'Smart Matching',
              color: 'text-cyan-400',
              badgeBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
            },
            {
              phase: 'PHASE 03',
              title: '8-Step Flight Deck & Hints',
              desc: 'Work through guided checkpoints with Gemma Tactical Co-Pilot. Unlock progressive hints from high-level architecture to exact code hints.',
              tag: 'Tiered Guidance',
              color: 'text-violet-400',
              badgeBg: 'bg-violet-500/10 text-violet-400 border-violet-500/30',
            },
            {
              phase: 'PHASE 04',
              title: 'Maintainer PR Dispatch',
              desc: 'Synthesize maintainer-compliant PR descriptions with root cause analysis, reproduction testing instructions, and commit hygiene.',
              tag: 'Zero-Spam PR',
              color: 'text-emerald-400',
              badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-slate-800 bg-[#0E1526] p-5 space-y-3 flex flex-col justify-between hover:border-slate-700 transition"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-mono font-bold ${item.color}`}>
                    {item.phase}
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${item.badgeBg}`}>
                    {item.tag}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Active Starter Repositories Showcase */}
      <div className="rounded-xl border border-slate-800 bg-[#0A0F1D] p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <Activity className="h-4 w-4" />
              <span>ACTIVE SECTOR REGISTRY</span>
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Pre-Vetted Starter Repositories
            </h3>
            <p className="text-xs text-slate-400">
              Each repository is scored for maintainer responsiveness, active weekly commits, and clear contributing guidelines.
            </p>
          </div>
          <button
            onClick={onExplorePublicMissions}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-xs font-mono text-slate-200 hover:text-white hover:border-slate-600 transition self-start sm:self-auto"
          >
            <span>View All Bounties</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CURATED_REPOSITORIES.slice(0, 3).map((repo) => (
            <div
              key={repo.id}
              className="p-4 rounded-xl border border-slate-800 bg-[#0D1322] space-y-3 hover:border-slate-700 transition"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-white">{repo.owner}/{repo.name}</span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
                  {repo.healthScore}/100 HEALTH
                </span>
              </div>
              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                {repo.description}
              </p>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800/80">
                <span className="text-cyan-400">{repo.primaryLanguage}</span>
                <span>{repo.openIssuesCount} open issues</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Terminal Callout & Bottom Action */}
      <div className="rounded-xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/30 via-slate-900 to-[#0B1120] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-mono text-emerald-400">
            <Terminal className="h-4 w-4" />
            <span>TERMINAL READY // INITIALIZE SEQUENCE</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white">
            Ready to claim your first open-source badge?
          </h3>
          <p className="text-xs text-slate-300 max-w-xl">
            Complete the 2-minute induction to inspect your GitHub capabilities and receive verified missions calibrated to your actual skill level.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onStartOnboarding}
            className="px-6 py-3 bg-emerald-400 text-slate-950 font-bold text-xs font-mono rounded-lg hover:bg-emerald-300 transition shadow-lg shadow-emerald-500/20 active:scale-[0.99] flex items-center gap-2"
          >
            <span>START INDUCTION</span>
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            onClick={onLoadDemo}
            className="px-4 py-3 border border-slate-700 bg-slate-900 text-slate-300 font-mono text-xs rounded-lg hover:text-white hover:bg-slate-800 transition flex items-center gap-1.5"
          >
            <Zap className="h-3.5 w-3.5 text-cyan-400" />
            <span>TRY DEMO</span>
          </button>
        </div>
      </div>
    </div>
  );
};
