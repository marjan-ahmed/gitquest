import React, { useState } from 'react';
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
} from 'lucide-react';
import { CURATED_REPOSITORIES } from '../data/curatedData';
import { Repository } from '../types';

export const RepoHealthRadar: React.FC = () => {
  const [repos] = useState<Repository[]>(CURATED_REPOSITORIES);
  const [filterLang, setFilterLang] = useState<string>('all');
  const [customRepoUrl, setCustomRepoUrl] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [evalResult, setEvalResult] = useState<any>(null);
  const [evalError, setEvalError] = useState<string | null>(null);

  const quickInspectRepos = [
    'facebook/react',
    'vercel/next.js',
    'tailwindlabs/tailwindcss',
    'colinhacks/zod',
    'expressjs/express',
  ];

  const filtered = repos.filter((r) => {
    if (filterLang === 'all') return true;
    return r.primaryLanguage.toLowerCase() === filterLang.toLowerCase();
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

  return (
    <div className="space-y-6 py-2">
      {/* Header & Live Scanner Console */}
      <div className="rounded-xl border border-slate-800 bg-[#0A0F1D] p-6 shadow-xl relative overflow-hidden bg-grid-pattern">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
            <Radio className="h-4 w-4 animate-pulse" />
            <span>SECTOR RADAR // REPOSITORY HEALTH & VELOCITY TELEMETRY</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-mono text-white tracking-tight">
            Active Repository Radar
          </h1>
          <p className="text-xs text-slate-300 leading-relaxed">
            GitQuest strictly filters out zombie and abandoned repositories. GitHub stars alone are never considered proof of responsive maintenance. Every project monitored on GitQuest features active maintainer commits, low abandonment risk, and clear contributor onboarding.
          </p>
        </div>

        {/* Live Repository Audit Scanner Input */}
        <div className="relative z-10 mt-6 pt-5 border-t border-slate-800/80 space-y-3">
          <label className="block text-xs font-mono text-slate-300">
            LIVE GITHUB AUDIT: Scan Any GitHub Repository for Contributor Readiness:
          </label>

          <form onSubmit={handleEvaluateCustomRepo} className="flex flex-col sm:flex-row gap-2 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
              <input
                type="text"
                value={customRepoUrl}
                onChange={(e) => setCustomRepoUrl(e.target.value)}
                placeholder="e.g. facebook/react or https://github.com/owner/repository"
                className="w-full rounded-lg border border-slate-700 bg-slate-950/90 pl-9 pr-3 py-2.5 text-xs font-mono text-white placeholder-slate-500 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 focus:outline-none transition"
              />
            </div>
            <button
              type="submit"
              disabled={evaluating || !customRepoUrl.trim()}
              className="px-5 py-2.5 bg-emerald-400 text-slate-950 font-mono font-bold text-xs rounded-lg hover:bg-emerald-300 transition disabled:opacity-50 flex items-center justify-center gap-2 whitespace-nowrap active:scale-[0.99]"
            >
              <Radar className={`h-4 w-4 ${evaluating ? 'animate-spin' : ''}`} />
              <span>{evaluating ? 'AUDITING REPO...' : 'SCAN REPOSITORY'}</span>
            </button>
          </form>

          {/* Quick suggestions */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-400">
            <span className="font-mono text-[11px] text-slate-500">Quick audit:</span>
            {quickInspectRepos.map((slug) => (
              <button
                key={slug}
                onClick={() => {
                  setCustomRepoUrl(slug);
                  runAudit(slug);
                }}
                className="px-2 py-0.5 rounded border border-slate-800 bg-slate-900 font-mono text-[11px] text-slate-300 hover:text-emerald-400 hover:border-slate-700 transition"
              >
                {slug}
              </button>
            ))}
          </div>

          {/* Error Notice */}
          {evalError && (
            <div className="p-3.5 rounded-lg border border-rose-500/40 bg-rose-950/20 text-xs font-mono text-rose-300 flex items-center gap-2.5">
              <ShieldAlert className="h-4 w-4 text-rose-400 shrink-0" />
              <span>{evalError}</span>
            </div>
          )}

          {/* Real-time Live Audit Result Box */}
          {evalResult && (
            <div className="p-4 rounded-xl border border-emerald-500/40 bg-[#0D1322] space-y-3 text-xs font-mono">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">
                    {evalResult.owner}/{evalResult.name}
                  </span>
                  <span className="text-[10px] text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 rounded">
                    {evalResult.primaryLanguage}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold text-sm tabular-nums">
                    {evalResult.healthScore}/100 HEALTH INDEX
                  </span>
                  <a
                    href={evalResult.htmlUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1 rounded bg-slate-800 text-slate-300 hover:text-white"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>

              <p className="text-[11px] font-sans text-slate-300 leading-relaxed">
                {evalResult.description}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px] text-slate-300">
                <div className="p-2 rounded bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">RECENT PUSH</span>
                  <strong className="text-slate-100">{evalResult.activeSignals?.recentActivity}</strong>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">MAINTAINER VELOCITY</span>
                  <strong className="text-emerald-400">{evalResult.activeSignals?.maintainerResponse}</strong>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">ABANDONMENT RISK</span>
                  <strong className={evalResult.activeSignals?.abandonmentRisk === 'Low' ? 'text-emerald-400' : 'text-amber-400'}>
                    {evalResult.activeSignals?.abandonmentRisk}
                  </strong>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">OPEN ISSUES / STARS</span>
                  <strong className="text-slate-100">{evalResult.openIssuesCount} issues · ★{evalResult.stars?.toLocaleString()}</strong>
                </div>
              </div>

              <div className="p-2.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-[11px] text-emerald-300 font-sans">
                <strong>GitQuest Assessment:</strong> {evalResult.recommendation}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-[11px] font-mono text-slate-400">TECHNOLOGY SECTOR:</span>
        {['all', 'TypeScript', 'JavaScript', 'Python'].map((lang) => (
          <button
            key={lang}
            onClick={() => setFilterLang(lang)}
            className={`px-3 py-1 rounded font-mono text-xs transition ${
              filterLang === lang
                ? 'bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 font-bold'
                : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
            }`}
          >
            {lang === 'all' ? 'ALL REPOSITORIES' : lang.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Repositories Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((repo) => (
          <div
            key={repo.id}
            className="rounded-xl border border-slate-800 bg-[#0D1322] p-5 space-y-4 hover:border-slate-700 transition flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 mb-1">
                    <span className="text-cyan-400">{repo.primaryLanguage}</span>
                    <span className="text-slate-600">·</span>
                    <span className="tabular-nums">★{repo.stars.toLocaleString()}</span>
                  </div>
                  <h3 className="text-sm font-bold font-mono text-white hover:text-emerald-400 transition-colors">
                    {repo.owner}/{repo.name}
                  </h3>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-mono font-bold text-emerald-400 block tabular-nums">
                    {repo.healthScore}/100
                  </span>
                  <span className="text-[9px] text-slate-500 font-mono tracking-wider">HEALTH SCORE</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                {repo.description}
              </p>
            </div>

            {/* Health Signals Matrix */}
            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-950/70 p-3 rounded-lg border border-slate-800/80 font-mono text-slate-300">
                <div className="flex items-center gap-1.5">
                  <GitCommit className="h-3 w-3 text-cyan-400" />
                  <span>Commit {repo.lastCommitDaysAgo}d ago</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3 w-3 text-emerald-400" />
                  <span>~{repo.maintainerResponseHours}h response</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                  <span>CONTRIBUTING: Yes</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <HeartHandshake className="h-3 w-3 text-violet-400" />
                  <span>Code of Conduct: Yes</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/80">
                <span className="text-[11px] font-mono text-slate-400">
                  <strong className="text-slate-200">{repo.openIssuesCount}</strong> Open Issues Monitored
                </span>

                <a
                  href={repo.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-slate-300 hover:text-emerald-400 font-mono text-xs transition"
                >
                  <span>Inspect Sector</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
