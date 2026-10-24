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
    onStartOnboarding();
  };

  return (
    <div className="space-y-8 py-2">
      {/* Light & Minimal Hero Header */}
      <div className="relative rounded-2xl border border-slate-200 bg-white p-8 sm:p-12 shadow-sm overflow-hidden bg-grid-pattern">
        {/* Soft pastel ambient lighting */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 rounded-full bg-emerald-100/40 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 rounded-full bg-sky-100/40 blur-3xl pointer-events-none" />

        {/* Top Status Bar */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-slate-100 text-[11px] font-mono">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-emerald-700 font-bold tracking-wider">GITQUEST PLATFORM</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-600">OPEN SOURCE ONBOARDING CONSOLE</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500">
            <span className="flex items-center gap-1.5 text-sky-700 font-medium">
              <Cpu className="h-3.5 w-3.5 text-sky-600" />
              <span>POWERED BY GEMMA</span>
            </span>
            <span className="text-slate-300">/</span>
            <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-semibold">
              PRD V1.2 SPEC
            </span>
          </div>
        </div>

        {/* Hero Headline & Callout */}
        <div className="relative z-10 pt-8 max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-800 text-xs font-mono font-medium">
            <Radio className="h-3.5 w-3.5 text-emerald-600 animate-pulse" />
            <span>REAL GITHUB PROFILING · VETTED STARTER ISSUES · ZERO PR SPAM</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            Discover your real skills.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600">
              Claim your first mission.
            </span>{' '}
            Become a trusted contributor.
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl font-normal">
            GitQuest removes the anxiety of open-source contributing for beginners. We inspect your real GitHub repositories, calculate actual demonstrated capabilities, match you to health-vetted unassigned issues, and guide your pull request with the Gemma AI mentor.
          </p>

          {/* Quick Launch Console Input */}
          <div className="pt-2">
            <form onSubmit={handleQuickLaunch} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 max-w-xl">
              <div className="relative flex-1">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">
                  @
                </span>
                <input
                  type="text"
                  value={quickHandle}
                  onChange={(e) => setQuickHandle(e.target.value)}
                  placeholder="Enter GitHub handle (e.g. your-username)"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50/50 pl-8 pr-3 py-3 text-sm font-mono text-slate-900 placeholder-slate-400 focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition shadow-2xs"
                />
              </div>
              <button
                type="submit"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white font-semibold text-sm rounded-xl hover:bg-emerald-500 transition shadow-sm shadow-emerald-600/20 active:scale-[0.99] whitespace-nowrap cursor-pointer"
              >
                <span>Start Contributor Onboarding</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            {/* Quick Chips & Demo Alternative */}
            <div className="flex flex-wrap items-center gap-2 pt-3 text-xs text-slate-500">
              <span className="font-mono text-slate-400">Try sample handle:</span>
              {sampleHandles.map((handle) => (
                <button
                  key={handle}
                  onClick={() => {
                    setQuickHandle(handle);
                    onStartOnboarding();
                  }}
                  className="px-2.5 py-1 rounded-md border border-slate-200 bg-white font-mono text-[11px] text-slate-600 hover:text-emerald-700 hover:border-emerald-300 transition shadow-2xs cursor-pointer"
                >
                  @{handle}
                </button>
              ))}
              <span className="text-slate-300">or</span>
              <button
                onClick={onLoadDemo}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md border border-sky-200 bg-sky-50 font-mono text-[11px] text-sky-800 hover:bg-sky-100 transition font-semibold cursor-pointer shadow-2xs"
              >
                <Zap className="h-3 w-3 text-sky-600" />
                <span>Simulate Demo (@octo-dev)</span>
              </button>
            </div>
          </div>

          {/* Guarantees Matrix */}
          <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-600 border-t border-slate-100">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Real GitHub API Profile Introspection</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Unassigned & Active Issues Only</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Zero PR Spam Maintainer Guarantee</span>
            </span>
          </div>
        </div>
      </div>

      {/* Real-time Sector Telemetry Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        {[
          {
            label: 'VETTED ACTIVE REPOSITORIES',
            val: '42+ Repos',
            sub: 'Audited for maintainer responsiveness',
            color: 'text-emerald-700',
            border: 'border-emerald-200 bg-emerald-50/50',
          },
          {
            label: 'LIVE UNASSIGNED BOUNTIES',
            val: '128 Issues',
            sub: 'Verified open with Good First Issue tags',
            color: 'text-sky-700',
            border: 'border-sky-200 bg-sky-50/50',
          },
          {
            label: 'GEMMA MENTOR LATENCY',
            val: '< 3.2s Avg',
            sub: 'Server-side progressive intelligence',
            color: 'text-violet-700',
            border: 'border-violet-200 bg-violet-50/50',
          },
          {
            label: 'OSS KARMA REPUTATION',
            val: '100% Etiquette',
            sub: 'Strict maintainer-friendly protocols',
            color: 'text-amber-700',
            border: 'border-amber-200 bg-amber-50/50',
          },
        ].map((stat, i) => (
          <div
            key={i}
            className={`p-4 rounded-xl border ${stat.border} space-y-1 shadow-2xs`}
          >
            <div className="text-[10px] font-mono tracking-wider text-slate-500 font-medium">
              {stat.label}
            </div>
            <div className={`text-xl sm:text-2xl font-bold font-mono ${stat.color} tabular-nums`}>
              {stat.val}
            </div>
            <div className="text-[11px] text-slate-600 leading-snug">
              {stat.sub}
            </div>
          </div>
        ))}
      </div>

      {/* The 4-Stage Operational Mission Architecture */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 font-semibold">
              <Target className="h-4 w-4 text-emerald-600" />
              <span>THE 4-STAGE FLIGHT PLAN</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              From First Reconnaissance to Maintainer Merge
            </h2>
          </div>
          <button
            onClick={onStartOnboarding}
            className="text-xs font-mono text-emerald-700 hover:text-emerald-800 flex items-center gap-1 self-start sm:self-auto font-semibold cursor-pointer"
          >
            <span>Begin Contributor Induction</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            {
              phase: 'PHASE 01',
              title: 'Recon & Capability Audit',
              desc: 'Gemma examines your real GitHub repositories, separating self-claimed buzzwords from demonstrated languages to calibrate difficulty.',
              tag: 'GitHub Introspect',
              color: 'text-emerald-700',
              badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
            },
            {
              phase: 'PHASE 02',
              title: 'Dynamic Affinity Match',
              desc: 'Every active bounty is scored (0-100% Affinity) against your demonstrated skill stack, experience tier, and maintainer response velocity.',
              tag: 'Smart Matching',
              color: 'text-sky-700',
              badgeBg: 'bg-sky-50 text-sky-800 border-sky-200',
            },
            {
              phase: 'PHASE 03',
              title: '8-Step Flight Deck & Hints',
              desc: 'Work through guided checkpoints with Gemma Tactical Co-Pilot. Unlock progressive hints from high-level architecture to exact code hints.',
              tag: 'Tiered Guidance',
              color: 'text-violet-700',
              badgeBg: 'bg-violet-50 text-violet-800 border-violet-200',
            },
            {
              phase: 'PHASE 04',
              title: 'Maintainer PR Dispatch',
              desc: 'Synthesize maintainer-compliant PR descriptions with root cause analysis, reproduction testing instructions, and commit hygiene.',
              tag: 'Zero-Spam PR',
              color: 'text-emerald-700',
              badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-slate-200 bg-white p-5 space-y-3 flex flex-col justify-between hover:border-slate-300 hover:shadow-sm transition"
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
                <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Active Starter Repositories Showcase */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-sky-700 font-semibold">
              <Activity className="h-4 w-4 text-sky-600" />
              <span>ACTIVE SECTOR REGISTRY</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              Pre-Vetted Starter Repositories
            </h3>
            <p className="text-xs text-slate-600">
              Each repository is scored for maintainer responsiveness, active weekly commits, and clear contributing guidelines.
            </p>
          </div>
          <button
            onClick={onExplorePublicMissions}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-mono text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition self-start sm:self-auto cursor-pointer"
          >
            <span>View All Bounties</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CURATED_REPOSITORIES.slice(0, 3).map((repo) => (
            <div
              key={repo.id}
              className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3 hover:border-slate-300 hover:bg-white hover:shadow-2xs transition"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-900">{repo.owner}/{repo.name}</span>
                <span className="text-[10px] font-mono text-emerald-800 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                  {repo.healthScore}/100 HEALTH
                </span>
              </div>
              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {repo.description}
              </p>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-200">
                <span className="text-sky-700 font-medium">{repo.primaryLanguage}</span>
                <span>{repo.openIssuesCount} open issues</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Minimal Bottom Action Banner */}
      <div className="rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-teal-50/50 to-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="space-y-1.5 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-mono text-emerald-700 font-semibold">
            <Terminal className="h-4 w-4 text-emerald-600" />
            <span>TERMINAL READY · ZERO RESUME REQUIRED</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900">
            Ready to claim your first open-source badge?
          </h3>
          <p className="text-xs text-slate-600 max-w-xl">
            Complete the 2-minute onboarding to inspect your GitHub capabilities and receive verified missions calibrated to your actual skill level.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onStartOnboarding}
            className="px-6 py-3 bg-emerald-600 text-white font-semibold text-xs font-mono rounded-xl hover:bg-emerald-500 transition shadow-sm shadow-emerald-600/20 active:scale-[0.99] flex items-center gap-2 cursor-pointer"
          >
            <span>START ONBOARDING</span>
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            onClick={onLoadDemo}
            className="px-4 py-3 border border-slate-200 bg-white text-slate-700 font-mono text-xs rounded-xl hover:text-slate-900 hover:bg-slate-50 transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Zap className="h-3.5 w-3.5 text-sky-600" />
            <span>TRY DEMO</span>
          </button>
        </div>
      </div>
    </div>
  );
};
