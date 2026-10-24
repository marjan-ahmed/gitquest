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
        return <Compass className="h-5 w-5 text-emerald-600" />;
      case 'ShieldCheck':
        return <ShieldCheck className="h-5 w-5 text-sky-600" />;
      case 'FolderGit2':
        return <FolderGit2 className="h-5 w-5 text-amber-600" />;
      case 'Layers':
        return <Layers className="h-5 w-5 text-violet-600" />;
      case 'GitPullRequest':
        return <GitPullRequest className="h-5 w-5 text-emerald-600" />;
      case 'Flame':
        return <Flame className="h-5 w-5 text-rose-600" />;
      default:
        return <Trophy className="h-5 w-5 text-amber-600" />;
    }
  };

  return (
    <div className="space-y-6 py-2">
      {/* Contributor Dossier Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm bg-grid-pattern relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Avatar and Identity */}
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <img
                src={profile.avatarUrl}
                alt={profile.githubUsername}
                referrerPolicy="no-referrer"
                className="h-20 w-20 rounded-2xl border-2 border-emerald-300 object-cover shadow-sm"
              />
              <div className="absolute -bottom-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 border-2 border-white text-xs font-mono text-white font-bold shadow-xs">
                {levelInfo.level}
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold font-mono text-slate-900 tracking-tight">
                  @{profile.githubUsername}
                </h1>
                <span className="text-[10px] font-mono text-emerald-800 font-bold bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md">
                  {levelInfo.title.toUpperCase()}
                </span>
                <span className="text-[10px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                  RANK {levelInfo.level}
                </span>
              </div>

              <p className="text-xs text-slate-600 max-w-md leading-relaxed">
                {profile.summary || 'Contributor profile synthesized with Gemma AI engine.'}
              </p>

              <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-slate-500 pt-1">
                <span>
                  Target Difficulty: <strong className="text-emerald-700">{profile.suggestedDifficulty}</strong>
                </span>
                <span className="text-slate-300">·</span>
                <span>
                  Goal: <strong className="text-sky-700">{profile.mainGoal.replace('_', ' ')}</strong>
                </span>
                <span className="text-slate-300">·</span>
                <a
                  href={`https://github.com/${profile.githubUsername}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-600 hover:text-slate-900 flex items-center gap-1 transition font-medium"
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
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-mono text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition shadow-2xs cursor-pointer"
            >
              <Edit3 className="h-3.5 w-3.5 text-sky-600" />
              <span>Recalibrate Profile</span>
            </button>

            {onLogout && (
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-rose-200 bg-rose-50 text-xs font-mono text-rose-700 hover:bg-rose-100 transition cursor-pointer"
                title="Reset session and log out"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Eject Session</span>
              </button>
            )}
          </div>
        </div>

        {/* Level Progression Progress Bar */}
        <div className="mt-6 pt-5 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-600">
              PROGRESSION TO {levelInfo.nextLevel ? `LEVEL ${levelInfo.nextLevel.level} (${levelInfo.nextLevel.title})` : 'MAX RANK'}
            </span>
            <span className="text-emerald-700 font-bold tabular-nums">
              {profile.totalXp} XP / {levelInfo.nextLevel ? `${levelInfo.nextLevel.minXp} XP` : 'MAX'} ({Math.round(levelInfo.progress)}%)
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden border border-slate-200">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 transition-all duration-500"
              style={{ width: `${levelInfo.progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Eject / Log Out */}
      {showLogoutConfirm && (
        <div className="p-4 rounded-2xl border border-rose-200 bg-rose-50/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldAlert className="h-5 w-5 text-rose-600 shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-slate-900 block">Confirm session ejection?</span>
              <span className="text-slate-600">This will reset your local profile data so you can restart the full onboarding journey from scratch.</span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowLogoutConfirm(false)}
              className="px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-mono text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setShowLogoutConfirm(false);
                onLogout?.();
              }}
              className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-mono font-semibold text-xs transition cursor-pointer shadow-sm"
            >
              Confirm Eject
            </button>
          </div>
        </div>
      )}

      {/* 2-Column Telemetry & Capabilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Demonstrated vs Claimed Capabilities Matrix */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 text-xs font-mono text-sky-700 font-semibold">
              <Cpu className="h-4 w-4 text-sky-600" />
              <span>CAPABILITIES INTEL MATRIX</span>
            </div>
            <span className="text-[10px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-medium">
              GEMMA PROFILED
            </span>
          </div>

          {/* Demonstrated in GitHub */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>Demonstrated in Public Repositories</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                VERIFIED
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {profile.skillsDemonstrated.length > 0 ? (
                profile.skillsDemonstrated.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono text-xs font-semibold"
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
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Compass className="h-3.5 w-3.5 text-sky-600" />
              <span>Self-Reported / Preferred Technologies</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {profile.skillsClaimed.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-700 font-mono text-xs"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed pt-1">
            Gemma uses this distinction to calculate mission affinity, matching you with challenges where you can succeed while safely expanding into claimed target skills.
          </p>
        </div>

        {/* OSS Maintainer Etiquette & Reputation Standing */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 font-semibold">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>MAINTAINER ETIQUETTE INDEX</span>
            </div>
            <span className="text-xs font-mono text-emerald-700 font-bold">
              {profile.etiquetteScore}/100 KARMA
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">Maintainer Trust Standing</span>
              <span className="font-mono text-emerald-700 font-bold">
                {profile.etiquetteScore >= 90 ? 'EXEMPLARY' : 'RELIABLE'}
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden border border-slate-200">
              <div
                className="h-full bg-emerald-500"
                style={{ width: `${profile.etiquetteScore}%` }}
              />
            </div>

            <div className="space-y-2.5 pt-2 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span>Zero unsolicited "@mention" or pinging policy</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span>Unassigned issue verification before claiming</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span>Clean PR diffs with reproduction test instructions</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Service Badges & Medals Showcase */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-700 font-semibold">
            <Award className="h-4 w-4 text-amber-600" />
            <span>SERVICE MEDALS & ACHIEVEMENTS</span>
          </div>
          <span className="text-xs font-mono text-slate-500 font-medium">
            {profile.badges.length} / {BADGES.length} UNLOCKED
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {BADGES.map((b) => {
            const isUnlocked = profile.badges.includes(b.id);
            return (
              <div
                key={b.id}
                className={`p-4 rounded-xl border flex items-start gap-3.5 transition ${
                  isUnlocked
                    ? 'border-slate-200 bg-slate-50/60 shadow-2xs'
                    : 'border-slate-200/60 bg-slate-50/20 opacity-45'
                }`}
              >
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${
                    isUnlocked
                      ? 'border-emerald-200 bg-emerald-50'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  {getBadgeIcon(b.iconName)}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-xs font-bold text-slate-900">{b.title}</h4>
                    {isUnlocked && (
                      <span className="text-[9px] font-mono font-bold text-emerald-700 bg-emerald-100/70 border border-emerald-200 px-1.5 py-0.5 rounded">
                        +{b.xpBonus} XP
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    {b.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Contributor Mission Flight Log */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-xs font-mono text-sky-700 font-semibold">
            <Terminal className="h-4 w-4 text-sky-600" />
            <span>MISSION FLIGHT LOGS</span>
          </div>
          <span className="text-xs font-mono text-slate-500 font-medium">
            {completedMissions.length} COMPLETED
          </span>
        </div>

        {completedMissions.length > 0 ? (
          <div className="space-y-2.5">
            {completedMissions.map((m) => (
              <div
                key={m.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{m.title}</span>
                    <span className="text-[10px] font-mono text-emerald-800 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                      MERGED / COMPLETE
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500">
                    <span>{m.repoOwner}/{m.repoName}#{m.issueNumber}</span>
                    <span>+{m.xpReward} XP</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectMission(m)}
                    className="px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-mono text-slate-700 hover:text-slate-900 hover:bg-slate-50 shadow-2xs cursor-pointer"
                  >
                    View Debrief
                  </button>
                  <a
                    href={m.issueUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-800 shadow-2xs"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-xl border-2 border-dashed border-slate-200 text-center space-y-2">
            <Clock className="h-8 w-8 text-slate-400 mx-auto" />
            <div className="text-xs font-bold text-slate-800">No missions logged as completed yet</div>
            <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
              Select an open mission from the Bounty Board to start working through the 8-step flight deck with Gemma.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
