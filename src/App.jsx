import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Footer from './components/Footer';
import GoogleAuthModal from './components/GoogleAuthModal';
import BonusWheelModal from './components/BonusWheelModal';
import PracticeHub from './components/PracticeHub';
import IdeIntegrated from './components/IdeIntegrated';
import PatternsHub from './components/PatternsHub';
import ShortcutsHub from './components/ShortcutsHub';
import InterviewsHub from './components/InterviewsHub';
import BadgesHub from './components/BadgesHub';
import FinalAssessment from './components/FinalAssessment';
import CertificateView from './components/CertificateView';

import { CHALLENGES_DATA } from './data/challengesData';
import { 
  getUserProfile, 
  saveUserProfile, 
  clearUserProfile,
  getSolvedChallenges, 
  getScoreStats, 
  getFinalAssessmentStatus,
  awardBadge
} from './utils/storage';
import { 
  auth, 
  onAuthStateChanged, 
  logOutFirebase, 
  syncLearnerStateToFirestore, 
  fetchLearnerStateFromFirestore 
} from './utils/firebase';

export default function App() {
  const [activeTab, setActiveTab] = useState('practice');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isWheelOpen, setIsWheelOpen] = useState(false);
  
  const [userProfile, setUserProfile] = useState(getUserProfile());
  const [solvedChallenges, setSolvedChallenges] = useState(getSolvedChallenges());
  const [stats, setStats] = useState(getScoreStats());
  const [assessmentStatus, setAssessmentStatus] = useState(getFinalAssessmentStatus());

  // Active challenge loaded in IDE
  const [selectedChallenge, setSelectedChallenge] = useState(CHALLENGES_DATA[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [negativeMarkingEnabled, setNegativeMarkingEnabled] = useState(true);

  // Sync state on mount and updates
  const refreshStats = (currentUid = userProfile?.uid) => {
    const newStats = getScoreStats();
    const newSolved = getSolvedChallenges();
    const newAssessment = getFinalAssessmentStatus();

    setStats(newStats);
    setSolvedChallenges(newSolved);
    setAssessmentStatus(newAssessment);

    // Sync to Firestore if user logged in via Firebase
    if (currentUid) {
      syncLearnerStateToFirestore(currentUid, {
        stats: newStats,
        solvedChallenges: newSolved,
        assessmentStatus: newAssessment
      });
    }
  };

  // Listen to Firebase Auth state on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const profile = {
          uid: fbUser.uid,
          name: fbUser.displayName || 'Google Verified Learner',
          email: fbUser.email,
          photo: fbUser.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fbUser.displayName || 'User')}&backgroundColor=0f172a&textColor=ffffff`,
          authProvider: 'Google OAuth 2.0 (Firebase)',
          googleId: fbUser.uid,
          verifiedAt: new Date().toISOString()
        };
        saveUserProfile(profile);
        setUserProfile(profile);

        // Fetch cloud progress from Firestore if available
        const cloudState = await fetchLearnerStateFromFirestore(fbUser.uid);
        if (cloudState && cloudState.stats) {
          // Cloud state present
          refreshStats(fbUser.uid);
        } else {
          refreshStats(fbUser.uid);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    refreshStats();
  }, [activeTab]);

  const handleAuthSuccess = (profile) => {
    setUserProfile(profile);
    refreshStats(profile.uid);
  };

  const handleLogout = async () => {
    await logOutFirebase();
    clearUserProfile();
    setUserProfile(null);
    refreshStats(null);
  };

  const handleSelectChallenge = (challenge) => {
    setSelectedChallenge(challenge);
    setActiveTab('ide');
  };

  const handleChallengePassed = (challenge) => {
    refreshStats();
    awardBadge('syntax_slayer');
    if (challenge.difficulty === 'Hard') {
      if (challenge.language.includes('AI Portal')) {
        awardBadge('ai_agent_auditor');
      } else {
        awardBadge('concurrency_surgeon');
      }
    }
  };

  const handleWrongSubmission = (challenge) => {
    refreshStats();
  };

  const handleRewardEarned = (reward) => {
    refreshStats();
  };

  const handleAssessmentCompleted = (status) => {
    setAssessmentStatus(status);
    refreshStats();
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 font-sans text-slate-900">
      {/* Left Navigation Bar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        userProfile={userProfile}
        onOpenAuth={() => setIsAuthOpen(true)}
        stats={stats}
        assessmentStatus={assessmentStatus}
        onOpenWheel={() => setIsWheelOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <Header
          userProfile={userProfile}
          onOpenAuth={() => setIsAuthOpen(true)}
          onLogout={handleLogout}
          onOpenWheel={() => setIsWheelOpen(true)}
          stats={stats}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          negativeMarkingEnabled={negativeMarkingEnabled}
          setNegativeMarkingEnabled={setNegativeMarkingEnabled}
        />

        {/* Viewport View */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 flex flex-col">
          <div className="flex-1 max-w-7xl w-full mx-auto">
            {/* View Switcher */}
            {activeTab === 'practice' && (
              <PracticeHub
                onSelectChallenge={handleSelectChallenge}
                solvedIds={solvedChallenges}
              />
            )}

            {activeTab === 'ide' && (
              <div className="h-[calc(100vh-160px)]">
                {/* Quick Challenge Selector within IDE view */}
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-700">Active Challenge:</span>
                    <select
                      value={selectedChallenge.id}
                      onChange={(e) => {
                        const found = CHALLENGES_DATA.find(c => c.id === e.target.value);
                        if (found) setSelectedChallenge(found);
                      }}
                      className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
                    >
                      {CHALLENGES_DATA.map(c => (
                        <option key={c.id} value={c.id}>
                          [{c.language}] {c.title} ({c.difficulty})
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={() => setActiveTab('practice')}
                    className="text-xs text-slate-500 hover:text-slate-900 font-semibold"
                  >
                    &larr; Back to Catalog
                  </button>
                </div>

                <IdeIntegrated
                  challenge={selectedChallenge}
                  isExamMode={false}
                  onChallengePassed={handleChallengePassed}
                  onWrongSubmission={handleWrongSubmission}
                />
              </div>
            )}

            {activeTab === 'patterns' && <PatternsHub />}

            {activeTab === 'shortcuts' && <ShortcutsHub />}

            {activeTab === 'interviews' && (
              <InterviewsHub
                onOpenIdeWithSnippet={() => setActiveTab('ide')}
              />
            )}

            {activeTab === 'badges' && (
              <BadgesHub
                userProfile={userProfile}
                assessmentStatus={assessmentStatus}
                onOpenAuth={() => setIsAuthOpen(true)}
              />
            )}

            {activeTab === 'assessment' && (
              <FinalAssessment
                userProfile={userProfile}
                onOpenAuth={() => setIsAuthOpen(true)}
                onAssessmentCompleted={handleAssessmentCompleted}
              />
            )}

            {activeTab === 'certificate' && (
              <CertificateView
                userProfile={userProfile}
                onOpenAuth={() => setIsAuthOpen(true)}
                onSelectTab={setActiveTab}
              />
            )}
          </div>

          {/* Corporate Footer (Hidden during IDE and Proctored Assessment to maximize screen real-estate) */}
          {activeTab !== 'ide' && activeTab !== 'assessment' && (
            <Footer
              onOpenAuth={() => setIsAuthOpen(true)}
              onSelectTab={setActiveTab}
            />
          )}
        </main>
      </div>

      {/* Google Auth Modal */}
      <GoogleAuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Bonus Wheel Modal */}
      <BonusWheelModal
        isOpen={isWheelOpen}
        onClose={() => setIsWheelOpen(false)}
        onRewardEarned={handleRewardEarned}
      />
    </div>
  );
}
