import React, { useState, useEffect, useRef } from 'react';
import {
  CheckCircle2,
  Circle,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
  Send,
  Sparkles,
  HelpCircle,
  Copy,
  Check,
  GitBranch,
  FileCode,
  Terminal,
  Trophy,
  AlertTriangle,
  Lightbulb,
  Radio,
  Target,
  Cpu,
  Flame,
} from 'lucide-react';
import { Mission, MissionProgress, MentorChatMessage } from '../types';
import {
  getMissionProgress,
  updateMissionProgress,
  awardXpAndBadges,
} from '../services/storage';

interface MissionWorkspaceProps {
  mission: Mission;
  onMissionCompleted: (xpEarned: number) => void;
  onBackToExplorer: () => void;
}

const STAGES = [
  { id: 1, name: '01. Recon & Verify', short: 'Recon' },
  { id: 2, name: '02. Understand', short: 'Deconstruct' },
  { id: 3, name: '03. Explore Code', short: 'Infiltrate' },
  { id: 4, name: '04. Plan Vector', short: 'Battle Plan' },
  { id: 5, name: '05. Code & Intel', short: 'Engagement' },
  { id: 6, name: '06. Verify Tests', short: 'Drill' },
  { id: 7, name: '07. PR Dispatch', short: 'Dispatch' },
  { id: 8, name: '08. Maintainer Debrief', short: 'Debrief & XP' },
];

export const MissionWorkspace: React.FC<MissionWorkspaceProps> = ({
  mission,
  onMissionCompleted,
  onBackToExplorer,
}) => {
  const [progress, setProgress] = useState<MissionProgress>(() => getMissionProgress(mission.id));
  const [activeStage, setActiveStage] = useState<number>(progress.currentStage || 1);

  // Gemma Chat State
  const [chatMessages, setChatMessages] = useState<MentorChatMessage[]>([
    {
      id: 'welcome',
      sender: 'gemma',
      text: `Tactical link established. I'm Gemma, your open-source co-pilot on **${mission.repoName}** #${mission.issueNumber}.\n\nOur objective: Understand the root cause, identify the exact code target, and submit a maintainer-ready pull request without noise. What Intel do you need first?`,
      timestamp: 'Active',
      suggestedPrompts: [
        '[Recon] Explain this issue in simple terms',
        '[Infiltrate] Where in the repository should I look?',
        '[Protocol] What etiquette rules apply to this project?',
      ],
      etiquetteTip: 'Maintainer respect is paramount: Never comment "+1" or "assign me" without proposing a concrete solution approach.',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // PR Generator state
  const [isGeneratingPr, setIsGeneratingPr] = useState(false);
  const [copiedPr, setCopiedPr] = useState(false);

  // Maintainer Feedback Simulation
  const [isSimulatingReview, setIsSimulatingReview] = useState(false);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleStageChange = (newStage: number) => {
    setActiveStage(newStage);
    const updated = {
      ...progress,
      currentStage: Math.max(progress.currentStage, newStage),
    };
    setProgress(updated);
    updateMissionProgress(updated);
  };

  const handleChecklistToggle = (stageNum: number, itemIndex: number) => {
    const stageItems = [...(progress.stageChecklists[stageNum] || [])];
    stageItems[itemIndex] = !stageItems[itemIndex];
    const updated = {
      ...progress,
      stageChecklists: {
        ...progress.stageChecklists,
        [stageNum]: stageItems,
      },
    };
    setProgress(updated);
    updateMissionProgress(updated);
  };

  const handleUnlockHint = (level: number) => {
    const updated = {
      ...progress,
      unlockedHintLevel: Math.max(progress.unlockedHintLevel, level),
    };
    setProgress(updated);
    updateMissionProgress(updated);
  };

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim() || isSending) return;

    const userMsg: MentorChatMessage = {
      id: String(Date.now()),
      sender: 'user',
      text: textToSend,
      timestamp: 'Now',
    };
    setChatMessages((prev) => [...prev, userMsg]);
    if (!customText) setInputMessage('');
    setIsSending(true);

    try {
      const res = await fetch('/api/mentor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          missionContext: {
            repoName: mission.repoName,
            repoOwner: mission.repoOwner,
            issueNumber: mission.issueNumber,
            title: mission.title,
            description: mission.description,
            keyFiles: mission.keyFiles,
          },
          currentStage: activeStage,
          history: chatMessages.slice(-4),
        }),
      });

      const data = await res.json();
      const gemmaMsg: MentorChatMessage = {
        id: String(Date.now() + 1),
        sender: 'gemma',
        text: data.reply,
        timestamp: 'Now',
        etiquetteTip: activeStage >= 6 ? 'Keep your PR diff clean and limited only to changes solving this issue.' : undefined,
      };
      setChatMessages((prev) => [...prev, gemmaMsg]);
    } catch {
      const fallbackMsg: MentorChatMessage = {
        id: String(Date.now() + 1),
        sender: 'gemma',
        text: `Tactical advice for Stage ${activeStage}: Follow the checklist, create an isolated branch \`git checkout -b fix/${mission.repoName}-issue-${mission.issueNumber}\`, and verify your changes with local tests.`,
        timestamp: 'Now',
      };
      setChatMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsSending(false);
    }
  };

  const handleGeneratePr = async () => {
    setIsGeneratingPr(true);
    try {
      const res = await fetch('/api/mentor/generate-pr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          missionTitle: mission.title,
          issueNumber: mission.issueNumber,
          repoName: mission.repoName,
          solutionNotes: progress.solutionNotes,
          filesChanged: mission.keyFiles.join(', '),
        }),
      });
      const data = await res.json();
      if (data.pr) {
        const updated = {
          ...progress,
          draftPr: {
            branchName: data.pr.suggestedBranch || `fix/issue-${mission.issueNumber}`,
            title: data.pr.title || `fix: resolve issue #${mission.issueNumber}`,
            body: data.pr.body || '',
          },
        };
        setProgress(updated);
        updateMissionProgress(updated);
      }
    } catch {
      // Handled
    } finally {
      setIsGeneratingPr(false);
    }
  };

  const handleSimulateReview = () => {
    setIsSimulatingReview(true);
    setTimeout(() => {
      const updated = {
        ...progress,
        maintainerFeedback: {
          approved: true,
          reviewer: 'core-maintainer-alex',
          comment: `LGTM! Clean PR with accurate test coverage and no unnecessary formatting diffs. Thank you for following our CONTRIBUTING guidelines and solving #${mission.issueNumber}! Merged to default branch.`,
        },
        completed: true,
        completedAt: new Date().toISOString(),
      };
      setProgress(updated);
      updateMissionProgress(updated);
      setIsSimulatingReview(false);

      awardXpAndBadges(mission.xpReward, ['badge-solution-architect', 'badge-pr-artisan']);
      onMissionCompleted(mission.xpReward);
    }, 1200);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPr(true);
    setTimeout(() => setCopiedPr(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header: Flight Deck HUD */}
      <div className="rounded-xl border border-[#1A263A] bg-gradient-to-r from-[#0C121D] via-[#0E1523] to-[#0A0F19] p-5 shadow-xl font-mono">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-emerald-400 mb-1">
              <span className="flex items-center gap-1">
                <Target className="h-3.5 w-3.5" />
                <span>OPERATION // {mission.repoOwner.toUpperCase()}_{mission.repoName.toUpperCase()}</span>
              </span>
              <span className="text-slate-600">/</span>
              <span>BOUNTY #{mission.issueNumber}</span>
              <span className="text-slate-600">/</span>
              <span className="text-cyan-400">{mission.difficulty.toUpperCase()}</span>
              <span className="text-slate-600">/</span>
              <span className="text-violet-400 font-bold">+{mission.xpReward} XP</span>
            </div>
            <h1 className="text-base sm:text-xl font-bold text-white tracking-tight font-sans">
              {mission.title}
            </h1>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href={mission.issueUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#1E2C42] bg-[#0A101A] text-xs text-slate-300 hover:text-white transition"
            >
              <span>GitHub Issue</span>
              <ExternalLink className="h-3.5 w-3.5 text-cyan-400" />
            </a>
            <button
              onClick={onBackToExplorer}
              className="px-3 py-1.5 rounded-lg border border-[#1A263A] bg-[#080B11] text-xs text-slate-400 hover:text-slate-200 transition"
            >
              Bounty Board
            </button>
          </div>
        </div>

        {/* 8-Stage Checkpoint Telemetry Bar */}
        <div className="mt-5 pt-4 border-t border-[#182335]">
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 text-center">
            {STAGES.map((st) => {
              const isCurrent = activeStage === st.id;
              const isPast = activeStage > st.id;
              const isCompleted = progress.completed || isPast;

              return (
                <button
                  key={st.id}
                  onClick={() => handleStageChange(st.id)}
                  className={`p-2 rounded-lg text-xs font-mono transition flex flex-col items-center gap-1 ${
                    isCurrent
                      ? 'bg-emerald-500/15 border border-emerald-500/50 text-emerald-300 font-bold shadow-sm shadow-emerald-500/10'
                      : isCompleted
                      ? 'bg-[#101827] border border-[#1B273A] text-slate-300 hover:border-slate-600'
                      : 'bg-[#080D15] border border-[#131C2A] text-slate-600 hover:text-slate-400'
                  }`}
                >
                  <span className="text-[10px] text-slate-500">STAGE {st.id}</span>
                  <span className="truncate w-full text-[11px] font-semibold">{st.short}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Workspace Split: Stage Content on Left, Gemma Tactical Co-Pilot on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Mission Operations Deck (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="rounded-xl border border-[#1A263A] bg-[#0D131F] p-6 shadow-md">
            {/* STAGE 1: Recon & Verify */}
            {activeStage === 1 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase">
                  <span>CHECKPOINT 01</span>
                  <span className="text-slate-600">/</span>
                  <span>RECON & VERIFY AVAILABILITY</span>
                </div>
                <h2 className="text-base font-bold text-white font-sans">Verify Target & Rules of Engagement</h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Before touching code, verify the bounty is open and has zero active assignees, then inspect the repository's <code className="text-emerald-400">CONTRIBUTING.md</code>.
                </p>

                <div className="rounded-lg bg-[#080B11] border border-[#182335] p-4 space-y-3 font-mono">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Target Availability:</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Verified Open · 0 Assignees
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Rules of Engagement:</span>
                    <a
                      href={`${mission.issueUrl.split('/issues')[0]}/blob/main/CONTRIBUTING.md`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-cyan-400 hover:underline flex items-center gap-1"
                    >
                      <span>CONTRIBUTING.md Brief</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <span className="text-xs font-mono font-semibold text-slate-300 block">CHECKLIST:</span>
                  {[
                    'I confirmed this issue is currently unassigned on GitHub',
                    'I read the repository code of conduct and contributing guide',
                  ].map((label, idx) => {
                    const checked = progress.stageChecklists[1]?.[idx] || false;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleChecklistToggle(1, idx)}
                        className="flex items-start gap-2.5 w-full text-left p-2.5 rounded-lg border border-[#1A263A] bg-[#090E17] hover:bg-[#0E1523] text-xs transition font-mono"
                      >
                        {checked ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                        ) : (
                          <Circle className="h-4 w-4 text-slate-600 mt-0.5 shrink-0" />
                        )}
                        <span className={checked ? 'text-slate-400 line-through' : 'text-slate-200'}>
                          {label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-end pt-3">
                  <button
                    onClick={() => handleStageChange(2)}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-400 text-slate-950 font-bold font-mono text-xs rounded-lg hover:bg-emerald-300 transition shadow-md shadow-emerald-500/20"
                  >
                    <span>Proceed to Stage 02: Understand</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* STAGE 2: Understand Issue */}
            {activeStage === 2 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase">
                  <span>CHECKPOINT 02</span>
                  <span className="text-slate-600">/</span>
                  <span>TARGET DECONSTRUCTION</span>
                </div>
                <h2 className="text-base font-bold text-white font-sans">Root Cause Deconstruction</h2>

                <div className="rounded-lg bg-cyan-950/20 border border-cyan-800/40 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-cyan-300 font-mono">
                    <Sparkles className="h-4 w-4 text-cyan-400" />
                    <span>GEMMA TACTICAL ANALYSIS</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {mission.aiExplanation}
                  </p>
                </div>

                <div className="rounded-lg bg-[#080B11] border border-[#182335] p-4 space-y-2">
                  <span className="text-xs font-mono font-semibold text-slate-300 block">Original Issue Payload:</span>
                  <p className="text-xs text-slate-400 leading-relaxed font-mono">
                    {mission.description}
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <span className="text-xs font-mono font-semibold text-slate-300 block">CHECKLIST:</span>
                  {[
                    'I can describe expected vs actual behavior in 1 clear sentence',
                    'I identified which component or function triggers this condition',
                    'I understand why maintainers consider this a bug/improvement',
                  ].map((label, idx) => {
                    const checked = progress.stageChecklists[2]?.[idx] || false;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleChecklistToggle(2, idx)}
                        className="flex items-start gap-2.5 w-full text-left p-2.5 rounded-lg border border-[#1A263A] bg-[#090E17] hover:bg-[#0E1523] text-xs transition font-mono"
                      >
                        {checked ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                        ) : (
                          <Circle className="h-4 w-4 text-slate-600 mt-0.5 shrink-0" />
                        )}
                        <span className={checked ? 'text-slate-400 line-through' : 'text-slate-200'}>
                          {label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-between pt-3">
                  <button
                    onClick={() => handleStageChange(1)}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-[#1E2C42] text-xs font-mono text-slate-300 rounded-lg hover:bg-[#121824] transition"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" /> Back
                  </button>
                  <button
                    onClick={() => handleStageChange(3)}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-400 text-slate-950 font-bold font-mono text-xs rounded-lg hover:bg-emerald-300 transition shadow-md shadow-emerald-500/20"
                  >
                    <span>Proceed to Stage 03: Infiltrate Code</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* STAGE 3: Explore Codebase */}
            {activeStage === 3 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase">
                  <span>CHECKPOINT 03</span>
                  <span className="text-slate-600">/</span>
                  <span>CODEBASE INFILTRATION</span>
                </div>
                <h2 className="text-base font-bold text-white font-sans">Target Coordinates & Scope Boundaries</h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Focus strictly on the designated scope. Top-tier open-source engineers touch only the required lines and files.
                </p>

                <div className="rounded-lg bg-[#080B11] border border-[#182335] p-4 space-y-3">
                  <span className="text-xs font-mono font-semibold text-slate-300 block flex items-center gap-2">
                    <FileCode className="h-4 w-4 text-emerald-400" /> Key File Targets:
                  </span>
                  <div className="space-y-1.5 font-mono text-xs">
                    {mission.keyFiles.map((file, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 rounded bg-[#0E1523] border border-[#1A263A] text-slate-200"
                      >
                        <span className="truncate">{file}</span>
                        <span className="text-[10px] text-emerald-400 font-mono ml-2">TARGET FILE</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <span className="text-xs font-mono font-semibold text-slate-300 block">CHECKLIST:</span>
                  {[
                    'I located the target files in the cloned repository',
                    'I verified that the project builds and lints cleanly on master branch',
                  ].map((label, idx) => {
                    const checked = progress.stageChecklists[3]?.[idx] || false;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleChecklistToggle(3, idx)}
                        className="flex items-start gap-2.5 w-full text-left p-2.5 rounded-lg border border-[#1A263A] bg-[#090E17] hover:bg-[#0E1523] text-xs transition font-mono"
                      >
                        {checked ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                        ) : (
                          <Circle className="h-4 w-4 text-slate-600 mt-0.5 shrink-0" />
                        )}
                        <span className={checked ? 'text-slate-400 line-through' : 'text-slate-200'}>
                          {label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-between pt-3">
                  <button
                    onClick={() => handleStageChange(2)}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-[#1E2C42] text-xs font-mono text-slate-300 rounded-lg hover:bg-[#121824] transition"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" /> Back
                  </button>
                  <button
                    onClick={() => handleStageChange(4)}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-400 text-slate-950 font-bold font-mono text-xs rounded-lg hover:bg-emerald-300 transition shadow-md shadow-emerald-500/20"
                  >
                    <span>Proceed to Stage 04: Battle Plan</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* STAGE 4: Battle Plan */}
            {activeStage === 4 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono text-violet-400 uppercase">
                  <span>CHECKPOINT 04</span>
                  <span className="text-slate-600">/</span>
                  <span>BATTLE PLAN & VECTOR</span>
                </div>
                <h2 className="text-base font-bold text-white font-sans">Draft Implementation Vector</h2>

                <div className="space-y-2">
                  <label className="block text-xs font-mono font-semibold text-slate-300">
                    Tactical Approach Log:
                  </label>
                  <textarea
                    rows={4}
                    value={progress.solutionNotes}
                    onChange={(e) => {
                      const updated = { ...progress, solutionNotes: e.target.value };
                      setProgress(updated);
                      updateMissionProgress(updated);
                    }}
                    placeholder="e.g. 1. Add 'E' shortcut key mapping to the eraser action. 2. Verify ToolButton renders shortcut tooltip. 3. Run npm test to verify no regressions."
                    className="w-full rounded-lg border border-[#1E2C42] bg-[#080B11] p-3 text-xs text-slate-100 placeholder-slate-500 focus:border-violet-500 focus:outline-none font-mono"
                  />
                </div>

                <div className="space-y-2 pt-1">
                  <span className="text-xs font-mono font-semibold text-slate-300 block">CHECKLIST:</span>
                  {[
                    'I created an isolated branch: git checkout -b fix/issue-name',
                    'I identified tests that should cover this change',
                    'I verified my proposed fix does not break backward compatibility',
                  ].map((label, idx) => {
                    const checked = progress.stageChecklists[4]?.[idx] || false;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleChecklistToggle(4, idx)}
                        className="flex items-start gap-2.5 w-full text-left p-2.5 rounded-lg border border-[#1A263A] bg-[#090E17] hover:bg-[#0E1523] text-xs transition font-mono"
                      >
                        {checked ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                        ) : (
                          <Circle className="h-4 w-4 text-slate-600 mt-0.5 shrink-0" />
                        )}
                        <span className={checked ? 'text-slate-400 line-through' : 'text-slate-200'}>
                          {label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-between pt-3">
                  <button
                    onClick={() => handleStageChange(3)}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-[#1E2C42] text-xs font-mono text-slate-300 rounded-lg hover:bg-[#121824] transition"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" /> Back
                  </button>
                  <button
                    onClick={() => handleStageChange(5)}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-400 text-slate-950 font-bold font-mono text-xs rounded-lg hover:bg-emerald-300 transition shadow-md shadow-emerald-500/20"
                  >
                    <span>Proceed to Stage 05: Code & Intel</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* STAGE 5: Code & Progressive Intel Hints */}
            {activeStage === 5 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase">
                  <span>CHECKPOINT 05</span>
                  <span className="text-slate-600">/</span>
                  <span>ENGAGEMENT & PROGRESSIVE INTEL</span>
                </div>
                <h2 className="text-base font-bold text-white font-sans">Implement Changes with Gemma Intel</h2>

                {/* Progressive Hints Accordion */}
                <div className="space-y-2.5 font-mono">
                  {/* Intel Tier 1 */}
                  <div className="rounded-lg border border-[#1A263A] bg-[#080B11] p-3.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-amber-400" />
                        <span className="text-xs font-bold text-slate-200">INTEL TIER 1: CONCEPTUAL RECON</span>
                      </div>
                      {progress.unlockedHintLevel < 1 ? (
                        <button
                          onClick={() => handleUnlockHint(1)}
                          className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded text-[11px] font-bold hover:bg-amber-500/20"
                        >
                          Unlock Intel 1
                        </button>
                      ) : (
                        <span className="text-[10px] text-emerald-400">UNLOCKED</span>
                      )}
                    </div>
                    {progress.unlockedHintLevel >= 1 && (
                      <p className="text-xs text-slate-300 mt-2.5 leading-relaxed pl-6 border-l border-amber-500/40">
                        {mission.hints.level1}
                      </p>
                    )}
                  </div>

                  {/* Intel Tier 2 */}
                  <div className="rounded-lg border border-[#1A263A] bg-[#080B11] p-3.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileCode className="h-4 w-4 text-cyan-400" />
                        <span className="text-xs font-bold text-slate-200">INTEL TIER 2: VECTOR COORDINATE</span>
                      </div>
                      {progress.unlockedHintLevel < 2 ? (
                        <button
                          onClick={() => handleUnlockHint(2)}
                          className="px-2.5 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 rounded text-[11px] font-bold hover:bg-cyan-500/20"
                        >
                          Unlock Intel 2
                        </button>
                      ) : (
                        <span className="text-[10px] text-emerald-400">UNLOCKED</span>
                      )}
                    </div>
                    {progress.unlockedHintLevel >= 2 && (
                      <p className="text-xs text-slate-300 mt-2.5 leading-relaxed pl-6 border-l border-cyan-500/40">
                        {mission.hints.level2}
                      </p>
                    )}
                  </div>

                  {/* Intel Tier 3 */}
                  <div className="rounded-lg border border-[#1A263A] bg-[#080B11] p-3.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Terminal className="h-4 w-4 text-emerald-400" />
                        <span className="text-xs font-bold text-slate-200">INTEL TIER 3: CODE IMPLEMENTATION VECTOR</span>
                      </div>
                      {progress.unlockedHintLevel < 3 ? (
                        <button
                          onClick={() => handleUnlockHint(3)}
                          className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded text-[11px] font-bold hover:bg-emerald-500/20"
                        >
                          Unlock Intel 3
                        </button>
                      ) : (
                        <span className="text-[10px] text-emerald-400">UNLOCKED</span>
                      )}
                    </div>
                    {progress.unlockedHintLevel >= 3 && (
                      <p className="text-xs text-slate-300 mt-2.5 leading-relaxed pl-6 border-l border-emerald-500/40 text-[11px]">
                        {mission.hints.level3}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <span className="text-xs font-mono font-semibold text-slate-300 block">CHECKLIST:</span>
                  {[
                    'I implemented the targeted code fix in my local branch',
                    'I adhered strictly to the file formatting rules without changing unrelated lines',
                  ].map((label, idx) => {
                    const checked = progress.stageChecklists[5]?.[idx] || false;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleChecklistToggle(5, idx)}
                        className="flex items-start gap-2.5 w-full text-left p-2.5 rounded-lg border border-[#1A263A] bg-[#090E17] hover:bg-[#0E1523] text-xs transition font-mono"
                      >
                        {checked ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                        ) : (
                          <Circle className="h-4 w-4 text-slate-600 mt-0.5 shrink-0" />
                        )}
                        <span className={checked ? 'text-slate-400 line-through' : 'text-slate-200'}>
                          {label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-between pt-3">
                  <button
                    onClick={() => handleStageChange(4)}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-[#1E2C42] text-xs font-mono text-slate-300 rounded-lg hover:bg-[#121824] transition"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" /> Back
                  </button>
                  <button
                    onClick={() => handleStageChange(6)}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-400 text-slate-950 font-bold font-mono text-xs rounded-lg hover:bg-emerald-300 transition shadow-md shadow-emerald-500/20"
                  >
                    <span>Proceed to Stage 06: Verification Drill</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* STAGE 6: Verification Drill */}
            {activeStage === 6 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase">
                  <span>CHECKPOINT 06</span>
                  <span className="text-slate-600">/</span>
                  <span>VERIFICATION DRILL & TESTS</span>
                </div>
                <h2 className="text-base font-bold text-white font-sans">Run Local Test Suites & Diff Audit</h2>

                <div className="rounded-lg bg-[#080B11] border border-[#182335] p-4 space-y-2 font-mono text-xs">
                  <span className="text-slate-400 block font-semibold text-xs mb-1">
                    CLI DRILL PROTOCOL:
                  </span>
                  <div className="p-2 bg-[#0E1523] rounded border border-[#1A263A] text-slate-300">
                    $ git diff --stat <span className="text-slate-500"># Confirm 0 unintended modifications</span>
                  </div>
                  <div className="p-2 bg-[#0E1523] rounded border border-[#1A263A] text-slate-300">
                    $ npm test <span className="text-slate-500"># Verify 100% test pass</span>
                  </div>
                  <div className="p-2 bg-[#0E1523] rounded border border-[#1A263A] text-slate-300">
                    $ npm run lint <span className="text-slate-500"># Enforce codebase style standards</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <span className="text-xs font-mono font-semibold text-slate-300 block">DRILL CHECKLIST:</span>
                  {[
                    'All unit and integration tests pass without failures',
                    'Linter and type check passes with 0 errors or warnings',
                    'I checked git status and there are no untracked scratch files',
                  ].map((label, idx) => {
                    const checked = progress.stageChecklists[6]?.[idx] || false;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleChecklistToggle(6, idx)}
                        className="flex items-start gap-2.5 w-full text-left p-2.5 rounded-lg border border-[#1A263A] bg-[#090E17] hover:bg-[#0E1523] text-xs transition font-mono"
                      >
                        {checked ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                        ) : (
                          <Circle className="h-4 w-4 text-slate-600 mt-0.5 shrink-0" />
                        )}
                        <span className={checked ? 'text-slate-400 line-through' : 'text-slate-200'}>
                          {label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-between pt-3">
                  <button
                    onClick={() => handleStageChange(5)}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-[#1E2C42] text-xs font-mono text-slate-300 rounded-lg hover:bg-[#121824] transition"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" /> Back
                  </button>
                  <button
                    onClick={() => handleStageChange(7)}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-400 text-slate-950 font-bold font-mono text-xs rounded-lg hover:bg-emerald-300 transition shadow-md shadow-emerald-500/20"
                  >
                    <span>Proceed to Stage 07: PR Dispatch</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* STAGE 7: PR Dispatch */}
            {activeStage === 7 && (
              <div className="space-y-4 font-mono">
                <div className="flex items-center gap-2 text-xs text-emerald-400 uppercase">
                  <span>CHECKPOINT 07</span>
                  <span className="text-slate-600">/</span>
                  <span>PR MISSION DISPATCH GENERATOR</span>
                </div>
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-white font-sans">Craft Formal Pull Request</h2>
                  <button
                    onClick={handleGeneratePr}
                    disabled={isGeneratingPr}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500 text-slate-950 font-bold rounded text-xs hover:bg-cyan-400 transition disabled:opacity-50 shadow-md shadow-cyan-500/20"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>{isGeneratingPr ? 'Generating Dispatch...' : 'Dispatch with Gemma'}</span>
                  </button>
                </div>

                <div>
                  <label className="block text-[11px] uppercase text-slate-400 mb-1">
                    FEATURE BRANCH TARGET:
                  </label>
                  <input
                    type="text"
                    value={progress.draftPr.branchName}
                    onChange={(e) => {
                      const updated = {
                        ...progress,
                        draftPr: { ...progress.draftPr, branchName: e.target.value },
                      };
                      setProgress(updated);
                      updateMissionProgress(updated);
                    }}
                    className="w-full rounded-lg border border-[#1E2C42] bg-[#080B11] px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase text-slate-400 mb-1">
                    SEMANTIC PR TITLE:
                  </label>
                  <input
                    type="text"
                    value={
                      progress.draftPr.title ||
                      `fix(${mission.repoName}): resolve issue #${mission.issueNumber} ${mission.title}`
                    }
                    onChange={(e) => {
                      const updated = {
                        ...progress,
                        draftPr: { ...progress.draftPr, title: e.target.value },
                      };
                      setProgress(updated);
                      updateMissionProgress(updated);
                    }}
                    className="w-full rounded-lg border border-[#1E2C42] bg-[#080B11] px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] uppercase text-slate-400">
                      PR DISPATCH BODY:
                    </label>
                    <button
                      onClick={() => copyToClipboard(progress.draftPr.body || '')}
                      className="flex items-center gap-1 text-[11px] text-cyan-400 hover:underline"
                    >
                      {copiedPr ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      <span>{copiedPr ? 'Copied!' : 'Copy to Clipboard'}</span>
                    </button>
                  </div>
                  <textarea
                    rows={6}
                    value={
                      progress.draftPr.body ||
                      `## Summary of Changes\n- Fixed issue #${mission.issueNumber} by addressing ${mission.title}\n- Added unit tests and verified linting\n\nCloses #${mission.issueNumber}\n\n## Testing Done\n- Verified locally with test suite\n\n## Checklist\n- [x] Code follows repo style\n- [x] Tested locally`
                    }
                    onChange={(e) => {
                      const updated = {
                        ...progress,
                        draftPr: { ...progress.draftPr, body: e.target.value },
                      };
                      setProgress(updated);
                      updateMissionProgress(updated);
                    }}
                    className="w-full rounded-lg border border-[#1E2C42] bg-[#080B11] p-3 text-xs text-slate-100 leading-relaxed"
                  />
                </div>

                <div className="flex justify-between pt-3">
                  <button
                    onClick={() => handleStageChange(6)}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-[#1E2C42] text-xs text-slate-300 rounded-lg hover:bg-[#121824] transition"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" /> Back
                  </button>
                  <button
                    onClick={() => handleStageChange(8)}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg hover:bg-emerald-300 transition shadow-md shadow-emerald-500/20"
                  >
                    <span>Proceed to Stage 08: Debrief</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* STAGE 8: Debrief & XP Claim */}
            {activeStage === 8 && (
              <div className="space-y-4 font-mono">
                <div className="flex items-center gap-2 text-xs text-emerald-400 uppercase">
                  <span>CHECKPOINT 08</span>
                  <span className="text-slate-600">/</span>
                  <span>MAINTAINER DEBRIEF & XP ACCREDITATION</span>
                </div>
                <h2 className="text-base font-bold text-white font-sans">Simulate Maintainer Review & Claim Bounty</h2>

                {!progress.completed ? (
                  <div className="p-6 rounded-lg border border-[#1A263A] bg-[#080B11] text-center space-y-4">
                    <Trophy className="mx-auto h-10 w-10 text-amber-400" />
                    <div>
                      <h3 className="text-sm font-bold text-white">Transmit PR to Maintainers?</h3>
                      <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                        Simulating review executes CI checks, calculates etiquette karma, and awards{' '}
                        <strong className="text-violet-400">+{mission.xpReward} XP</strong> to your Contributor Dossier.
                      </p>
                    </div>

                    <button
                      onClick={handleSimulateReview}
                      disabled={isSimulatingReview}
                      className="px-6 py-2.5 bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg hover:bg-emerald-300 transition shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                    >
                      {isSimulatingReview ? 'Evaluating PR with Maintainer...' : 'Transmit & Simulate Review (+XP)'}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-5 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                          <span className="text-xs font-bold text-emerald-300">
                            PULL REQUEST APPROVED & MERGED!
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400">
                          @{progress.maintainerFeedback?.reviewer || 'maintainer'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed italic bg-[#080B11] p-3 rounded border border-emerald-500/20">
                        "{progress.maintainerFeedback?.comment}"
                      </p>
                    </div>

                    <div className="rounded-lg border border-violet-500/30 bg-violet-950/20 p-5 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-violet-300 font-bold block">BOUNTY COMPLETED!</span>
                        <span className="text-xs text-slate-400">
                          Accredited <strong className="text-emerald-400">+{mission.xpReward} XP</strong> & unlocked Solution Architect Medal.
                        </span>
                      </div>
                      <Trophy className="h-8 w-8 text-violet-400" />
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        onClick={onBackToExplorer}
                        className="flex items-center gap-2 px-5 py-2.5 bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg hover:bg-emerald-300 transition shadow-md shadow-emerald-500/20"
                      >
                        <span>Return to Bounty Board</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Gemma Tactical Co-Pilot Console (5 cols) */}
        <div className="lg:col-span-5 flex flex-col h-[650px] rounded-xl border border-[#1A263A] bg-[#0A0F19] shadow-xl overflow-hidden font-mono">
          {/* Tactical Header */}
          <div className="p-3.5 border-b border-[#182335] bg-[#0D1422] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Cpu className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">GEMMA // CO-PILOT</span>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>TACTICAL LINK ACTIVE</span>
                </span>
              </div>
            </div>

            <div className="text-[11px] text-slate-400">
              STAGE {activeStage}/8
            </div>
          </div>

          {/* Chat Messages Log */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[92%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-emerald-400 text-slate-950 font-bold font-mono'
                      : 'bg-[#0E1523] border border-[#1A263A] text-slate-200 font-sans'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {msg.etiquetteTip && (
                    <div className="mt-2.5 pt-2 border-t border-[#1F2C40] text-[11px] text-cyan-300 flex items-start gap-1.5 bg-[#080D15] p-2 rounded font-mono">
                      <ShieldCheck className="h-3.5 w-3.5 text-cyan-400 mt-0.5 shrink-0" />
                      <span>{msg.etiquetteTip}</span>
                    </div>
                  )}
                </div>

                {/* Tactical Prompt Chips */}
                {msg.suggestedPrompts && msg.suggestedPrompts.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5 max-w-[95%]">
                    {msg.suggestedPrompts.map((prompt, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendMessage(prompt)}
                        className="text-[10px] font-mono bg-[#111A29] hover:bg-[#172338] text-slate-300 hover:text-white px-2.5 py-1 rounded border border-[#1F2E44] transition"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isSending && (
              <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                <div className="h-2 w-2 animate-bounce rounded-full bg-cyan-400"></div>
                <div className="h-2 w-2 animate-bounce rounded-full bg-cyan-400 [animation-delay:0.2s]"></div>
                <div className="h-2 w-2 animate-bounce rounded-full bg-cyan-400 [animation-delay:0.4s]"></div>
                <span className="text-[11px]">Gemma computing intel...</span>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Tactical Chat Input */}
          <div className="p-3 border-t border-[#182335] bg-[#0C121D]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Query Gemma on code, tests, or maintainer protocol..."
                className="flex-1 rounded-lg border border-[#1E2C42] bg-[#070B12] px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none font-mono"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isSending}
                className="p-2 bg-cyan-500 text-slate-950 font-bold rounded-lg hover:bg-cyan-400 transition disabled:opacity-40"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
