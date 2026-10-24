import React, { useState } from 'react';
import {
  ShieldCheck,
  Check,
  X,
  AlertCircle,
  Heart,
  MessageSquare,
  GitCommit,
  GitBranch,
  Terminal,
  Award,
  Sparkles,
  HelpCircle,
  CheckCircle2,
} from 'lucide-react';
import { ETIQUETTE_RULES } from '../data/curatedData';
import { UserProfile } from '../types';
import { saveStoredProfile } from '../services/storage';

interface EtiquetteGuideProps {
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
}

export const EtiquetteGuide: React.FC<EtiquetteGuideProps> = ({ userProfile, onUpdateProfile }) => {
  const [pledged, setPledged] = useState(userProfile.badges.includes('badge-etiquette-scholar'));
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);
  const [userChoice, setUserChoice] = useState<number | null>(null);

  const scenarios = [
    {
      title: 'Scenario: Stale Issue with Incomplete Discussion',
      prompt: 'You found an unassigned issue created 5 months ago. Another developer left a comment 3 months ago saying "I am looking into this" but never opened a PR or updated again. How do you proceed?',
      options: [
        {
          text: 'Immediately open a pull request without commenting, racing to get it merged before anyone notices.',
          isCorrect: false,
          explanation: 'Maintainers find unexpected PRs on dormant discussions difficult to triage. Someone might still be working locally or the issue scope might have evolved.',
        },
        {
          text: 'Leave a polite, specific comment asking if the issue is still available and outlining your proposed 2-sentence solution.',
          isCorrect: true,
          explanation: 'Exemplary conduct! Asking courteously while offering a concrete plan proves you understand the problem without wasting maintainer time.',
        },
        {
          text: 'Post "@maintainer @contributor please assign this to me urgent!!"',
          isCorrect: false,
          explanation: 'Pinging maintainers urgently and demanding assignment is the #1 complaint of open source maintainers.',
        },
      ],
    },
    {
      title: 'Scenario: Incidental Formatting and Refactoring',
      prompt: 'While fixing a bug on line 42 of a file, you notice lines 1-100 have inconsistent indentation and could be modernized with new syntax. What should your pull request contain?',
      options: [
        {
          text: 'Reformat the entire file with Prettier to make it clean alongside your 1-line fix.',
          isCorrect: false,
          explanation: 'This creates massive git diff noise, breaks git blame history for past contributors, and makes review exhausting.',
        },
        {
          text: 'Only touch the lines directly relevant to the bug fix. Keep git diff minimal and atomic.',
          isCorrect: true,
          explanation: 'Perfect! Maintainers love minimal, focused diffs that can be reviewed in under 3 minutes.',
        },
        {
          text: 'Add a new dependencies package and rewrite the file into TypeScript.',
          isCorrect: false,
          explanation: 'Unsolicited architectural changes on a bug ticket will be summarily closed.',
        },
      ],
    },
  ];

  const currentScenario = scenarios[selectedScenarioIndex];

  const handlePledge = () => {
    const updated: UserProfile = {
      ...userProfile,
      etiquetteScore: Math.min(100, Math.max(95, userProfile.etiquetteScore + 8)),
      totalXp: userProfile.totalXp + 50,
      badges: userProfile.badges.includes('badge-etiquette-scholar')
        ? userProfile.badges
        : [...userProfile.badges, 'badge-etiquette-scholar'],
    };
    saveStoredProfile(updated);
    onUpdateProfile(updated);
    setPledged(true);
  };

  return (
    <div className="space-y-6 py-2">
      {/* Header Dossier */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm relative overflow-hidden bg-grid-pattern">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 font-semibold">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>COMMUNITY STANDARDS // OSS REPUTATION PROTOCOL</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-mono text-slate-900 tracking-tight">
              Maintainer Etiquette & Karma Codex
            </h1>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Open source is fueled by volunteer maintainers balancing demanding careers and families. Contributors who respect etiquette earn fast reviews, maintainer mentorship, and career-defining recommendations.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center shrink-0 min-w-[180px] shadow-2xs">
            <span className="text-[10px] font-mono tracking-wider text-slate-500 block mb-1 font-semibold">
              CONTRIBUTOR KARMA
            </span>
            <div className="text-3xl font-bold font-mono text-emerald-700 tabular-nums">
              {userProfile.etiquetteScore}/100
            </div>
            <span className="text-[10px] font-mono text-sky-800 font-semibold block mt-1">
              {userProfile.etiquetteScore >= 90 ? 'STATUS: HIGH TRUST' : 'STATUS: RELIABLE'}
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Scenario Simulator */}
      <div className="rounded-2xl border border-sky-200 bg-sky-50/40 p-6 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-sky-200/80 pb-3">
          <div className="flex items-center gap-2 text-xs font-mono text-sky-800 font-semibold">
            <Terminal className="h-4 w-4 text-sky-600" />
            <span>ETIQUETTE DRILL // SIMULATED MAINTAINER DILEMMA</span>
          </div>
          <div className="flex items-center gap-2">
            {scenarios.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSelectedScenarioIndex(idx);
                  setUserChoice(null);
                }}
                className={`px-3 py-1 text-[11px] font-mono rounded-lg transition cursor-pointer ${
                  selectedScenarioIndex === idx
                    ? 'bg-sky-600 text-white font-semibold shadow-2xs'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                Drill 0{idx + 1}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 font-mono">{currentScenario.title}</h3>
          <p className="text-xs text-slate-700 leading-relaxed bg-white p-4 rounded-xl border border-sky-200/80 shadow-2xs">
            {currentScenario.prompt}
          </p>

          {/* Options */}
          <div className="space-y-2 pt-1">
            {currentScenario.options.map((opt, optIdx) => {
              const isSelected = userChoice === optIdx;
              return (
                <button
                  key={optIdx}
                  onClick={() => setUserChoice(optIdx)}
                  className={`w-full text-left p-4 rounded-xl border text-xs font-mono transition flex items-start gap-3 cursor-pointer ${
                    isSelected
                      ? opt.isCorrect
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-medium shadow-2xs'
                        : 'border-rose-400 bg-rose-50 text-rose-950 shadow-2xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-slate-100 text-[10px] font-bold text-slate-700">
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <div className="space-y-1.5 flex-1">
                    <div>{opt.text}</div>
                    {isSelected && (
                      <div
                        className={`text-[11px] font-sans p-2.5 rounded-lg ${
                          opt.isCorrect
                            ? 'bg-white text-emerald-900 border border-emerald-300 shadow-2xs'
                            : 'bg-white text-rose-900 border border-rose-300 shadow-2xs'
                        }`}
                      >
                        <strong>{opt.isCorrect ? 'Maintainer Approved: ' : 'Maintainer Friction: '}</strong>
                        {opt.explanation}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Rules Dossier Cards */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-500 font-semibold">
          <span>THE 5 CARDINAL DIRECTIVES</span>
        </div>

        {ETIQUETTE_RULES.map((rule, idx) => (
          <div
            key={rule.id}
            className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3 shadow-2xs"
          >
            <div className="flex items-center gap-2.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-50 text-xs font-mono font-bold text-emerald-800 border border-emerald-200">
                0{idx + 1}
              </span>
              <h3 className="text-sm font-bold font-mono text-slate-900">{rule.title}</h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed pl-8 font-normal">
              {rule.guidance}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-8 pt-1">
              <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/60 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-emerald-800">
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span>RECOMMENDED WAY (DO)</span>
                </div>
                <p className="text-xs text-slate-700 italic font-mono text-[11px]">
                  "{rule.doExample}"
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/60 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-rose-800">
                  <X className="h-3.5 w-3.5 text-rose-600" />
                  <span>DISCOURAGED BEHAVIOR (DON'T)</span>
                </div>
                <p className="text-xs text-slate-700 italic font-mono text-[11px]">
                  "{rule.dontExample}"
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* GitQuest Contributor Pledge Seal */}
      <div className="rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-teal-50/40 to-white p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 font-semibold">
              <Award className="h-4 w-4 text-emerald-600" />
              <span>THE GITQUEST CONTRIBUTOR PLEDGE</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Commit to High-Signal Open-Source Collaboration
            </h3>
            <p className="text-xs text-slate-600 max-w-xl leading-relaxed">
              "I pledge to verify issue eligibility before coding, respect maintainer time by keeping pull requests scoped and clean, provide reproduction steps for all bug fixes, and treat open-source maintainers as valued community members."
            </p>
          </div>

          <div className="shrink-0">
            {pledged ? (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-100/70 border border-emerald-300 text-emerald-800 text-xs font-mono font-bold shadow-2xs">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>PLEDGE SIGNED & VERIFIED</span>
              </div>
            ) : (
              <button
                onClick={handlePledge}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 text-white font-mono font-semibold text-xs hover:bg-emerald-500 transition shadow-sm cursor-pointer active:scale-[0.99]"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Sign Pledge (+50 XP)</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
