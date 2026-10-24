import { UserProfile, MissionProgress, Mission } from '../types';
import { CURATED_MISSIONS, BADGES } from '../data/curatedData';

const PROFILE_KEY = 'gitquest_user_profile_v1';
const PROGRESS_KEY = 'gitquest_mission_progress_v1';
const CUSTOM_MISSIONS_KEY = 'gitquest_custom_missions_v1';

export const DEFAULT_PROFILE: UserProfile = {
  id: 'guest-contributor',
  githubUsername: 'octo-dev',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
  experienceLevel: 'fundamentals',
  preferredLanguages: ['TypeScript', 'JavaScript', 'React'],
  contributionInterests: ['bugs', 'documentation'],
  gitFamiliarity: 'basic_commands',
  mainGoal: 'first_contribution',
  skillsClaimed: ['JavaScript', 'HTML/CSS', 'React Basics'],
  skillsDemonstrated: ['Git Fundamentals', 'Issue Analysis'],
  suggestedDifficulty: 'Beginner',
  totalXp: 180,
  level: 1,
  streakDays: 3,
  etiquetteScore: 92,
  badges: ['badge-first-contact'],
  completedMissionIds: [],
  activeMissionId: 'mission-excalidraw-eraser-tooltip',
  createdAt: new Date().toISOString(),
};

export function calculateLevel(xp: number): {
  level: number;
  title: string;
  currentXp: number;
  nextLevelXp: number;
  progressPercent: number;
  progress: number;
  nextLevel: { level: number; title: string; minXp: number } | null;
} {
  const levels = [0, 250, 600, 1100, 1800, 2700, 3800, 5200];
  const titles = ['Scout', 'Initiate', 'Operative', 'Specialist', 'Commander', 'Architect', 'Master', 'Legend'];
  let level = 1;
  for (let i = 0; i < levels.length; i++) {
    if (xp >= levels[i]) {
      level = i + 1;
    } else {
      break;
    }
  }

  const baseForCurrent = levels[level - 1] || 0;
  const nextTarget = levels[level] || baseForCurrent + 1000;
  const xpIntoLevel = xp - baseForCurrent;
  const xpRequired = nextTarget - baseForCurrent;
  const progressPercent = Math.min(100, Math.max(0, Math.round((xpIntoLevel / xpRequired) * 100)));
  const title = titles[Math.min(titles.length - 1, level - 1)] || 'Contributor';

  const hasNext = level < levels.length;
  const nextLevel = hasNext
    ? {
        level: level + 1,
        title: titles[Math.min(titles.length - 1, level)],
        minXp: nextTarget,
      }
    : null;

  return {
    level,
    title,
    currentXp: xp,
    nextLevelXp: nextTarget,
    progressPercent,
    progress: progressPercent,
    nextLevel,
  };
}

export function getStoredProfile(): UserProfile | null {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to load profile:', err);
  }
  return null;
}

export function saveStoredProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (err) {
    console.error('Failed to save profile:', err);
  }
}

export function clearStoredSession(): void {
  try {
    localStorage.removeItem(PROFILE_KEY);
    localStorage.removeItem(PROGRESS_KEY);
    localStorage.removeItem(CUSTOM_MISSIONS_KEY);
  } catch (err) {
    console.error('Failed to clear session:', err);
  }
}

export function getStoredProgress(): Record<string, MissionProgress> {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to load mission progress:', err);
  }
  return {};
}

export function saveStoredProgress(allProgress: Record<string, MissionProgress>): void {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(allProgress));
  } catch (err) {
    console.error('Failed to save mission progress:', err);
  }
}

export function getMissionProgress(missionId: string): MissionProgress {
  const all = getStoredProgress();
  if (all[missionId]) {
    return all[missionId];
  }

  // Default empty progress
  const defaultProgress: MissionProgress = {
    missionId,
    currentStage: 1,
    stageChecklists: {
      1: [false, false],
      2: [false, false, false],
      3: [false, false],
      4: [false, false, false],
      5: [false, false],
      6: [false, false, false],
      7: [false, false],
      8: [false],
    },
    unlockedHintLevel: 0,
    solutionNotes: '',
    draftPr: {
      branchName: `fix/issue-${missionId.replace('mission-', '')}`,
      title: '',
      body: '',
    },
    completed: false,
  };
  return defaultProgress;
}

export function updateMissionProgress(progress: MissionProgress): void {
  const all = getStoredProgress();
  all[progress.missionId] = progress;
  saveStoredProgress(all);
}

export function awardXpAndBadges(
  xpToAdd: number,
  badgeIdsToUnlock: string[] = []
): { profile: UserProfile; newlyUnlockedBadges: string[]; leveledUp: boolean } {
  const profile = getStoredProfile() || DEFAULT_PROFILE;
  const oldLevelInfo = calculateLevel(profile.totalXp);
  const newTotalXp = profile.totalXp + xpToAdd;
  const newLevelInfo = calculateLevel(newTotalXp);

  const newlyUnlockedBadges: string[] = [];
  const updatedBadges = [...profile.badges];

  badgeIdsToUnlock.forEach((id) => {
    if (!updatedBadges.includes(id)) {
      updatedBadges.push(id);
      newlyUnlockedBadges.push(id);
    }
  });

  const updatedProfile: UserProfile = {
    ...profile,
    totalXp: newTotalXp,
    level: newLevelInfo.level,
    badges: updatedBadges,
  };

  saveStoredProfile(updatedProfile);

  return {
    profile: updatedProfile,
    newlyUnlockedBadges,
    leveledUp: newLevelInfo.level > oldLevelInfo.level,
  };
}

export function getAllMissions(): Mission[] {
  try {
    const rawCustom = localStorage.getItem(CUSTOM_MISSIONS_KEY);
    const custom: Mission[] = rawCustom ? JSON.parse(rawCustom) : [];
    return [...CURATED_MISSIONS, ...custom];
  } catch {
    return CURATED_MISSIONS;
  }
}

export function addCustomMission(mission: Mission): void {
  try {
    const rawCustom = localStorage.getItem(CUSTOM_MISSIONS_KEY);
    const custom: Mission[] = rawCustom ? JSON.parse(rawCustom) : [];
    custom.unshift(mission);
    localStorage.setItem(CUSTOM_MISSIONS_KEY, JSON.stringify(custom));
  } catch (err) {
    console.error('Failed to add custom mission:', err);
  }
}
