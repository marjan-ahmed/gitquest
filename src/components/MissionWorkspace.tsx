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
  { id: 4, name: '04. Plan Vector', short: 'Plan' },
  { id: 5, name: '05. Code & Intel', short: 'Code' },
  { id: 6, name: '06. Verify Tests', short: 'Verify' },
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
      text: `Hello contributor! I'm Gemma, your open-source co-pilot on **${mission.repoName}** #${mission.issueNumber}.\n\nOur objective: Understand the root cause, identify the exact target lines, and submit a maintainer-ready pull request with zero noise. What guidance do you need first?`,
      timestamp: 'Active',
      suggestedPrompts: [
        'Explain this issue in simple terms',
        'Where in the repository should I look?',
        'What etiquette rules apply to this project?',
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
    if (progress.unlockedHintLevel >= level) return;
    const updated = {
      ...progress,
      unlockedHintLevel: level,
    };
    setProgress(updated);
    updateMissionProgress(updated);
  };

  const handleSendMessage = async (customText?: string) => {
    const msgText = (customText || inputMessage).trim();
    if (!msgText || isSending) return;

    const userMsg: MentorChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: msgText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsSending(true);

    try {
      const res = await fetch('/api/mentor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          missionTitle: mission.title,
          repoOwner: mission.repoOwner,
          repoName: mission.repoName,
          currentStage: activeStage,
          message: msgText,
          chatHistory: chatMessages.slice(-6).map((m) => ({
            sender: m.sender,
            text: m.text,
          })),
        }),
      });

      const data = await res.json();
      const gemmaMsg: MentorChatMessage = {
        id: `gemma-${Date.now()}`,
        sender: 'gemma',
        text: data.reply || "Let's inspect the files and write clean tests.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedPrompts: data.suggestedPrompts || [
          'Can you show me a minimal reproduction test?',
          'What commit convention should I use?',
        ],
        etiquetteTip: data.etiquetteTip,
      };

      setChatMessages((prev) => [...prev, gemmaMsg]);
    } catch {
      const fallbackMsg: MentorChatMessage = {
        id: `gemma-${Date.now()}`,
        sender: 'gemma',
        text: `Focus on ${mission.keyFiles[0] || 'the target file'}. Keep your git diff minimal and atomic, and ensure you run the test suite locally before opening a pull request.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedPrompts: ['How do I format my PR description?'],
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
          repoOwner: mission.repoOwner,
          repoName: mission.repoName,
          issueNumber: mission.issueNumber,
          userNotes: progress.solutionNotes,
          branchName: progress.draftPr.branchName || `fix/${mission.repoName}-issue-${mission.issueNumber}`,
        }),
      });

      const data = await res.json();
      if (data.success && data.pr) {
        const updated = {
          ...progress,
          draftPr: {
            branchName: data.pr.branchName || progress.draftPr.branchName,
            title: data.pr.title || progress.draftPr.title,
            body: data.pr.body || progress.draftPr.body,
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
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm font-mono">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-emerald-700 mb-1.5 font-semibold">
              <span className="flex items-center gap-1">
                <Target className="h-3.5 w-3.5 text-emerald-600" />
                <span>OPERATION // {mission.repoOwner.toUpperCase()}_{mission.repoName.toUpperCase()}</span>
              </span>
              <span className="text-slate-300">/</span>
              <span>BOUNTY #{mission.issueNumber}</span>
              <span className="text-slate-300">/</span>
              <span className="text-sky-700">{mission.difficulty.toUpperCase()}</span>
              <span className="text-slate-300">/</span>
              <span className="text-violet-700 font-bold">+{mission.xpReward} XP</span>
            </div>
            <h1 className="text-base sm:text-xl font-bold text-slate-900 tracking-tight font-sans">
              {mission.title}
            </h1>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href={mission.issueUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition shadow-2xs cursor-pointer"
            >
              <span>GitHub Issue</span>
              <ExternalLink className="h-3.5 w-3.5 text-sky-600" />
            </a>
            <button
              onClick={onBackToExplorer}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition shadow-2xs cursor-pointer"
            >
              Bounty Board
            </button>
          </div>
        </div>

        {/* 8-Stage Checkpoint Telemetry Bar */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 text-center">
            {STAGES.map((st) => {
              const isCurrent = activeStage === st.id;
              const isPast = activeStage > st.id;
              const isCompleted = progress.completed || isPast;

              return (
                <button
                  key={st.id}
                  onClick={() => handleStageChange(st.id)}
                  className={`p-2.5 rounded-xl text-xs font-mono transition flex flex-col items-center gap-1 cursor-pointer ${
                    isCurrent
                      ? 'bg-emerald-600 text-white font-bold shadow-xs'
                      : isCompleted
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                      : 'bg-slate-50 border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                  }`}
                >
                  <span className={`text-[10px] ${isCurrent ? 'text-emerald-100' : 'text-slate-400'}`}>
                    STAGE 0{st.id}
                  </span>
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
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm">
            {/* STAGE 1: Recon & Verify */}
            {activeStage === 1 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 uppercase font-semibold">
                  <span>CHECKPOINT 01</span>
                  <span className="text-slate-300">/</span>
                  <span>RECON & VERIFY AVAILABILITY</span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 font-sans">Verify Target & Rules of Engagement</h2>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  Before touching code, verify the bounty is open and has zero active assignees, then inspect the repository's <code className="text-emerald-800 bg-emerald-50 px-1 py-0.5 rounded border border-emerald-200">CONTRIBUTING.md</code>.
                </p>

                <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-3 font-mono">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Target Availability:</span>
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Verified Open · 0 Assignees
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Rules of Engagement:</span>
                    <a
                      href={`${mission.issueUrl.split('/issues')[0]}/blob/main/CONTRIBUTING.md`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sky-700 hover:underline flex items-center gap-1 font-semibold"
                    >
                      <span>CONTRIBUTING.md Brief</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <span className="text-xs font-mono font-semibold text-slate-700 block">CHECKLIST:</span>
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
                        className="flex items-start gap-2.5 w-full text-left p-3 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-100/80 text-xs transition font-mono cursor-pointer"
                      >
                        {checked ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                        ) : (
                          <Circle className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                        )}
                        <span className={checked ? 'text-slate-400 line-through' : 'text-slate-800'}>
                          {label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-end pt-3">
                  <button
                    onClick={() => handleStageChange(2)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white font-semibold font-mono text-xs rounded-xl hover:bg-emerald-500 transition shadow-sm cursor-pointer"
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
                <div className="flex items-center gap-2 text-xs font-mono text-sky-700 uppercase font-semibold">
                  <span>CHECKPOINT 02</span>
                  <span className="text-slate-300">/</span>
                  <span>TARGET DECONSTRUCTION</span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 font-sans">Root Cause Deconstruction</h2>

                <div className="rounded-xl bg-sky-50/70 border border-sky-200 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-sky-800 font-mono">
                    <Sparkles className="h-4 w-4 text-sky-600" />
                    <span>GEMMA TACTICAL ANALYSIS</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-normal">
                    {mission.aiExplanation}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-2">
                  <span className="text-xs font-mono font-semibold text-slate-700 block">Original Issue Payload:</span>
                  <p className="text-xs text-slate-600 leading-relaxed font-mono">
                    {mission.description}
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <span className="text-xs font-mono font-semibold text-slate-700 block">CHECKLIST:</span>
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
                        className="flex items-start gap-2.5 w-full text-left p-3 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-100/80 text-xs transition font-mono cursor-pointer"
                      >
                        {checked ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                        ) : (
                          <Circle className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                        )}
                        <span className={checked ? 'text-slate-400 line-through' : 'text-slate-800'}>
                          {label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-between pt-3">
                  <button
                    onClick={() => handleStageChange(1)}
                    className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 bg-white text-xs font-mono text-slate-700 rounded-xl hover:bg-slate-50 transition cursor-pointer"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" /> Back
                  </button>
                  <button
                    onClick={() => handleStageChange(3)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white font-semibold font-mono text-xs rounded-xl hover:bg-emerald-500 transition shadow-sm cursor-pointer"
                  >
                    <span>Proceed to Stage 03: Explore Code</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* STAGE 3: Explore Codebase */}
            {activeStage === 3 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 uppercase font-semibold">
                  <span>CHECKPOINT 03</span>
                  <span className="text-slate-300">/</span>
                  <span>CODEBASE EXPLORATION</span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 font-sans">Target Coordinates & Scope Boundaries</h2>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  Focus strictly on the designated scope. Top-tier open-source engineers touch only the required lines and files.
                </p>

                <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-3">
                  <span className="text-xs font-mono font-semibold text-slate-700 block flex items-center gap-2">
                    <FileCode className="h-4 w-4 text-emerald-600" /> Key File Targets:
                  </span>
                  <div className="space-y-2 font-mono text-xs">
                    {mission.keyFiles.map((file, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200 text-slate-800 shadow-2xs"
                      >
                        <span className="truncate">{file}</span>
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-mono ml-2 font-semibold">
                          TARGET FILE
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <span className="text-xs font-mono font-semibold text-slate-700 block">CHECKLIST:</span>
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
                        className="flex items-start gap-2.5 w-full text-left p-3 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-100/80 text-xs transition font-mono cursor-pointer"
                      >
                        {checked ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                        ) : (
                          <Circle className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                        )}
                        <span className={checked ? 'text-slate-400 line-through' : 'text-slate-800'}>
                          {label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-between pt-3">
                  <button
                    onClick={() => handleStageChange(2)}
                    className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 bg-white text-xs font-mono text-slate-700 rounded-xl hover:bg-slate-50 transition cursor-pointer"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" /> Back
                  </button>
                  <button
                    onClick={() => handleStageChange(4)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white font-semibold font-mono text-xs rounded-xl hover:bg-emerald-500 transition shadow-sm cursor-pointer"
                  >
                    <span>Proceed to Stage 04: Plan Vector</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* STAGE 4: Battle Plan */}
            {activeStage === 4 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono text-violet-700 uppercase font-semibold">
                  <span>CHECKPOINT 04</span>
                  <span className="text-slate-300">/</span>
                  <span>PLAN VECTOR</span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 font-sans">Draft Implementation Vector</h2>

                <div className="space-y-2">
                  <label className="block text-xs font-mono font-semibold text-slate-700">
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
                    className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-900 placeholder-slate-400 focus:border-violet-600 focus:outline-none font-mono shadow-2xs"
                  />
                </div>

                <div className="space-y-2 pt-1">
                  <span className="text-xs font-mono font-semibold text-slate-700 block">CHECKLIST:</span>
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
                        className="flex items-start gap-2.5 w-full text-left p-3 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-100/80 text-xs transition font-mono cursor-pointer"
                      >
                        {checked ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                        ) : (
                          <Circle className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                        )}
                        <span className={checked ? 'text-slate-400 line-through' : 'text-slate-800'}>
                          {label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-between pt-3">
                  <button
                    onClick={() => handleStageChange(3)}
                    className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 bg-white text-xs font-mono text-slate-700 rounded-xl hover:bg-slate-50 transition cursor-pointer"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" /> Back
                  </button>
                  <button
                    onClick={() => handleStageChange(5)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white font-semibold font-mono text-xs rounded-xl hover:bg-emerald-500 transition shadow-sm cursor-pointer"
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
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 uppercase font-semibold">
                  <span>CHECKPOINT 05</span>
                  <span className="text-slate-300">/</span>
                  <span>CODE & PROGRESSIVE INTEL</span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 font-sans">Implement Changes with Gemma Intel</h2>

                {/* Progressive Hints Accordion */}
                <div className="space-y-3 font-mono">
                  {/* Intel Tier 1 */}
                  <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-4 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-amber-600" />
                        <span className="text-xs font-bold text-amber-900">INTEL TIER 1: CONCEPTUAL RECON</span>
                      </div>
                      {progress.unlockedHintLevel < 1 ? (
                        <button
                          onClick={() => handleUnlockHint(1)}
                          className="px-3 py-1 bg-amber-600 text-white rounded-lg text-[11px] font-semibold hover:bg-amber-500 shadow-2xs cursor-pointer"
                        >
                          Unlock Intel 1
                        </button>
                      ) : (
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-semibold">
                          UNLOCKED
                        </span>
                      )}
                    </div>
                    {progress.unlockedHintLevel >= 1 && (
                      <p className="text-xs text-slate-700 mt-2.5 leading-relaxed pl-6 border-l-2 border-amber-400 font-sans">
                        {mission.hints.level1}
                      </p>
                    )}
                  </div>

                  {/* Intel Tier 2 */}
                  <div className="rounded-xl border border-sky-200 bg-sky-50/40 p-4 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileCode className="h-4 w-4 text-sky-600" />
                        <span className="text-xs font-bold text-sky-900">INTEL TIER 2: VECTOR COORDINATES</span>
                      </div>
                      {progress.unlockedHintLevel < 2 ? (
                        <button
                          onClick={() => handleUnlockHint(2)}
                          className="px-3 py-1 bg-sky-600 text-white rounded-lg text-[11px] font-semibold hover:bg-sky-500 shadow-2xs cursor-pointer"
                        >
                          Unlock Intel 2
                        </button>
                      ) : (
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-semibold">
                          UNLOCKED
                        </span>
                      )}
                    </div>
                    {progress.unlockedHintLevel >= 2 && (
                      <p className="text-xs text-slate-700 mt-2.5 leading-relaxed pl-6 border-l-2 border-sky-400 font-sans">
                        {mission.hints.level2}
                      </p>
                    )}
                  </div>

                  {/* Intel Tier 3 */}
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Terminal className="h-4 w-4 text-emerald-600" />
                        <span className="text-xs font-bold text-emerald-900">INTEL TIER 3: CODE IMPLEMENTATION</span>
                      </div>
                      {progress.unlockedHintLevel < 3 ? (
                        <button
                          onClick={() => handleUnlockHint(3)}
                          className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-[11px] font-semibold hover:bg-emerald-500 shadow-2xs cursor-pointer"
                        >
                          Unlock Intel 3
                        </button>
                      ) : (
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-semibold">
                          UNLOCKED
                        </span>
                      )}
                    </div>
                    {progress.unlockedHintLevel >= 3 && (
                      <p className="text-xs text-slate-800 mt-2.5 leading-relaxed pl-6 border-l-2 border-emerald-500 font-mono text-[11px] bg-white p-2.5 rounded-lg border border-emerald-200">
                        {mission.hints.level3}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <span className="text-xs font-mono font-semibold text-slate-700 block">CHECKLIST:</span>
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
                        className="flex items-start gap-2.5 w-full text-left p-3 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-100/80 text-xs transition font-mono cursor-pointer"
                      >
                        {checked ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                        ) : (
                          <Circle className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                        )}
                        <span className={checked ? 'text-slate-400 line-through' : 'text-slate-800'}>
                          {label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-between pt-3">
                  <button
                    onClick={() => handleStageChange(4)}
                    className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 bg-white text-xs font-mono text-slate-700 rounded-xl hover:bg-slate-50 transition cursor-pointer"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" /> Back
                  </button>
                  <button
                    onClick={() => handleStageChange(6)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white font-semibold font-mono text-xs rounded-xl hover:bg-emerald-500 transition shadow-sm cursor-pointer"
                  >
                    <span>Proceed to Stage 06: Verification</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* STAGE 6: Verification Drill */}
            {activeStage === 6 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono text-sky-700 uppercase font-semibold">
                  <span>CHECKPOINT 06</span>
                  <span className="text-slate-300">/</span>
                  <span>VERIFICATION & TESTS</span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 font-sans">Run Local Test Suites & Diff Audit</h2>

                <div className="rounded-xl bg-slate-900 text-slate-100 p-4 space-y-2.5 font-mono text-xs shadow-2xs">
                  <span className="text-slate-400 block font-semibold text-[11px] mb-1">
                    CLI TEST PROTOCOL:
                  </span>
                  <div className="p-2.5 bg-slate-800/80 rounded-lg border border-slate-700 text-slate-200">
                    $ git diff --stat <span className="text-slate-400"># Confirm 0 unintended modifications</span>
                  </div>
                  <div className="p-2.5 bg-slate-800/80 rounded-lg border border-slate-700 text-slate-200">
                    $ npm test <span className="text-slate-400"># Verify 100% test pass</span>
                  </div>
                  <div className="p-2.5 bg-slate-800/80 rounded-lg border border-slate-700 text-slate-200">
                    $ npm run lint <span className="text-slate-400"># Enforce codebase style standards</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <span className="text-xs font-mono font-semibold text-slate-700 block">DRILL CHECKLIST:</span>
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
                        className="flex items-start gap-2.5 w-full text-left p-3 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-100/80 text-xs transition font-mono cursor-pointer"
                      >
                        {checked ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                        ) : (
                          <Circle className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                        )}
                        <span className={checked ? 'text-slate-400 line-through' : 'text-slate-800'}>
                          {label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-between pt-3">
                  <button
                    onClick={() => handleStageChange(5)}
                    className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 bg-white text-xs font-mono text-slate-700 rounded-xl hover:bg-slate-50 transition cursor-pointer"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" /> Back
                  </button>
                  <button
                    onClick={() => handleStageChange(7)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white font-semibold font-mono text-xs rounded-xl hover:bg-emerald-500 transition shadow-sm cursor-pointer"
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
                <div className="flex items-center gap-2 text-xs text-emerald-700 uppercase font-semibold">
                  <span>CHECKPOINT 07</span>
                  <span className="text-slate-300">/</span>
                  <span>PR MISSION DISPATCH GENERATOR</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h2 className="text-lg font-bold text-slate-900 font-sans">Craft Formal Pull Request</h2>
                  <button
                    onClick={handleGeneratePr}
                    disabled={isGeneratingPr}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-sky-600 text-white font-semibold rounded-xl text-xs hover:bg-sky-500 transition disabled:opacity-50 shadow-sm cursor-pointer self-start sm:self-auto"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>{isGeneratingPr ? 'Generating Dispatch...' : 'Dispatch with Gemma'}</span>
                  </button>
                </div>

                <div>
                  <label className="block text-[11px] uppercase text-slate-600 mb-1 font-semibold">
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
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase text-slate-600 mb-1 font-semibold">
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
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none shadow-2xs"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] uppercase text-slate-600 font-semibold">
                      PR DISPATCH BODY:
                    </label>
                    <button
                      onClick={() => copyToClipboard(progress.draftPr.body || '')}
                      className="flex items-center gap-1 text-[11px] text-sky-700 hover:underline font-semibold cursor-pointer"
                    >
                      {copiedPr ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                      <span>{copiedPr ? 'Copied to Clipboard!' : 'Copy to Clipboard'}</span>
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
                    className="w-full rounded-xl border border-slate-300 bg-white p-3.5 text-xs text-slate-900 leading-relaxed focus:border-emerald-600 focus:outline-none shadow-2xs font-mono"
                  />
                </div>

                <div className="flex justify-between pt-3">
                  <button
                    onClick={() => handleStageChange(6)}
                    className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 bg-white text-xs text-slate-700 rounded-xl hover:bg-slate-50 transition cursor-pointer"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" /> Back
                  </button>
                  <button
                    onClick={() => handleStageChange(8)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white font-semibold text-xs rounded-xl hover:bg-emerald-500 transition shadow-sm cursor-pointer"
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
                <div className="flex items-center gap-2 text-xs text-emerald-700 uppercase font-semibold">
                  <span>CHECKPOINT 08</span>
                  <span className="text-slate-300">/</span>
                  <span>MAINTAINER DEBRIEF & XP ACCREDITATION</span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 font-sans">Simulate Maintainer Review & Claim Bounty</h2>

                {!progress.completed ? (
                  <div className="p-8 rounded-2xl border border-slate-200 bg-slate-50/60 text-center space-y-4">
                    <Trophy className="mx-auto h-12 w-12 text-amber-500" />
                    <div>
                      <h3 className="text-base font-bold text-slate-900">Transmit PR to Maintainers?</h3>
                      <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
                        Simulating review executes CI checks, calculates etiquette karma, and awards{' '}
                        <strong className="text-emerald-700">+{mission.xpReward} XP</strong> to your Contributor Dossier.
                      </p>
                    </div>

                    <button
                      onClick={handleSimulateReview}
                      disabled={isSimulatingReview}
                      className="px-6 py-3 bg-emerald-600 text-white font-semibold text-xs rounded-xl hover:bg-emerald-500 transition shadow-sm disabled:opacity-50 cursor-pointer"
                    >
                      {isSimulatingReview ? 'Evaluating PR with Maintainer...' : 'Transmit & Simulate Review (+XP)'}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                          <span className="text-xs font-bold text-emerald-900">
                            PULL REQUEST APPROVED & MERGED!
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500">
                          @{progress.maintainerFeedback?.reviewer || 'maintainer'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed italic bg-white p-3.5 rounded-xl border border-emerald-200 shadow-2xs font-sans">
                        "{progress.maintainerFeedback?.comment}"
                      </p>
                    </div>

                    <div className="rounded-2xl border border-violet-200 bg-violet-50/70 p-5 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-violet-900 font-bold block">BOUNTY COMPLETED!</span>
                        <span className="text-xs text-slate-600">
                          Accredited <strong className="text-emerald-700">+{mission.xpReward} XP</strong> & unlocked Solution Architect Medal.
                        </span>
                      </div>
                      <Trophy className="h-8 w-8 text-violet-600" />
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        onClick={onBackToExplorer}
                        className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white font-semibold text-xs rounded-xl hover:bg-emerald-500 transition shadow-sm cursor-pointer"
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
        <div className="lg:col-span-5 flex flex-col h-[650px] rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden font-mono">
          {/* Tactical Header */}
          <div className="p-4 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-50 border border-sky-200 text-sky-600 shadow-2xs">
                <Cpu className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">GEMMA CO-PILOT</span>
                <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>MENTOR LINK ACTIVE</span>
                </span>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 font-medium">
              STAGE 0{activeStage}/8
            </div>
          </div>

          {/* Chat Messages Log */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/30">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[92%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-emerald-600 text-white font-medium'
                      : 'bg-white border border-slate-200 text-slate-800 font-sans shadow-2xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {msg.etiquetteTip && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100 text-[11px] text-emerald-900 flex items-start gap-1.5 bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200/80 font-mono">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 mt-0.5 shrink-0" />
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
                        className="text-[11px] font-mono bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 px-3 py-1 rounded-lg border border-slate-200 shadow-2xs transition cursor-pointer"
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
                <div className="h-2 w-2 animate-bounce rounded-full bg-sky-600"></div>
                <div className="h-2 w-2 animate-bounce rounded-full bg-sky-600 [animation-delay:0.2s]"></div>
                <div className="h-2 w-2 animate-bounce rounded-full bg-sky-600 [animation-delay:0.4s]"></div>
                <span className="text-[11px]">Gemma computing intel...</span>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Tactical Chat Input */}
          <div className="p-3 border-t border-slate-100 bg-white">
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
                placeholder="Ask Gemma about code, tests, or maintainer protocol..."
                className="flex-1 rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-emerald-600 focus:outline-none font-mono shadow-2xs"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isSending}
                className="p-2.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-500 transition disabled:opacity-40 cursor-pointer shadow-sm"
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
