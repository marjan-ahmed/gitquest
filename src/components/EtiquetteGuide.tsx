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
      <div className="rounded-xl border border-slate-800 bg-[#0A0F1D] p-6 shadow-xl relative overflow-hidden bg-grid-pattern">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <ShieldCheck className="h-4 w-4" />
              <span>RULES OF ENGAGEMENT // OSS REPUTATION PROTOCOL</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-mono text-white tracking-tight">
              Maintainer Etiquette & Karma Codex
            </h1>
            <p className="text-xs text-slate-300 leading-relaxed">
              Open source is fueled by volunteer maintainers balancing demanding careers and families. Contributors who respect etiquette earn fast reviews, maintainer mentorship, and career-defining recommendations.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-[#0D1322] p-5 text-center shrink-0 min-w-[180px]">
            <span className="text-[10px] font-mono tracking-wider text-slate-400 block mb-1">
              CONTRIBUTOR KARMA
            </span>
            <div className="text-3xl font-bold font-mono text-emerald-400 tabular-nums">
              {userProfile.etiquetteScore}/100
            </div>
            <span className="text-[10px] font-mono text-cyan-400 block mt-1">
              {userProfile.etiquetteScore >= 90 ? 'STATUS: HIGH TRUST' : 'STATUS: RELIABLE'}
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Scenario Simulator */}
      <div className="rounded-xl border border-cyan-500/30 bg-[#0D1322] p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <Terminal className="h-4 w-4" />
            <span>ETIQUETTE COMBAT DRILL // SIMULATED MAINTAINER DILEMMA</span>
          </div>
          <div className="flex items-center gap-2">
            {scenarios.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSelectedScenarioIndex(idx);
                  setUserChoice(null);
                }}
                className={`px-2.5 py-1 text-[11px] font-mono rounded ${
                  selectedScenarioIndex === idx
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                Drill 0{idx + 1}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white font-mono">{currentScenario.title}</h3>
          <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-lg border border-slate-800">
            {currentScenario.prompt}
          </p>

          {/* Options */}
          <div className="space-y-2 pt-2">
            {currentScenario.options.map((opt, optIdx) => {
              const isSelected = userChoice === optIdx;
              return (
                <button
                  key={optIdx}
                  onClick={() => setUserChoice(optIdx)}
                  className={`w-full text-left p-3.5 rounded-lg border text-xs font-mono transition flex items-start gap-3 ${
                    isSelected
                      ? opt.isCorrect
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-200'
                        : 'border-rose-500 bg-rose-500/10 text-rose-200'
                      : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-slate-800 text-[10px] font-bold">
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <div className="space-y-1.5 flex-1">
                    <div>{opt.text}</div>
                    {isSelected && (
                      <div
                        className={`text-[11px] font-sans p-2 rounded ${
                          opt.isCorrect
                            ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30'
                            : 'bg-rose-950/40 text-rose-300 border border-rose-500/30'
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
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span>THE 5 CARDINAL DIRECTIVES</span>
        </div>

        {ETIQUETTE_RULES.map((rule, idx) => (
          <div
            key={rule.id}
            className="rounded-xl border border-slate-800 bg-[#0E1526] p-5 space-y-3"
          >
            <div className="flex items-center gap-2.5">
              <span className="flex h-6 w-6 items-center justify-center rounded bg-slate-800 text-xs font-mono font-bold text-emerald-400 border border-slate-700">
                0{idx + 1}
              </span>
              <h3 className="text-sm font-bold font-mono text-white">{rule.title}</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed pl-8">
              {rule.guidance}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-8 pt-1">
              <div className="p-3 rounded-lg border border-emerald-500/30 bg-emerald-500/5 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-emerald-400">
                  <Check className="h-3.5 w-3.5" />
                  <span>RECOMMENDED WAY (DO)</span>
                </div>
                <p className="text-xs text-slate-300 italic font-mono text-[11px]">
                  "{rule.doExample}"
                </p>
              </div>

              <div className="p-3 rounded-lg border border-rose-500/30 bg-rose-500/5 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-rose-400">
                  <X className="h-3.5 w-3.5" />
                  <span>DISCOURAGED BEHAVIOR (DON'T)</span>
                </div>
                <p className="text-xs text-slate-300 italic font-mono text-[11px]">
                  "{rule.dontExample}"
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* GitQuest Contributor Pledge Seal */}
      <div className="rounded-xl border border-emerald-500/40 bg-gradient-to-r from-emerald-950/30 via-slate-900 to-[#0B1120] p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <Award className="h-4 w-4" />
              <span>THE GITQUEST CONTRIBUTOR PLEDGE</span>
            </div>
            <h3 className="text-lg font-bold text-white">
              Commit to High-Signal Open-Source Collaboration
            </h3>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              "I pledge to verify issue eligibility before coding, respect maintainer time by keeping pull requests scoped and clean, provide reproduction steps for all bug fixes, and treat open-source maintainers as valued community members."
            </p>
          </div>

          <div className="shrink-0">
            {pledged ? (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold">
                <CheckCircle2 className="h-4 w-4" />
                <span>PLEDGE SIGNED & VERIFIED</span>
              </div>
            ) : (
              <button
                onClick={handlePledge}
                className="flex items-center gap-2 px-5 py-3 rounded-lg bg-emerald-400 text-slate-950 font-mono font-bold text-xs hover:bg-emerald-300 transition shadow-lg shadow-emerald-500/20 active:scale-[0.99]"
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
