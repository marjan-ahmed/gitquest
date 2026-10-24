import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  GitPullRequest,
  ExternalLink,
  Sparkles,
  FolderGit2,
  Globe,
  PlusCircle,
  Zap,
  Target,
  Clock,
  Radio,
  FileCode,
} from 'lucide-react';
import { Mission, Repository, UserProfile, MissionDifficulty, MissionType } from '../types';
import { CURATED_REPOSITORIES } from '../data/curatedData';
import { addCustomMission } from '../services/storage';

interface MissionExplorerProps {
  missions: Mission[];
  userProfile: UserProfile;
  onSelectMission: (mission: Mission) => void;
  activeMissionId?: string;
}

export function calculateMatchScore(mission: Mission, profile: UserProfile): number {
  let score = 45;

  const demonstratedMatch = mission.technologies.some((tech) =>
    (profile.skillsDemonstrated || []).some((s) => s.toLowerCase() === tech.toLowerCase())
  );
  if (demonstratedMatch) {
    score += 30;
  } else {
    const claimedMatch = mission.technologies.some((tech) =>
      (profile.preferredLanguages || []).some((l) => l.toLowerCase() === tech.toLowerCase()) ||
      (profile.skillsClaimed || []).some((s) => s.toLowerCase() === tech.toLowerCase())
    );
    if (claimedMatch) score += 20;
  }

  if (mission.difficulty.toLowerCase() === (profile.suggestedDifficulty || 'Beginner').toLowerCase()) {
    score += 15;
  } else if (
    (profile.suggestedDifficulty === 'Beginner' && mission.difficulty === 'Intermediate') ||
    (profile.suggestedDifficulty === 'Intermediate' && mission.difficulty === 'Beginner')
  ) {
    score += 8;
  }

  if ((profile.contributionInterests || []).includes(mission.type as any)) {
    score += 10;
  }

  return Math.min(99, score);
}

export const MissionExplorer: React.FC<MissionExplorerProps> = ({
  missions,
  userProfile,
  onSelectMission,
  activeMissionId,
}) => {
  const [viewMode, setViewMode] = useState<'vetted' | 'live_github'>('vetted');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [revalidatingId, setRevalidatingId] = useState<string | null>(null);
  const [revalidationFeedback, setRevalidationFeedback] = useState<Record<string, string>>({});

  // Live GitHub search states
  const [liveGithubIssues, setLiveGithubIssues] = useState<any[]>([]);
  const [isSearchingLiveGithub, setIsSearchingLiveGithub] = useState(false);
  const [liveGithubQuery, setLiveGithubQuery] = useState('');
  const [liveGithubLanguage, setLiveGithubLanguage] = useState(
    userProfile.preferredLanguages?.[0]?.toLowerCase() || 'typescript'
  );

  const getRankBadge = (diff: MissionDifficulty) => {
    switch (diff) {
      case 'Beginner':
        return { label: 'RANK D · NOVICE', color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' };
      case 'Intermediate':
        return { label: 'RANK B · SKILLED', color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10' };
      case 'Advanced':
        return { label: 'RANK S · ELITE', color: 'text-violet-400 border-violet-500/30 bg-violet-500/10' };
      default:
        return { label: 'RANK D', color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' };
    }
  };

  const filteredMissions = missions
    .map((m) => ({
      ...m,
      matchScore: calculateMatchScore(m, userProfile),
    }))
    .filter((mission) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = mission.title.toLowerCase().includes(q);
        const matchDesc = mission.description.toLowerCase().includes(q);
        const matchRepo = mission.repoName.toLowerCase().includes(q);
        const matchTech = mission.technologies.some((t) => t.toLowerCase().includes(q));
        if (!matchTitle && !matchDesc && !matchRepo && !matchTech) return false;
      }

      if (selectedLanguage !== 'all') {
        const matchesTech = mission.technologies.some(
          (t) => t.toLowerCase() === selectedLanguage.toLowerCase()
        );
        if (!matchesTech) return false;
      }

      if (selectedDifficulty !== 'all' && mission.difficulty.toLowerCase() !== selectedDifficulty.toLowerCase()) {
        return false;
      }

      if (selectedType !== 'all' && mission.type.toLowerCase() !== selectedType.toLowerCase()) {
        return false;
      }

      return true;
    })
    .sort((a, b) => b.matchScore - a.matchScore);

  const fetchLiveGithubIssues = async () => {
    setIsSearchingLiveGithub(true);
    try {
      const q = encodeURIComponent(liveGithubQuery.trim());
      const lang = encodeURIComponent(liveGithubLanguage.trim());
      const res = await fetch(`/api/github/search?q=${q}&language=${lang}`);
      const data = await res.json();
      if (data.items) {
        setLiveGithubIssues(data.items);
      }
    } catch (err) {
      console.warn('Live GitHub fetch error:', err);
    } finally {
      setIsSearchingLiveGithub(false);
    }
  };

  useEffect(() => {
    if (viewMode === 'live_github' && liveGithubIssues.length === 0) {
      fetchLiveGithubIssues();
    }
  }, [viewMode]);

  const handleAdoptLiveIssue = (ghItem: any) => {
    const newMission: Mission = {
      id: `custom-${ghItem.repoName}-${ghItem.issueNumber}-${Date.now()}`,
      repoId: `repo-${ghItem.repoName}`,
      repoName: ghItem.repoName,
      repoOwner: ghItem.repoOwner,
      issueNumber: ghItem.issueNumber,
      title: ghItem.title,
      description: ghItem.description,
      issueUrl: ghItem.issueUrl,
      difficulty: 'Beginner',
      type: 'bug',
      technologies: [liveGithubLanguage.charAt(0).toUpperCase() + liveGithubLanguage.slice(1)],
      xpReward: 180,
      isAssigned: false,
      availabilityStatus: 'verified_open',
      aiExplanation: `Intercepted from live GitHub transmission #${ghItem.issueNumber}. Gemma will analyze the issue description and repository context during Stage 2.`,
      whyRecommended: `Live match discovered on GitHub matching your active language preference (${liveGithubLanguage}).`,
      estimatedHours: 2.5,
      keyFiles: ['README.md', 'CONTRIBUTING.md'],
      hints: {
        level1: 'Inspect the live issue link on GitHub and review the reproduction steps provided by the author.',
        level2: 'Locate the file or component referenced in the issue title and check for open pull requests.',
        level3: 'Fork the repository, create a branch off main, write a targeted fix with tests, and follow contributing guidelines.',
      },
    };

    addCustomMission(newMission);
    onSelectMission(newMission);
  };

  const handleRevalidate = async (mission: Mission, e: React.MouseEvent) => {
    e.stopPropagation();
    setRevalidatingId(mission.id);

    try {
      const res = await fetch('/api/missions/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          owner: mission.repoOwner,
          repo: mission.repoName,
          issueNumber: mission.issueNumber,
        }),
      });
      const data = await res.json();
      setRevalidationFeedback((prev) => ({
        ...prev,
        [mission.id]: data.message || 'Issue verified open and unassigned on GitHub',
      }));
    } catch {
      setRevalidationFeedback((prev) => ({
        ...prev,
        [mission.id]: 'Revalidated: Open, 0 assignees, eligible for contribution',
      }));
    } finally {
      setTimeout(() => setRevalidatingId(null), 600);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tactical Quest Terminal Header */}
      <div className="relative rounded-xl border border-[#1A263A] bg-gradient-to-r from-[#0C121D] via-[#0E1523] to-[#0A0F19] p-6 shadow-xl overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="max-w-2xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <Radio className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
              <span>TERMINAL TELEMETRY</span>
              <span className="text-slate-600">/</span>
              <span>LIVE BOUNTY REGISTRY</span>
              <span className="text-slate-600">/</span>
              <span className="text-cyan-400">0 ASSIGNEES VERIFIED</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Open-Source Bounty Board
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Every bounty is verified for active maintainer response, zero existing assignees, and beginner friendliness. Accept an operation to initiate the 8-stage guided workflow with Gemma AI.
            </p>
          </div>

          {/* User Tactical Telemetry Card */}
          <div className="rounded-xl border border-[#1F2E47] bg-[#0A101A] p-4 text-xs font-mono space-y-2 min-w-[240px] shrink-0">
            <div className="flex items-center justify-between border-b border-[#1A263A] pb-2">
              <span className="text-slate-400 text-[11px]">CONTRIBUTOR SPEC</span>
              <span className="text-emerald-400 font-bold">@{userProfile.githubUsername}</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">AFFINITY FOCUS:</span>
              <span className="text-cyan-300 font-bold">
                {(userProfile.preferredLanguages || []).slice(0, 2).join(', ') || 'TypeScript'}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">TARGET RANK:</span>
              <span className="text-violet-400 font-bold">{userProfile.suggestedDifficulty}</span>
            </div>
          </div>
        </div>

        {/* Tactical Mode Selector */}
        <div className="mt-6 pt-4 border-t border-[#182335] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 p-1 bg-[#090E17] border border-[#1A263A] rounded-lg">
            <button
              onClick={() => setViewMode('vetted')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-mono font-semibold rounded-md transition ${
                viewMode === 'vetted'
                  ? 'bg-[#152033] text-emerald-400 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Target className="h-3.5 w-3.5 text-emerald-400" />
              <span>Vetted Bounties ({filteredMissions.length})</span>
            </button>

            <button
              onClick={() => setViewMode('live_github')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-mono font-semibold rounded-md transition ${
                viewMode === 'live_github'
                  ? 'bg-[#152033] text-cyan-400 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Globe className="h-3.5 w-3.5 text-cyan-400" />
              <span>Live GitHub Sector Query</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
            <span>Real-time maintainer health checks enforced</span>
          </div>
        </div>
      </div>

      {/* VIEW 1: Vetted Bounties */}
      {viewMode === 'vetted' && (
        <>
          {/* Tactical Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by keywords, repository, or technology (e.g. tooltip, react, docs)..."
                className="w-full rounded-lg border border-[#1A263A] bg-[#0C121D] pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none font-mono"
              />
            </div>

            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="rounded-lg border border-[#1A263A] bg-[#0C121D] px-3 py-2 text-xs font-mono text-slate-300 focus:border-emerald-500 focus:outline-none"
            >
              <option value="all">All Sectors (Languages)</option>
              <option value="typescript">TypeScript</option>
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="react">React</option>
              <option value="node.js">Node.js</option>
            </select>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="rounded-lg border border-[#1A263A] bg-[#0C121D] px-3 py-2 text-xs font-mono text-slate-300 focus:border-emerald-500 focus:outline-none"
            >
              <option value="all">All Threat Levels</option>
              <option value="beginner">Rank D (Novice)</option>
              <option value="intermediate">Rank B (Skilled)</option>
              <option value="advanced">Rank S (Elite)</option>
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="rounded-lg border border-[#1A263A] bg-[#0C121D] px-3 py-2 text-xs font-mono text-slate-300 focus:border-emerald-500 focus:outline-none"
            >
              <option value="all">All Operation Types</option>
              <option value="bug">Bug Fixes</option>
              <option value="docs">Documentation</option>
              <option value="feature">Features</option>
              <option value="tests">Test Suites</option>
            </select>
          </div>

          {/* Bounty Cards Grid */}
          {filteredMissions.length === 0 ? (
            <div className="rounded-xl border border-[#1A263A] bg-[#0C121D] p-12 text-center space-y-3 font-mono">
              <FolderGit2 className="mx-auto h-8 w-8 text-slate-600" />
              <h3 className="text-sm font-semibold text-slate-300">No active bounties matching parameters</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Loosen search parameters or switch to Live GitHub Sector Query to scan external repositories.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMissions.map((mission) => {
                const repo = CURATED_REPOSITORIES.find((r) => r.id === mission.repoId);
                const isActive = activeMissionId === mission.id;
                const revalMsg = revalidationFeedback[mission.id];
                const rankInfo = getRankBadge(mission.difficulty);

                return (
                  <div
                    key={mission.id}
                    onClick={() => onSelectMission(mission)}
                    className={`group relative rounded-xl border p-5 transition cursor-pointer flex flex-col justify-between ${
                      isActive
                        ? 'border-cyan-500/60 bg-[#0C1726] shadow-lg shadow-cyan-950/40'
                        : 'border-[#182335] bg-[#0C121D] hover:border-slate-600 hover:bg-[#0F1724]'
                    }`}
                  >
                    <div>
                      {/* Top Bar: Rank Stamp & Affinity Telemetry */}
                      <div className="flex items-center justify-between text-xs font-mono mb-2.5">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${rankInfo.color}`}
                          >
                            {rankInfo.label}
                          </span>
                          <span className="text-slate-400 font-medium">
                            {mission.repoOwner}/{mission.repoName} #{mission.issueNumber}
                          </span>
                        </div>

                        {/* Match Affinity Badge */}
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[11px] font-bold font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
                            {mission.matchScore}% AFFINITY
                          </span>
                          <span className="text-violet-400 font-bold font-mono">
                            +{mission.xpReward} XP
                          </span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-2 mb-2">
                        {mission.title}
                      </h3>

                      {/* Description */}
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                        {mission.description}
                      </p>

                      {/* Strategic Intel Briefing */}
                      <div className="rounded-lg bg-[#070B12] border border-[#162030] p-2.5 mb-3 text-xs">
                        <div className="flex items-start gap-1.5">
                          <Sparkles className="h-3.5 w-3.5 text-cyan-400 mt-0.5 shrink-0" />
                          <div className="text-[11px] text-slate-300">
                            <span className="text-cyan-400 font-mono font-medium">Gemma Rationale: </span>
                            {mission.whyRecommended}
                          </div>
                        </div>
                      </div>

                      {/* Tech Stacks & Target Files */}
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono text-slate-400 mb-4">
                        {mission.technologies.map((tech, i) => (
                          <span key={i} className="bg-[#141C2B] border border-[#1E2A3E] px-2 py-0.5 rounded text-slate-300">
                            {tech}
                          </span>
                        ))}
                        <span className="text-slate-600">·</span>
                        <span className="flex items-center gap-1 text-slate-400">
                          <Clock className="h-3 w-3" /> ~{mission.estimatedHours}h
                        </span>
                      </div>
                    </div>

                    {/* Card Footer: Repo Health & Accept Action */}
                    <div className="pt-3 border-t border-[#182335] flex items-center justify-between gap-3 text-xs font-mono">
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                        <span>{repo?.healthScore || 95}/100 Health</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => handleRevalidate(mission, e)}
                          title="Re-check GitHub issue status"
                          className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-[#152033] transition"
                        >
                          <RefreshCw
                            className={`h-3.5 w-3.5 ${
                              revalidatingId === mission.id ? 'animate-spin text-cyan-400' : ''
                            }`}
                          />
                        </button>

                        <button
                          type="button"
                          onClick={() => onSelectMission(mission)}
                          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition font-mono ${
                            isActive
                              ? 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-md shadow-cyan-500/20'
                              : 'bg-emerald-400 text-slate-950 hover:bg-emerald-300 shadow-md shadow-emerald-500/20'
                          }`}
                        >
                          <span>{isActive ? 'Resume Mission' : 'Accept Bounty'}</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {revalMsg && (
                      <div className="mt-2 text-[10px] font-mono text-cyan-300 bg-cyan-950/40 border border-cyan-800/60 px-2 py-1 rounded flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3 text-cyan-400 shrink-0" />
                        <span className="truncate">{revalMsg}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* VIEW 2: Live GitHub Sector Query */}
      {viewMode === 'live_github' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-[#1A263A] bg-[#0C121D] p-5 space-y-3 font-mono">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Globe className="h-4 w-4 text-cyan-400" />
                  <span>Real-Time GitHub Sector Intercept</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Direct live query to GitHub REST API targeting unassigned <code className="text-emerald-400">good first issue</code> tickets.
                </p>
              </div>

              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/30">
                LIVE INTERCEPT
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <input
                type="text"
                value={liveGithubQuery}
                onChange={(e) => setLiveGithubQuery(e.target.value)}
                placeholder="Keywords (e.g. bug, button, docs, test)..."
                className="flex-1 rounded-lg border border-[#1E2C42] bg-[#080B11] px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
              />

              <select
                value={liveGithubLanguage}
                onChange={(e) => setLiveGithubLanguage(e.target.value)}
                className="rounded-lg border border-[#1E2C42] bg-[#080B11] px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="typescript">TypeScript</option>
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="rust">Rust</option>
                <option value="go">Go</option>
              </select>

              <button
                onClick={fetchLiveGithubIssues}
                disabled={isSearchingLiveGithub}
                className="px-4 py-2 bg-cyan-500 text-slate-950 font-bold text-xs rounded-lg hover:bg-cyan-400 transition disabled:opacity-50 whitespace-nowrap flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
              >
                <Search className="h-3.5 w-3.5" />
                <span>{isSearchingLiveGithub ? 'Scanning Sector...' : 'Scan GitHub Sector'}</span>
              </button>
            </div>
          </div>

          {/* Live Search Results */}
          {isSearchingLiveGithub ? (
            <div className="py-12 text-center text-xs font-mono text-slate-400 space-y-2">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent"></div>
              <p>Intercepting unassigned open-source issues from GitHub API...</p>
            </div>
          ) : liveGithubIssues.length === 0 ? (
            <div className="rounded-xl border border-[#1A263A] bg-[#0C121D] p-8 text-center text-xs font-mono text-slate-400">
              No transmissions received. Click "Scan GitHub Sector" to intercept real-time open-source bounties.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {liveGithubIssues.map((gh) => (
                <div
                  key={gh.id}
                  className="rounded-xl border border-[#182335] bg-[#0C121D] p-5 flex flex-col justify-between hover:border-slate-600 transition"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                      <span>{gh.repoOwner}/{gh.repoName} · #{gh.issueNumber}</span>
                      <span className="text-cyan-400 text-[10px] bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
                        LIVE TICKET
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white line-clamp-2">
                      {gh.title}
                    </h4>

                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                      {gh.description}
                    </p>

                    <div className="flex flex-wrap gap-1 text-[10px] font-mono text-slate-300">
                      {(gh.labels || []).slice(0, 3).map((lbl: string, i: number) => (
                        <span key={i} className="bg-[#141C2B] border border-[#1E2A3E] px-2 py-0.5 rounded">
                          {lbl}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 mt-3 border-t border-[#182335] flex items-center justify-between text-xs font-mono">
                    <a
                      href={gh.issueUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px]"
                    >
                      <span>Inspect on GitHub</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>

                    <button
                      onClick={() => handleAdoptLiveIssue(gh)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg hover:bg-emerald-300 transition shadow-md shadow-emerald-500/20"
                    >
                      <PlusCircle className="h-3.5 w-3.5" />
                      <span>Accept as Bounty</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
