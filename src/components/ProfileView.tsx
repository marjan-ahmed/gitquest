import React, { useState } from 'react';
import {
  Trophy,
  Flame,
  ShieldCheck,
  Compass,
  Layers,
  GitPullRequest,
  Sparkles,
  ExternalLink,
  Edit3,
  CheckCircle2,
  FolderGit2,
  LogOut,
  Target,
  Award,
  Cpu,
  Clock,
  ArrowRight,
  ShieldAlert,
  Terminal,
} from 'lucide-react';
import { UserProfile, Badge, Mission } from '../types';
import { BADGES } from '../data/curatedData';
import { calculateLevel } from '../services/storage';

interface ProfileViewProps {
  profile: UserProfile;
  allMissions: Mission[];
  onOpenOnboarding: () => void;
  onSelectMission: (mission: Mission) => void;
  onLogout?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  allMissions,
  onOpenOnboarding,
  onSelectMission,
  onLogout,
}) => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const levelInfo = calculateLevel(profile.totalXp);
  const completedMissions = allMissions.filter((m) =>
    profile.completedMissionIds.includes(m.id)
  );

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Compass':
        return <Compass className="h-5 w-5 text-emerald-400" />;
      case 'ShieldCheck':
        return <ShieldCheck className="h-5 w-5 text-cyan-400" />;
      case 'FolderGit2':
        return <FolderGit2 className="h-5 w-5 text-amber-400" />;
      case 'Layers':
        return <Layers className="h-5 w-5 text-violet-400" />;
      case 'GitPullRequest':
        return <GitPullRequest className="h-5 w-5 text-emerald-400" />;
      case 'Flame':
        return <Flame className="h-5 w-5 text-rose-400" />;
      default:
        return <Trophy className="h-5 w-5 text-amber-400" />;
    }
  };

  return (
    <div className="space-y-6 py-2">
      {/* Contributor Dossier Header */}
      <div className="rounded-xl border border-slate-800 bg-[#0A0F1D] p-6 shadow-xl bg-grid-pattern relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Avatar and Identity */}
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <img
                src={profile.avatarUrl}
                alt={profile.githubUsername}
                referrerPolicy="no-referrer"
                className="h-20 w-20 rounded-xl border-2 border-emerald-500/50 object-cover shadow-lg shadow-emerald-500/20"
              />
              <div className="absolute -bottom-2 -right-2 flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 border border-emerald-400 text-xs font-mono text-emerald-400 font-bold shadow">
                {levelInfo.level}
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold font-mono text-white tracking-tight">
                  @{profile.githubUsername}
                </h1>
                <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded">
                  {levelInfo.title.toUpperCase()}
                </span>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
                  RANK {levelInfo.level}
                </span>
              </div>

              <p className="text-xs text-slate-400 max-w-md leading-relaxed">
                {profile.summary || 'Contributor profile synthesized with Gemma AI engine.'}
              </p>

              <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-slate-400 pt-1">
                <span>
                  Target Difficulty: <strong className="text-emerald-400">{profile.suggestedDifficulty}</strong>
                </span>
                <span className="text-slate-600">·</span>
                <span>
                  Goal: <strong className="text-cyan-400">{profile.mainGoal.replace('_', ' ')}</strong>
                </span>
                <span className="text-slate-600">·</span>
                <a
                  href={`https://github.com/${profile.githubUsername}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-400 hover:text-white flex items-center gap-1 transition"
                >
                  <span>GitHub Profile</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Action Hub */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={onOpenOnboarding}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-700 bg-slate-900 text-xs font-mono text-slate-200 hover:text-white hover:border-slate-600 transition"
            >
              <Edit3 className="h-3.5 w-3.5 text-cyan-400" />
              <span>Recalibrate Profile</span>
            </button>

            {onLogout && (
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-rose-500/30 bg-rose-500/10 text-xs font-mono text-rose-400 hover:bg-rose-500/20 transition"
                title="Reset session and log out"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Eject Session</span>
              </button>
            )}
          </div>
        </div>

        {/* Level Progression Progress Bar */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">
              PROGRESSION TO {levelInfo.nextLevel ? `LEVEL ${levelInfo.nextLevel.level} (${levelInfo.nextLevel.title})` : 'MAX RANK'}
            </span>
            <span className="text-emerald-400 font-bold tabular-nums">
              {profile.totalXp} XP / {levelInfo.nextLevel ? `${levelInfo.nextLevel.minXp} XP` : 'MAX'} ({Math.round(levelInfo.progress)}%)
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-950 overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-500 transition-all duration-500"
              style={{ width: `${levelInfo.progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Eject / Log Out */}
      {showLogoutConfirm && (
        <div className="p-4 rounded-xl border border-rose-500/40 bg-rose-950/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldAlert className="h-5 w-5 text-rose-400 shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-white block">Confirm session ejection?</span>
              <span className="text-slate-400">This will reset your local profile data so you can restart the full onboarding journey from scratch.</span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowLogoutConfirm(false)}
              className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-xs font-mono text-slate-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setShowLogoutConfirm(false);
                onLogout?.();
              }}
              className="px-3.5 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-400 text-slate-950 font-mono font-bold text-xs transition"
            >
              Confirm Eject
            </button>
          </div>
        </div>
      )}

      {/* 2-Column Telemetry & Capabilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Demonstrated vs Claimed Capabilities Matrix */}
        <div className="rounded-xl border border-slate-800 bg-[#0D1322] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <Cpu className="h-4 w-4" />
              <span>CAPABILITIES INTEL MATRIX</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              GEMMA PROFILED
            </span>
          </div>

          {/* Demonstrated in GitHub */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>Demonstrated in Public Repositories</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">VERIFIED</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {profile.skillsDemonstrated.length > 0 ? (
                profile.skillsDemonstrated.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-bold"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-500 italic">No public code verified yet</span>
              )}
            </div>
          </div>

          {/* Claimed in Assessment */}
          <div className="space-y-2 pt-2 border-t border-slate-800/60">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Compass className="h-3.5 w-3.5 text-cyan-400" />
              <span>Self-Reported / Preferred Technologies</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {profile.skillsClaimed.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-slate-300 font-mono text-xs"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
            Gemma uses this distinction to calculate mission affinity, matching you with challenges where you can succeed while safely expanding into claimed target skills.
          </p>
        </div>

        {/* OSS Maintainer Etiquette & Reputation Standing */}
        <div className="rounded-xl border border-slate-800 bg-[#0D1322] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <ShieldCheck className="h-4 w-4" />
              <span>MAINTAINER ETIQUETTE INDEX</span>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-bold">
              {profile.etiquetteScore}/100 KARMA
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300">Maintainer Trust Standing</span>
              <span className="font-mono text-emerald-400 font-bold">
                {profile.etiquetteScore >= 90 ? 'EXEMPLARY' : 'RELIABLE'}
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-950 overflow-hidden border border-slate-800">
              <div
                className="h-full bg-emerald-400"
                style={{ width: `${profile.etiquetteScore}%` }}
              />
            </div>

            <div className="space-y-2 pt-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>Zero unsolicited "@mention" or pinging policy</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>Unassigned issue verification before claiming</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>Clean PR diffs with reproduction test instructions</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Service Badges & Medals Showcase */}
      <div className="rounded-xl border border-slate-800 bg-[#0A0F1D] p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
            <Award className="h-4 w-4" />
            <span>SERVICE MEDALS & ACHIEVEMENTS</span>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {profile.badges.length} / {BADGES.length} UNLOCKED
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {BADGES.map((b) => {
            const isUnlocked = profile.badges.includes(b.id);
            return (
              <div
                key={b.id}
                className={`p-3.5 rounded-xl border flex items-start gap-3 transition ${
                  isUnlocked
                    ? 'border-slate-700 bg-[#0D1322]'
                    : 'border-slate-800/60 bg-slate-950/40 opacity-50'
                }`}
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${
                    isUnlocked
                      ? 'border-emerald-500/30 bg-emerald-500/10'
                      : 'border-slate-800 bg-slate-900'
                  }`}
                >
                  {getBadgeIcon(b.iconName)}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-xs font-bold text-white">{b.title}</h4>
                    {isUnlocked && (
                      <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                        +{b.xpBonus} XP
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    {b.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Contributor Mission Flight Log */}
      <div className="rounded-xl border border-slate-800 bg-[#0A0F1D] p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <Terminal className="h-4 w-4" />
            <span>MISSION FLIGHT LOGS</span>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {completedMissions.length} COMPLETED
          </span>
        </div>

        {completedMissions.length > 0 ? (
          <div className="space-y-2">
            {completedMissions.map((m) => (
              <div
                key={m.id}
                className="p-3.5 rounded-lg border border-slate-800 bg-[#0D1322] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{m.title}</span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
                      MERGED / COMPLETE
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
                    <span>{m.repoOwner}/{m.repoName}#{m.issueNumber}</span>
                    <span>+{m.xpReward} XP</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectMission(m)}
                    className="px-3 py-1.5 rounded border border-slate-700 bg-slate-800 text-xs font-mono text-slate-200 hover:text-white"
                  >
                    View Debrief
                  </button>
                  <a
                    href={m.issueUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded border border-slate-800 bg-slate-900 text-slate-400 hover:text-white"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 rounded-lg border border-dashed border-slate-800 text-center space-y-2">
            <Clock className="h-6 w-6 text-slate-600 mx-auto" />
            <div className="text-xs font-bold text-slate-300">No missions logged as completed yet</div>
            <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
              Select an open mission from the Bounty Board to start working through the 8-step flight deck with Gemma.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
