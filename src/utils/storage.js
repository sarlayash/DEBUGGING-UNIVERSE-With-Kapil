// LocalStorage Manager for DEBUGGING UNIVERSE With Kapil (Powered By SarlaYash Mission)

const STORAGE_KEYS = {
  USER_PROFILE: 'du_user_profile',
  SOLVED_CHALLENGES: 'du_solved_challenges',
  ATTEMPTED_CHALLENGES: 'du_attempted_challenges',
  SCORES: 'du_scores',
  WHEEL_STATE: 'du_wheel_state',
  EARNED_BADGES: 'du_earned_badges',
  FINAL_ASSESSMENT: 'du_final_assessment_status',
  INTERVIEWS_COMPLETED: 'du_interviews_completed',
  PATTERNS_STUDIED: 'du_patterns_studied',
};

// Default Google Guest User (Requires signing in with Google for official verification & certification)
const DEFAULT_USER = null;

export const getUserProfile = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error('Failed to load user profile', e);
    return null;
  }
};

export const saveUserProfile = (profile) => {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save user profile', e);
  }
};

export const clearUserProfile = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
  } catch (e) {
    console.error('Failed to clear user profile', e);
  }
};

export const getSolvedChallenges = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SOLVED_CHALLENGES);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

export const markChallengeSolved = (challengeId, scoreAwarded) => {
  try {
    const solved = getSolvedChallenges();
    if (!solved.includes(challengeId)) {
      solved.push(challengeId);
      localStorage.setItem(STORAGE_KEYS.SOLVED_CHALLENGES, JSON.stringify(solved));
    }
    updateScore(scoreAwarded);
  } catch (e) {
    console.error('Failed to mark challenge solved', e);
  }
};

export const getScoreStats = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SCORES);
    return data ? JSON.parse(data) : { xp: 120, streak: 3, negativePointsDeducted: 0, totalQuestionsSolved: 0, accuracy: 92 };
  } catch (e) {
    return { xp: 120, streak: 3, negativePointsDeducted: 0, totalQuestionsSolved: 0, accuracy: 92 };
  }
};

export const updateScore = (deltaXP, isPenalty = false) => {
  try {
    const current = getScoreStats();
    if (isPenalty) {
      current.xp = Math.max(0, current.xp - Math.abs(deltaXP));
      current.negativePointsDeducted = (current.negativePointsDeducted || 0) + Math.abs(deltaXP);
    } else {
      current.xp += deltaXP;
      current.totalQuestionsSolved = (current.totalQuestionsSolved || 0) + 1;
    }
    localStorage.setItem(STORAGE_KEYS.SCORES, JSON.stringify(current));
    return current;
  } catch (e) {
    return { xp: 100, streak: 1, negativePointsDeducted: 0, totalQuestionsSolved: 0, accuracy: 90 };
  }
};

export const getWheelState = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.WHEEL_STATE);
    return data ? JSON.parse(data) : { lastSpinDate: null, spinsRemaining: 1, bonusTokens: 2 };
  } catch (e) {
    return { lastSpinDate: null, spinsRemaining: 1, bonusTokens: 2 };
  }
};

export const recordWheelSpin = (reward) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const state = { lastSpinDate: today, spinsRemaining: 0, bonusTokens: 2, lastReward: reward };
    localStorage.setItem(STORAGE_KEYS.WHEEL_STATE, JSON.stringify(state));
  } catch (e) {
    console.error('Error saving wheel state', e);
  }
};

export const getEarnedBadges = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.EARNED_BADGES);
    return data ? JSON.parse(data) : ['syntax_slayer'];
  } catch (e) {
    return ['syntax_slayer'];
  }
};

export const awardBadge = (badgeId) => {
  try {
    const current = getEarnedBadges();
    if (!current.includes(badgeId)) {
      current.push(badgeId);
      localStorage.setItem(STORAGE_KEYS.EARNED_BADGES, JSON.stringify(current));
    }
  } catch (e) {
    console.error('Failed to award badge', e);
  }
};

export const getFinalAssessmentStatus = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.FINAL_ASSESSMENT);
    return data ? JSON.parse(data) : {
      status: 'NOT_STARTED', // 'NOT_STARTED' | 'IN_PROGRESS' | 'DISQUALIFIED' | 'COMPLETED'
      startTime: null,
      endTime: null,
      disqualificationReason: null,
      disqualifiedAt: null,
      score: null,
      passed: false,
      certificateId: null,
      violations: []
    };
  } catch (e) {
    return { status: 'NOT_STARTED' };
  }
};

export const saveFinalAssessmentStatus = (statusObj) => {
  try {
    localStorage.setItem(STORAGE_KEYS.FINAL_ASSESSMENT, JSON.stringify(statusObj));
  } catch (e) {
    console.error('Failed to save assessment status', e);
  }
};

export const getInterviewsCompleted = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.INTERVIEWS_COMPLETED);
    return data ? JSON.parse(data) : ['google_latency'];
  } catch (e) {
    return ['google_latency'];
  }
};

export const markInterviewCompleted = (interviewId) => {
  try {
    const data = getInterviewsCompleted();
    if (!data.includes(interviewId)) {
      data.push(interviewId);
      localStorage.setItem(STORAGE_KEYS.INTERVIEWS_COMPLETED, JSON.stringify(data));
    }
  } catch (e) {
    console.error('Failed to mark interview completed', e);
  }
};

export const getPatternsStudied = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PATTERNS_STUDIED);
    return data ? JSON.parse(data) : ['off_by_one', 'race_condition'];
  } catch (e) {
    return ['off_by_one', 'race_condition'];
  }
};

export const markPatternStudied = (patternId) => {
  try {
    const data = getPatternsStudied();
    if (!data.includes(patternId)) {
      data.push(patternId);
      localStorage.setItem(STORAGE_KEYS.PATTERNS_STUDIED, JSON.stringify(data));
    }
  } catch (e) {
    console.error('Failed to mark pattern studied', e);
  }
};
