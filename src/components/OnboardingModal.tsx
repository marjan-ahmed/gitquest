import React, { useState } from 'react';
import { Sparkles, Check, ArrowRight, ArrowLeft, Upload, FileText, CheckCircle2, AlertCircle, X, Search, GitBranch, ShieldCheck } from 'lucide-react';
import { UserProfile, ExperienceLevel, GitFamiliarity, MainGoal, ContributionInterest } from '../types';
import { TECHNICAL_QUIZ_QUESTIONS } from '../data/curatedData';
import { saveStoredProfile } from '../services/storage';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleted: (profile: UserProfile) => void;
  initialProfile: UserProfile | null;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onCompleted,
  initialProfile,
}) => {
  const [step, setStep] = useState<number>(1);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Form states
  const [githubUsername, setGithubUsername] = useState(initialProfile?.githubUsername || '');
  const [portfolioUrl, setPortfolioUrl] = useState(initialProfile?.portfolioUrl || '');
  const [resumeText, setResumeText] = useState('');
  const [resumeFileName, setResumeFileName] = useState(initialProfile?.resumeFileName || '');

  // Live GitHub verification states
  const [isVerifyingGithub, setIsVerifyingGithub] = useState(false);
  const [verifiedGithub, setVerifiedGithub] = useState<any>(null);
  const [modelUsedInfo, setModelUsedInfo] = useState<string>('Gemma');

  // Assessment answers
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>(initialProfile?.experienceLevel || 'fundamentals');
  const [preferredLanguages, setPreferredLanguages] = useState<string[]>(initialProfile?.preferredLanguages || ['TypeScript', 'JavaScript']);
  const [contributionInterests, setContributionInterests] = useState<ContributionInterest[]>(
    initialProfile?.contributionInterests || ['bugs', 'documentation']
  );
  const [gitFamiliarity, setGitFamiliarity] = useState<GitFamiliarity>(initialProfile?.gitFamiliarity || 'basic_commands');
  const [mainGoal, setMainGoal] = useState<MainGoal>(initialProfile?.mainGoal || 'first_contribution');

  // Practical Quiz answers
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [showQuiz, setShowQuiz] = useState<boolean>(false);

  // AI Generated / Editable results
  const [generatedProfile, setGeneratedProfile] = useState<{
    skillsClaimed: string[];
    skillsDemonstrated: string[];
    suggestedDifficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    recommendedTags: string[];
    summary: string;
  }>({
    skillsClaimed: initialProfile?.skillsClaimed || ['TypeScript', 'Web Fundamentals'],
    skillsDemonstrated: initialProfile?.skillsDemonstrated || ['JavaScript', 'Git Basics'],
    suggestedDifficulty: initialProfile?.suggestedDifficulty || 'Beginner',
    recommendedTags: ['React', 'TypeScript', 'Good First Issue'],
    summary: 'Ready to embark on real-world open-source contributions.',
  });

  // Reset to step 1 when opening freshly without profile
  React.useEffect(() => {
    if (isOpen) {
      if (!initialProfile) {
        setStep(1);
        setGithubUsername('');
        setPortfolioUrl('');
        setResumeText('');
        setResumeFileName('');
        setVerifiedGithub(null);
      } else {
        setGithubUsername(initialProfile.githubUsername);
        setPortfolioUrl(initialProfile.portfolioUrl || '');
        setResumeFileName(initialProfile.resumeFileName || '');
        setExperienceLevel(initialProfile.experienceLevel);
        setPreferredLanguages(initialProfile.preferredLanguages);
        setContributionInterests(initialProfile.contributionInterests);
        setGitFamiliarity(initialProfile.gitFamiliarity);
        setMainGoal(initialProfile.mainGoal);
      }
    }
  }, [isOpen, initialProfile]);

  if (!isOpen) return null;

  // Real GitHub User Verification
  const verifyGithubAccount = async (inputHandle?: string) => {
    const handle = (inputHandle || githubUsername).trim().replace('https://github.com/', '').replace('/', '');
    if (!handle) return;
    setIsVerifyingGithub(true);

    try {
      const res = await fetch(`/api/github/user/${encodeURIComponent(handle)}`);
      const data = await res.json();
      if (data.exists) {
        setVerifiedGithub(data);
        setGithubUsername(data.profile.login);
        if (data.topLanguages && data.topLanguages.length > 0) {
          setPreferredLanguages((prev) => Array.from(new Set([...prev, ...data.topLanguages])));
        }
      } else {
        setVerifiedGithub({ exists: false, message: data.message || 'User not found on GitHub' });
      }
    } catch {
      setVerifiedGithub({ exists: false, message: 'Could not contact GitHub API' });
    } finally {
      setIsVerifyingGithub(false);
    }
  };

  // Handle Mock or Real File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setResumeText(text ? text.slice(0, 3000) : '');
      };
      reader.readAsText(file);
    }
  };

  const toggleLanguage = (lang: string) => {
    setPreferredLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  const toggleInterest = (interest: ContributionInterest) => {
    setContributionInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  // Run AI Analysis via Gemma API
  const runAiAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    setStep(4);

    try {
      const res = await fetch('/api/profile/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          githubUsername,
          resumeText,
          portfolioUrl,
          selectedLanguages: preferredLanguages,
          experienceLevel,
          mainGoal,
          quizAnswers,
        }),
      });

      const data = await res.json();
      if (data.profile) {
        setGeneratedProfile(data.profile);
        setModelUsedInfo(data.modelUsed || 'Gemma');
      }
    } catch (err: any) {
      setAnalysisError('Gemma analysis encountered an issue. Standard profile generated.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFinalize = () => {
    const updated: UserProfile = {
      id: initialProfile?.id || `user-${Date.now()}`,
      githubUsername: githubUsername.trim() || 'guest-contributor',
      avatarUrl: verifiedGithub?.exists
        ? verifiedGithub.profile.avatarUrl
        : (initialProfile?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80'),
      experienceLevel,
      preferredLanguages,
      contributionInterests,
      gitFamiliarity,
      mainGoal,
      skillsClaimed: generatedProfile.skillsClaimed,
      skillsDemonstrated: generatedProfile.skillsDemonstrated,
      suggestedDifficulty: generatedProfile.suggestedDifficulty,
      summary: generatedProfile.summary,
      totalXp: initialProfile ? Math.max(initialProfile.totalXp, 150) : 150,
      level: initialProfile ? initialProfile.level : 1,
      streakDays: initialProfile ? initialProfile.streakDays : 1,
      etiquetteScore: initialProfile ? initialProfile.etiquetteScore : 92,
      badges: (initialProfile?.badges || []).includes('badge-first-contact')
        ? (initialProfile?.badges || [])
        : [...(initialProfile?.badges || []), 'badge-first-contact'],
      completedMissionIds: initialProfile?.completedMissionIds || [],
      githubData: verifiedGithub?.exists
        ? {
            publicRepos: verifiedGithub.profile.publicRepos,
            topLanguages: verifiedGithub.topLanguages || [],
            bio: verifiedGithub.profile.bio,
            htmlUrl: verifiedGithub.profile.htmlUrl,
          }
        : undefined,
      createdAt: initialProfile?.createdAt || new Date().toISOString(),
    };

    saveStoredProfile(updated);
    onCompleted(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl text-slate-900">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 transition cursor-pointer p-1"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 mb-1 font-semibold">
            <span>STEP 0{step} OF 4</span>
            <span aria-hidden="true">·</span>
            <span>CONTRIBUTOR ONBOARDING</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            {step === 1 && '1. Connect GitHub Profile & Documents'}
            {step === 2 && '2. Experience & Contribution Goals'}
            {step === 3 && '3. Optional Practical Assessment'}
            {step === 4 && '4. Review AI Profile (Gemma Analyzed)'}
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            {step === 1 && 'Provide your real GitHub handle to inspect public repos, stars, and demonstrated languages.'}
            {step === 2 && 'Answer 5 quick multiple-choice questions to tailor mission recommendations.'}
            {step === 3 && 'Take a short 3-question quiz to demonstrate practical Git & OSS workflow knowledge.'}
            {step === 4 && 'Review how Gemma separated claimed skills from demonstrated repositories.'}
          </p>
        </div>

        {/* STEP 1: Profile Inputs with Real GitHub Fetch */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                GitHub Username or Profile URL <span className="text-emerald-600">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={githubUsername}
                  onChange={(e) => setGithubUsername(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      verifyGithubAccount();
                    }
                  }}
                  placeholder="e.g. your-github-handle or torvalds"
                  className="flex-1 rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-600 focus:outline-none shadow-2xs font-mono"
                />
                <button
                  type="button"
                  onClick={() => verifyGithubAccount()}
                  disabled={isVerifyingGithub || !githubUsername.trim()}
                  className="px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-emerald-800 border border-slate-200 font-semibold text-xs rounded-xl transition disabled:opacity-50 whitespace-nowrap flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Search className="h-3.5 w-3.5 text-emerald-600" />
                  <span>{isVerifyingGithub ? 'Verifying...' : 'Verify on GitHub'}</span>
                </button>
              </div>

              {/* GitHub Verification Feedback Badge */}
              {verifiedGithub && (
                <div className="mt-3">
                  {verifiedGithub.exists ? (
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3.5 flex items-start gap-3">
                      <img
                        src={verifiedGithub.profile.avatarUrl}
                        alt={verifiedGithub.profile.login}
                        className="h-11 w-11 rounded-lg border border-emerald-300 object-cover shadow-2xs"
                      />
                      <div className="text-xs space-y-0.5">
                        <div className="flex items-center gap-2">
                          <strong className="text-slate-900 font-bold">@{verifiedGithub.profile.login}</strong>
                          <span className="text-[10px] text-emerald-800 bg-emerald-100/70 border border-emerald-300 px-2 py-0.5 rounded font-semibold">
                            Verified GitHub Account
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 font-mono">
                          {verifiedGithub.profile.publicRepos} Public Repos · {verifiedGithub.profile.followers} Followers
                        </p>
                        {verifiedGithub.topLanguages && verifiedGithub.topLanguages.length > 0 && (
                          <p className="text-[11px] text-sky-800 font-medium">
                            Demonstrated Languages: <strong>{verifiedGithub.topLanguages.join(', ')}</strong>
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
                      <span>{verifiedGithub.message}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Portfolio Website (Optional)
              </label>
              <input
                type="url"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                placeholder="https://myportfolio.dev"
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-600 focus:outline-none shadow-2xs font-mono"
              />
            </div>

            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Resume / CV Document (Optional - PDF, DOCX, TXT)
              </label>
              <div className="rounded-xl border-2 border-dashed border-slate-200 p-5 text-center hover:border-slate-300 transition bg-slate-50/50">
                <input
                  type="file"
                  id="resume-upload"
                  onChange={handleFileUpload}
                  accept=".pdf,.docx,.txt"
                  className="hidden"
                />
                <label htmlFor="resume-upload" className="cursor-pointer block">
                  <Upload className="mx-auto h-6 w-6 text-slate-400 mb-2" />
                  <span className="text-xs text-slate-800 font-semibold">Click to select resume document</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">Resume submission is optional. No personal storage required.</p>
                </label>
                {resumeFileName && (
                  <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 font-medium">
                    <FileText className="h-3.5 w-3.5 text-emerald-600" />
                    <span>{resumeFileName}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setStep(2)}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white font-semibold text-xs rounded-xl hover:bg-emerald-500 transition shadow-sm cursor-pointer"
              >
                <span>Continue to Assessment</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: 5 Multiple Choice Questions */}
        {step === 2 && (
          <div className="space-y-5 max-h-[60vh] overflow-y-auto pr-1">
            {/* Question 1: Experience */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-2">
                1. What describes your programming experience?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { key: 'beginner', label: 'Just getting started' },
                  { key: 'fundamentals', label: 'I understand fundamentals' },
                  { key: 'personal_projects', label: "I've built personal projects" },
                  { key: 'real_world', label: "I've worked on real-world projects" },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setExperienceLevel(item.key as ExperienceLevel)}
                    className={`text-left p-3 rounded-xl border text-xs transition cursor-pointer ${
                      experienceLevel === item.key
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-semibold shadow-2xs'
                        : 'border-slate-200 bg-slate-50/60 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Question 2: Technologies */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-2">
                2. Which technologies are you comfortable with? (Select all that apply)
              </label>
              <div className="flex flex-wrap gap-2">
                {['TypeScript', 'JavaScript', 'Python', 'React', 'Node.js', 'Go', 'Rust', 'Java', 'HTML/CSS'].map((tech) => (
                  <button
                    key={tech}
                    type="button"
                    onClick={() => toggleLanguage(tech)}
                    className={`px-3 py-1.5 rounded-lg border text-xs transition cursor-pointer ${
                      preferredLanguages.includes(tech)
                        ? 'border-sky-600 bg-sky-50 text-sky-900 font-semibold shadow-2xs'
                        : 'border-slate-200 bg-slate-50/60 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {tech}
                  </button>
                ))}
              </div>
            </div>

            {/* Question 3: Contribution Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-2">
                3. What type of contribution interests you? (Select all that apply)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: 'bugs', label: 'Fixing bugs' },
                  { key: 'features', label: 'Building features' },
                  { key: 'documentation', label: 'Improving documentation' },
                  { key: 'tests', label: 'Writing tests' },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => toggleInterest(item.key as ContributionInterest)}
                    className={`text-left p-3 rounded-xl border text-xs transition cursor-pointer ${
                      contributionInterests.includes(item.key as ContributionInterest)
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-semibold shadow-2xs'
                        : 'border-slate-200 bg-slate-50/60 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Question 4: Git Familiarity */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-2">
                4. How familiar are you with Git and GitHub?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { key: 'completely_new', label: "I'm completely new" },
                  { key: 'basic_commands', label: 'I know basic Git commands' },
                  { key: 'branches_prs', label: "I've used branches & PRs" },
                  { key: 'experienced_contributor', label: "I've contributed to repos before" },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setGitFamiliarity(item.key as GitFamiliarity)}
                    className={`text-left p-3 rounded-xl border text-xs transition cursor-pointer ${
                      gitFamiliarity === item.key
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-semibold shadow-2xs'
                        : 'border-slate-200 bg-slate-50/60 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Question 5: Main Goal */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-2">
                5. What is your main goal?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { key: 'first_contribution', label: 'Make my first open-source contribution' },
                  { key: 'improve_skills', label: 'Improve my programming skills' },
                  { key: 'portfolio', label: 'Build a stronger developer portfolio' },
                  { key: 'collaboration', label: 'Gain experience collaborating on real projects' },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setMainGoal(item.key as MainGoal)}
                    className={`text-left p-3 rounded-xl border text-xs transition cursor-pointer ${
                      mainGoal === item.key
                        ? 'border-violet-600 bg-violet-50 text-violet-900 font-semibold shadow-2xs'
                        : 'border-slate-200 bg-slate-50/60 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 text-xs font-semibold text-slate-700 rounded-xl hover:bg-slate-50 transition cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowQuiz(true);
                    setStep(3);
                  }}
                  className="px-3.5 py-2 border border-slate-200 text-xs text-slate-700 rounded-xl hover:bg-slate-50 transition cursor-pointer"
                >
                  Optional Quick Quiz
                </button>
                <button
                  onClick={runAiAnalysis}
                  className="flex items-center gap-2 px-5 py-2 bg-emerald-600 text-white font-semibold text-xs rounded-xl hover:bg-emerald-500 transition shadow-sm cursor-pointer"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Analyze Profile with Gemma
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Optional Practical Assessment */}
        {step === 3 && (
          <div className="space-y-4">
            <p className="text-xs text-slate-600">
              This optional 3-question practical check helps Gemma gauge your current familiarity with Git workflows.
            </p>

            <div className="space-y-3.5 max-h-[55vh] overflow-y-auto pr-1">
              {TECHNICAL_QUIZ_QUESTIONS.map((q, idx) => (
                <div key={q.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60">
                  <p className="text-xs font-semibold text-slate-900 mb-2">
                    {idx + 1}. {q.question}
                  </p>
                  <div className="space-y-1.5">
                    {q.options.map((opt, optIdx) => (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => setQuizAnswers({ ...quizAnswers, [q.id]: optIdx })}
                        className={`w-full text-left p-2.5 rounded-lg text-xs transition cursor-pointer ${
                          quizAnswers[q.id] === optIdx
                            ? 'bg-emerald-50 border border-emerald-300 text-emerald-900 font-semibold shadow-2xs'
                            : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
              <button
                onClick={() => setStep(2)}
                className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 text-xs font-semibold text-slate-700 rounded-xl hover:bg-slate-50 transition cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to Questions
              </button>

              <button
                onClick={runAiAnalysis}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white font-semibold text-xs rounded-xl hover:bg-emerald-500 transition shadow-sm cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Generate Profile
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Review AI Profile */}
        {step === 4 && (
          <div className="space-y-4">
            {isAnalyzing ? (
              <div className="py-12 text-center space-y-3">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent"></div>
                <p className="text-sm font-semibold text-slate-800">Gemma is analyzing your profile & GitHub data...</p>
                <p className="text-xs text-slate-500">Distinguishing claimed skills from demonstrated capabilities in public repositories</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                {/* AI Model Badge */}
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="flex items-center gap-1.5 text-sky-800 font-medium">
                    <Sparkles className="h-3.5 w-3.5 text-sky-600" />
                    <span>Inference Model: {modelUsedInfo}</span>
                  </span>
                  <span>
                    GitHub Grounding: <strong className={verifiedGithub?.exists ? 'text-emerald-700' : 'text-slate-500'}>{verifiedGithub?.exists ? 'Verified Active' : 'Self-Reported'}</strong>
                  </span>
                </div>

                <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-2xs">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <span className="text-xs text-slate-500 block">Suggested Starting Difficulty</span>
                      <span className="text-sm font-bold text-emerald-700">{generatedProfile.suggestedDifficulty}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-500 block">Contributor Rank</span>
                      <span className="text-sm font-mono font-bold text-violet-700">Rank 1 · Scout</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed italic bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 font-sans">
                    "{generatedProfile.summary}"
                  </p>

                  {/* Claimed vs Demonstrated Skills */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
                      <span className="text-[11px] font-mono uppercase text-slate-500 block mb-1.5 font-semibold">
                        Claimed Skills (Reported)
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {generatedProfile.skillsClaimed.map((s, idx) => (
                          <span key={idx} className="text-xs text-slate-700">
                            {s}{idx < generatedProfile.skillsClaimed.length - 1 ? ' ·' : ''}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/60">
                      <span className="text-[11px] font-mono uppercase text-emerald-800 block mb-1.5 font-semibold">
                        Demonstrated Skills (Verified)
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {generatedProfile.skillsDemonstrated.map((s, idx) => (
                          <span key={idx} className="text-xs text-emerald-800 font-semibold">
                            {s}{idx < generatedProfile.skillsDemonstrated.length - 1 ? ' ·' : ''}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-mono uppercase text-sky-800 block mb-1.5 font-semibold">
                      Target Repository Recommendations
                    </span>
                    <div className="flex flex-wrap gap-2 text-xs text-slate-700">
                      {generatedProfile.recommendedTags.map((tag, idx) => (
                        <span key={idx} className="bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-md font-mono">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                  <button
                    onClick={() => setStep(2)}
                    className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 text-xs font-semibold text-slate-700 rounded-xl hover:bg-slate-50 transition cursor-pointer"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Modify Answers
                  </button>

                  <button
                    onClick={handleFinalize}
                    className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white font-semibold text-xs rounded-xl hover:bg-emerald-500 transition shadow-sm cursor-pointer"
                  >
                    <Check className="h-4 w-4" />
                    Save & Explore Matching Missions
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
