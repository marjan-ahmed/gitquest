import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { WelcomeLanding } from './components/WelcomeLanding';
import { OnboardingModal } from './components/OnboardingModal';
import { MissionExplorer } from './components/MissionExplorer';
import { MissionWorkspace } from './components/MissionWorkspace';
import { EtiquetteGuide } from './components/EtiquetteGuide';
import { RepoHealthRadar } from './components/RepoHealthRadar';
import { ProfileView } from './components/ProfileView';
import { UserProfile, Mission } from './types';
import {
  getStoredProfile,
  saveStoredProfile,
  clearStoredSession,
  getAllMissions,
  DEFAULT_PROFILE,
} from './services/storage';
import { Sparkles, ArrowRight, UserPlus } from 'lucide-react';

export default function App() {
  const [profile, setProfile] = useState<UserProfile | null>(() => getStoredProfile());
  const [missions, setMissions] = useState<Mission[]>(() => getAllMissions());
  const [currentTab, setCurrentTab] = useState<string>(() => (getStoredProfile() ? 'explorer' : 'landing'));
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Active Mission
  const activeMission =
    missions.find((m) => m.id === profile?.activeMissionId) || missions[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3800);
  };

  const handleLogout = () => {
    clearStoredSession();
    setProfile(null);
    setCurrentTab('landing');
    showToast('Session reset. You can now experience the full onboarding and contribution flow.');
  };

  const handleLoadDemo = () => {
    saveStoredProfile(DEFAULT_PROFILE);
    setProfile(DEFAULT_PROFILE);
    setCurrentTab('explorer');
    showToast('Loaded demo contributor session (@octo-dev).');
  };

  const handleSelectMission = (selected: Mission) => {
    if (!profile) {
      setIsOnboardingOpen(true);
      showToast('Please complete your quick onboarding to start this mission!');
      return;
    }

    const updated: UserProfile = {
      ...profile,
      activeMissionId: selected.id,
    };
    setProfile(updated);
    saveStoredProfile(updated);
    setCurrentTab('workspace');
    showToast(`Mission "${selected.title}" is now active in your workspace!`);
  };

  const handleMissionCompleted = (xpEarned: number) => {
    if (!profile) return;
    const currentCompleted = profile.completedMissionIds || [];
    const updatedMissionIds = currentCompleted.includes(activeMission.id)
      ? currentCompleted
      : [...currentCompleted, activeMission.id];

    const updated: UserProfile = {
      ...profile,
      totalXp: profile.totalXp + xpEarned,
      completedMissionIds: updatedMissionIds,
    };
    setProfile(updated);
    saveStoredProfile(updated);
    showToast(`🎉 Mission Completed! +${xpEarned} XP awarded and portfolio updated.`);
  };

  const handleProfileUpdated = (updated: UserProfile) => {
    setProfile(updated);
    saveStoredProfile(updated);
    setCurrentTab('explorer');
    showToast(`Welcome @${updated.githubUsername}! Contributor profile established.`);
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-lg border border-emerald-500/40 bg-slate-900 px-4 py-3 text-xs text-white shadow-2xl shadow-emerald-950/50 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Sparkles className="h-4 w-4 text-emerald-400 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Main Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        profile={profile}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        onLogout={handleLogout}
        onLoadDemo={handleLoadDemo}
        hasActiveMission={Boolean(activeMission && profile)}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {/* Landing Overview (shown when logged out or requested) */}
        {currentTab === 'landing' && (
          <WelcomeLanding
            onStartOnboarding={() => setIsOnboardingOpen(true)}
            onLoadDemo={handleLoadDemo}
            onExplorePublicMissions={() => setCurrentTab('explorer')}
          />
        )}

        {/* Mission Explorer */}
        {currentTab === 'explorer' && (
          <MissionExplorer
            missions={missions}
            userProfile={profile || DEFAULT_PROFILE}
            onSelectMission={handleSelectMission}
            activeMissionId={profile?.activeMissionId}
          />
        )}

        {/* Mission Workspace (8-Stage guided flow) */}
        {currentTab === 'workspace' && activeMission && profile && (
          <MissionWorkspace
            mission={activeMission}
            onMissionCompleted={handleMissionCompleted}
            onBackToExplorer={() => setCurrentTab('explorer')}
          />
        )}

        {/* Etiquette Guide */}
        {currentTab === 'etiquette' && (
          <EtiquetteGuide
            userProfile={profile || DEFAULT_PROFILE}
            onUpdateProfile={handleProfileUpdated}
          />
        )}

        {/* Repo Health Radar */}
        {currentTab === 'radar' && <RepoHealthRadar />}

        {/* Profile & Badges */}
        {currentTab === 'profile' && profile && (
          <ProfileView
            profile={profile}
            allMissions={missions}
            onOpenOnboarding={() => setIsOnboardingOpen(true)}
            onSelectMission={handleSelectMission}
            onLogout={handleLogout}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">GitQuest MVP</span>
            <span aria-hidden="true">·</span>
            <span>AI-Powered Open-Source Contributor Platform</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            {profile ? (
              <>
                <span>Logged in as <strong className="text-slate-200">@{profile.githubUsername}</strong></span>
                <span aria-hidden="true">·</span>
                <button
                  onClick={handleLogout}
                  className="text-rose-400 hover:text-rose-300 transition"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleLoadDemo}
                  className="hover:text-cyan-400 transition"
                >
                  Load Demo Account
                </button>
                <span aria-hidden="true">·</span>
                <button
                  onClick={() => setIsOnboardingOpen(true)}
                  className="text-emerald-400 hover:text-emerald-300 transition"
                >
                  Start Onboarding
                </button>
              </>
            )}
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setCurrentTab('etiquette')}
              className="hover:text-emerald-400 transition"
            >
              Etiquette Standards
            </button>
          </div>
        </div>
      </footer>

      {/* Onboarding / Assessment Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onCompleted={handleProfileUpdated}
        initialProfile={profile}
      />
    </div>
  );
}
