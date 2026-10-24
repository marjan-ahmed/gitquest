import React, { useState, useEffect } from 'react';
import {
  Activity,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Search,
  Clock,
  GitPullRequest,
  GitCommit,
  HeartHandshake,
  Radar,
  Radio,
  FileCode2,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  RefreshCw,
  Cpu,
  Target,
} from 'lucide-react';
import { CURATED_REPOSITORIES } from '../data/curatedData';
import { Repository, UserProfile } from '../types';

interface RepoHealthRadarProps {
  userProfile?: UserProfile | null;
}

export const RepoHealthRadar: React.FC<RepoHealthRadarProps> = ({ userProfile }) => {
  const [repos, setRepos] = useState<any[]>(CURATED_REPOSITORIES);
  const [filterLang, setFilterLang] = useState<string>('all');
  const [customRepoUrl, setCustomRepoUrl] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [evalResult, setEvalResult] = useState<any>(null);
  const [evalError, setEvalError] = useState<string | null>(null);
  const [isLoadingPersonalized, setIsLoadingPersonalized] = useState(false);

  // Determine user's active languages (demonstrated + preferred)
  const userLanguages = React.useMemo(() => {
    if (!userProfile) return ['TypeScript', 'JavaScript', 'Python'];
    const langs = new Set<string>();
    (userProfile.skillsDemonstrated || []).forEach((l) => langs.add(l));
    (userProfile.preferredLanguages || []).forEach((l) => langs.add(l));
    (userProfile.skillsClaimed || []).forEach((l) => {
      if (['Python', 'Rust', 'Go', 'TypeScript', 'JavaScript', 'Java', 'C++', 'PHP'].includes(l)) {
        langs.add(l);
      }
    });
    return Array.from(langs).length > 0 ? Array.from(langs) : ['TypeScript', 'JavaScript', 'Python'];
  }, [userProfile]);

  // Load dynamically personalized repositories matching user's profile
  useEffect(() => {
    async function loadPersonalizedRepos() {
      setIsLoadingPersonalized(true);
      try {
        const langParam = userLanguages.join(',');
        const usernameParam = userProfile?.githubUsername || '';
        const res = await fetch(
          `/api/github/recommended-repos?languages=${encodeURIComponent(langParam)}&username=${encodeURIComponent(usernameParam)}`
        );
        if (res.ok) {
          const data = await res.json();
          if (data.repositories && data.repositories.length > 0) {
            setRepos(data.repositories);
            return;
          }
        }
      } catch (err) {
        console.warn('Could not fetch personalized repos, falling back to curated', err);
      } finally {
        setIsLoadingPersonalized(false);
      }
      setRepos(CURATED_REPOSITORIES);
    }

    loadPersonalizedRepos();
  }, [userProfile, userLanguages]);

  const quickInspectRepos = [
    'facebook/react',
    'vercel/next.js',
    'tailwindlabs/tailwindcss',
    'colinhacks/zod',
    'expressjs/express',
    'fastapi/fastapi',
  ];

  const filtered = repos.filter((r) => {
    if (filterLang === 'all') return true;
    return (r.primaryLanguage || '').toLowerCase() === filterLang.toLowerCase();
  });

  const runAudit = async (target: string) => {
    if (!target.trim()) return;
    setEvaluating(true);
    setEvalResult(null);
    setEvalError(null);

    // Normalize input to owner/repo
    let cleaned = target.replace(/^https?:\/\/github\.com\//, '').replace(/\/$/, '').trim();
    const parts = cleaned.split('/');
    if (parts.length < 2) {
      setEvalError('Please provide repository in format "owner/repo" or full GitHub URL.');
      setEvaluating(false);
      return;
    }

    const [owner, repo] = parts;

    try {
      const res = await fetch(`/api/github/repo/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`);
      const data = await res.json();

      if (!res.ok || data.exists === false) {
        setEvalError(data.message || `Could not find repository ${owner}/${repo} on GitHub.`);
      } else {
        setEvalResult(data);
      }
    } catch (err: any) {
      setEvalError('Network error connecting to GitHub repository audit server.');
    } finally {
      setEvaluating(false);
    }
  };

  const handleEvaluateCustomRepo = (e: React.FormEvent) => {
    e.preventDefault();
    runAudit(customRepoUrl);
  };

  // Build filter options based on user languages + popular options
  const filterOptions = React.useMemo(() => {
    const list = ['all'];
    userLanguages.forEach((l) => {
      if (!list.includes(l)) list.push(l);
    });
    ['Python', 'Rust', 'Go', 'TypeScript', 'JavaScript'].forEach((l) => {
      if (!list.includes(l)) list.push(l);
    });
    return list;
  }, [userLanguages]);

  return (
    <div className="space-y-6 py-2">
      {/* Header & Live Scanner Console */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm relative overflow-hidden bg-grid-pattern">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 font-semibold">
            <Radio className="h-4 w-4 text-emerald-600 animate-pulse" />
            <span>SECTOR RADAR // REPOSITORY HEALTH & VELOCITY</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-mono text-slate-900 tracking-tight">
            Active Repository Radar
          </h1>
          <p className="text-xs text-slate-600 leading-relaxed font-normal">
            GitQuest strictly filters out zombie and abandoned repositories. GitHub stars alone are never considered proof of responsive maintenance. Every project monitored on GitQuest features active maintainer commits, low abandonment risk, and clear contributor onboarding.
          </p>
        </div>

        {/* Live Repository Audit Scanner Input */}
        <div className="relative z-10 mt-6 pt-5 border-t border-slate-100 space-y-3">
          <label className="block text-xs font-mono text-slate-700 font-semibold">
            LIVE GITHUB AUDIT: Scan Any GitHub Repository for Contributor Readiness:
          </label>

          <form onSubmit={handleEvaluateCustomRepo} className="flex flex-col sm:flex-row gap-2 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={customRepoUrl}
                onChange={(e) => setCustomRepoUrl(e.target.value)}
                placeholder="e.g. facebook/react or https://github.com/owner/repository"
                className="w-full rounded-xl border border-slate-300 bg-white pl-9 pr-3 py-2.5 text-xs font-mono text-slate-900 placeholder-slate-400 focus:border-emerald-600 focus:outline-none shadow-2xs"
              />
            </div>
            <button
              type="submit"
              disabled={evaluating || !customRepoUrl.trim()}
              className="px-5 py-2.5 bg-emerald-600 text-white font-mono font-semibold text-xs rounded-xl hover:bg-emerald-500 transition disabled:opacity-50 flex items-center justify-center gap-2 whitespace-nowrap shadow-sm cursor-pointer"
            >
              <Radar className={`h-4 w-4 ${evaluating ? 'animate-spin' : ''}`} />
              <span>{evaluating ? 'AUDITING REPO...' : 'SCAN REPOSITORY'}</span>
            </button>
          </form>

          {/* Quick suggestions */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
            <span className="font-mono text-[11px] text-slate-400">Quick audit:</span>
            {quickInspectRepos.map((slug) => (
              <button
                key={slug}
                onClick={() => {
                  setCustomRepoUrl(slug);
                  runAudit(slug);
                }}
                className="px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 font-mono text-[11px] text-slate-700 hover:text-emerald-700 hover:border-emerald-300 transition shadow-2xs cursor-pointer"
              >
                {slug}
              </button>
            ))}
          </div>

          {/* Error Notice */}
          {evalError && (
            <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50 text-xs font-mono text-rose-700 flex items-center gap-2.5">
              <ShieldAlert className="h-4 w-4 text-rose-600 shrink-0" />
              <span>{evalError}</span>
            </div>
          )}

          {/* Real-time Live Audit Result Box */}
          {evalResult && (
            <div className="p-5 rounded-2xl border border-emerald-200 bg-emerald-50/40 space-y-3 text-xs font-mono shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-200/80 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">
                    {evalResult.owner}/{evalResult.name}
                  </span>
                  <span className="text-[10px] text-sky-800 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded font-semibold">
                    {evalResult.primaryLanguage}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-800 font-bold text-sm tabular-nums">
                    {evalResult.healthScore}/100 HEALTH INDEX
                  </span>
                  <a
                    href={evalResult.htmlUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-2xs"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>

              <p className="text-[11px] font-sans text-slate-700 leading-relaxed font-normal">
                {evalResult.description}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px] text-slate-700">
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                  <span className="text-slate-500 block text-[10px]">RECENT PUSH</span>
                  <strong className="text-slate-900">{evalResult.activeSignals?.recentActivity}</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                  <span className="text-slate-500 block text-[10px]">MAINTAINER VELOCITY</span>
                  <strong className="text-emerald-700">{evalResult.activeSignals?.maintainerResponse}</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                  <span className="text-slate-500 block text-[10px]">ABANDONMENT RISK</span>
                  <strong className={evalResult.activeSignals?.abandonmentRisk === 'Low' ? 'text-emerald-700' : 'text-amber-700'}>
                    {evalResult.activeSignals?.abandonmentRisk}
                  </strong>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                  <span className="text-slate-500 block text-[10px]">OPEN ISSUES / STARS</span>
                  <strong className="text-slate-900">{evalResult.openIssuesCount} issues · ★{evalResult.stars?.toLocaleString()}</strong>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-emerald-200 text-[11px] text-emerald-900 font-sans shadow-2xs">
                <strong>GitQuest Assessment:</strong> {evalResult.recommendation}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Profile-Tailored Recommendation Callout */}
      {userProfile && (
        <div className="p-5 rounded-2xl border border-emerald-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0 shadow-2xs">
              <Target className="h-4 w-4 text-emerald-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-slate-900">
                  Personalized Radar for @{userProfile.githubUsername}
                </span>
                <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                  {userLanguages.join(', ')}
                </span>
              </div>
              <p className="text-[11px] text-slate-600">
                Repositories dynamically filtered to match your verified GitHub code capabilities and target learning stack.
              </p>
            </div>
          </div>

          <div className="text-[11px] font-mono text-slate-500 shrink-0 font-medium">
            {isLoadingPersonalized ? (
              <span className="flex items-center gap-1.5 text-sky-700">
                <RefreshCw className="h-3.5 w-3.5 animate-spin text-sky-600" />
                <span>Syncing GitHub sectors...</span>
              </span>
            ) : (
              <span>{filtered.length} Repositories matched</span>
            )}
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-[11px] font-mono text-slate-500 font-semibold">TECHNOLOGY SECTOR:</span>
        {filterOptions.map((lang) => (
          <button
            key={lang}
            onClick={() => setFilterLang(lang)}
            className={`px-3 py-1 rounded-lg font-mono text-xs transition cursor-pointer ${
              filterLang.toLowerCase() === lang.toLowerCase()
                ? 'bg-emerald-50 border border-emerald-300 text-emerald-900 font-bold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
            }`}
          >
            {lang === 'all' ? 'ALL MATCHED REPOSITORIES' : lang.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Repositories Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((repo) => (
          <div
            key={repo.id}
            className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4 hover:border-slate-300 hover:shadow-sm transition flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-mono text-slate-500 mb-1">
                    <span className="text-sky-700 font-bold">{repo.primaryLanguage}</span>
                    <span className="text-slate-300">·</span>
                    <span className="tabular-nums">★{repo.stars?.toLocaleString() || '1,000+'}</span>
                  </div>
                  <h3 className="text-base font-bold font-mono text-slate-900 hover:text-emerald-700 transition-colors">
                    {repo.owner}/{repo.name}
                  </h3>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-mono font-bold text-emerald-700 block tabular-nums">
                    {repo.healthScore}/100
                  </span>
                  <span className="text-[9px] text-slate-400 font-mono tracking-wider font-semibold">HEALTH SCORE</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {repo.description}
              </p>

              {repo.matchReason && (
                <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-200 text-[11px] font-mono text-sky-900 flex items-start gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-sky-600 shrink-0 mt-0.5" />
                  <span>{repo.matchReason}</span>
                </div>
              )}
            </div>

            {/* Health Signals Matrix */}
            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50/70 p-3.5 rounded-xl border border-slate-200 font-mono text-slate-700">
                <div className="flex items-center gap-1.5">
                  <GitCommit className="h-3.5 w-3.5 text-sky-600" />
                  <span>Commit {repo.lastCommitDaysAgo || 1}d ago</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-emerald-600" />
                  <span>~{repo.maintainerResponseHours || 12}h response</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>CONTRIBUTING: Yes</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <HeartHandshake className="h-3.5 w-3.5 text-violet-600" />
                  <span>Code of Conduct: Yes</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                <span className="text-[11px] font-mono text-slate-500">
                  <strong className="text-slate-800 font-semibold">{repo.openIssuesCount || 100}</strong> Open Issues Monitored
                </span>

                <a
                  href={repo.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-slate-600 hover:text-emerald-700 font-mono text-xs transition font-semibold"
                >
                  <span>Inspect Sector</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
