export type ExperienceLevel = 'beginner' | 'fundamentals' | 'personal_projects' | 'real_world';

export type ContributionInterest = 'bugs' | 'features' | 'documentation' | 'tests';

export type GitFamiliarity = 'completely_new' | 'basic_commands' | 'branches_prs' | 'experienced_contributor';

export type MainGoal = 'first_contribution' | 'improve_skills' | 'portfolio' | 'collaboration';

export interface UserProfile {
  id: string;
  githubUsername: string;
  avatarUrl: string;
  experienceLevel: ExperienceLevel;
  preferredLanguages: string[];
  contributionInterests: ContributionInterest[];
  gitFamiliarity: GitFamiliarity;
  mainGoal: MainGoal;
  skillsClaimed: string[];
  skillsDemonstrated: string[];
  suggestedDifficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  totalXp: number;
  level: number;
  streakDays: number;
  etiquetteScore: number; // 0 - 100
  badges: string[];
  completedMissionIds: string[];
  activeMissionId?: string;
  summary?: string;
  resumeFileName?: string;
  portfolioUrl?: string;
  githubData?: {
    publicRepos: number;
    topLanguages: string[];
    bio?: string;
    htmlUrl?: string;
  };
  createdAt: string;
}

export interface AssessmentState {
  experienceLevel?: ExperienceLevel;
  preferredLanguages: string[];
  contributionInterests: ContributionInterest[];
  gitFamiliarity?: GitFamiliarity;
  mainGoal?: MainGoal;
  resumeText?: string;
  resumeFileName?: string;
  portfolioUrl?: string;
  technicalAnswers: Record<string, string>;
}

export interface Repository {
  id: string;
  owner: string;
  name: string;
  description: string;
  stars: number;
  forks: number;
  primaryLanguage: string;
  healthScore: number; // 0 - 100
  lastCommitDaysAgo: number;
  maintainerResponseHours: number;
  openIssuesCount: number;
  hasContributingGuide: boolean;
  hasCodeOfConduct: boolean;
  repoUrl: string;
  avatarUrl: string;
}

export type MissionDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';
export type MissionType = 'bug' | 'feature' | 'docs' | 'tests';

export interface Mission {
  id: string;
  repoId: string;
  repoName: string;
  repoOwner: string;
  issueNumber: number;
  title: string;
  description: string;
  issueUrl: string;
  difficulty: MissionDifficulty;
  type: MissionType;
  technologies: string[];
  xpReward: number;
  isAssigned: boolean;
  availabilityStatus: 'verified_open' | 'under_review' | 'recently_assigned';
  aiExplanation: string;
  whyRecommended: string;
  estimatedHours: number;
  keyFiles: string[];
  hints: {
    level1: string; // High-level conceptual nudge
    level2: string; // Specific file/function pointers
    level3: string; // Code snippet / implementation strategy
  };
}

export interface MissionProgress {
  missionId: string;
  currentStage: number; // 1 to 8
  stageChecklists: Record<number, boolean[]>;
  unlockedHintLevel: number; // 0, 1, 2, 3
  solutionNotes: string;
  draftPr: {
    branchName: string;
    title: string;
    body: string;
  };
  maintainerFeedback?: {
    approved: boolean;
    reviewer: string;
    comment: string;
  };
  completed: boolean;
  completedAt?: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  iconName: string;
  category: 'first_steps' | 'etiquette' | 'technical' | 'streak';
  xpBonus: number;
}

export interface MentorChatMessage {
  id: string;
  sender: 'user' | 'gemma';
  text: string;
  timestamp: string;
  suggestedPrompts?: string[];
  etiquetteTip?: string;
}
