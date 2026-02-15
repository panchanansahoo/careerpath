// Complete Aptitude Mastery Questions Database
// Total: 252 questions across 18 topics

export const APTITUDE_TOPICS = [
  {
    key: "average",
    name: "Average",
    count: 24,
    icon: "Calculator",
    color: "#818cf8",
  },
  {
    key: "timeDistance",
    name: "Time & Distance",
    count: 16,
    icon: "Timer",
    color: "#f472b6",
  },
  {
    key: "timeWork",
    name: "Time & Work",
    count: 16,
    icon: "Users",
    color: "#34d399",
  },
  {
    key: "hcfLcm",
    name: "HCF & LCM",
    count: 20,
    icon: "Hash",
    color: "#fbbf24",
  },
  { key: "train", name: "Train", count: 24, icon: "Train", color: "#60a5fa" },
  { key: "ages", name: "Ages", count: 16, icon: "Calendar", color: "#a78bfa" },
  {
    key: "profitLoss",
    name: "Profit & Loss",
    count: 20,
    icon: "TrendingUp",
    color: "#10b981",
  },
  {
    key: "permComb",
    name: "Permutations & Combinations",
    count: 8,
    icon: "Shuffle",
    color: "#f59e0b",
  },
  {
    key: "ratioProportion",
    name: "Ratio & Proportion",
    count: 20,
    icon: "Percent",
    color: "#ec4899",
  },
  { key: "area", name: "Area", count: 5, icon: "Square", color: "#8b5cf6" },
  {
    key: "interest",
    name: "Simple & Compound Interest",
    count: 28,
    icon: "DollarSign",
    color: "#14b8a6",
  },
  {
    key: "probability",
    name: "Probability",
    count: 8,
    icon: "Dice5",
    color: "#f43f5e",
  },
  {
    key: "pipes",
    name: "Pipes & Cisterns",
    count: 20,
    icon: "Droplet",
    color: "#06b6d4",
  },
  {
    key: "discount",
    name: "Discount",
    count: 5,
    icon: "Tag",
    color: "#84cc16",
  },
  {
    key: "clocksCalendars",
    name: "Clocks & Calendars",
    count: 8,
    icon: "Clock",
    color: "#f97316",
  },
  {
    key: "heightDistance",
    name: "Height & Distance",
    count: 6,
    icon: "Mountain",
    color: "#6366f1",
  },
  {
    key: "volumeSurface",
    name: "Volume & Surface",
    count: 4,
    icon: "Box",
    color: "#ec4899",
  },
  {
    key: "percentage",
    name: "Percentage",
    count: 4,
    icon: "Percent",
    color: "#22c55e",
  },
];

export const DIFFICULTY_CONFIG = {
  easy: { xp: 10, color: "#22c55e", label: "Easy" },
  medium: { xp: 15, color: "#f59e0b", label: "Medium" },
  hard: { xp: 20, color: "#ef4444", label: "Hard" },
};

// Storage keys
export const STORAGE_KEYS = {
  SOLVED_QUESTIONS: "aptitude_solved_questions",
  USER_ANSWERS: "aptitude_user_answers",
  TOTAL_XP: "aptitude_total_xp",
};

// Get user progress from localStorage
export const getUserProgress = () => {
  const solved = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.SOLVED_QUESTIONS) || "[]",
  );
  const answers = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.USER_ANSWERS) || "{}",
  );
  const totalXP = parseInt(localStorage.getItem(STORAGE_KEYS.TOTAL_XP) || "0");

  return { solved, answers, totalXP };
};

// Save answer and update progress
export const saveAnswer = (questionId, selectedAnswer, correctAnswer, xp) => {
  const { solved, answers, totalXP } = getUserProgress();

  const isCorrect = selectedAnswer === correctAnswer;
  const newAnswers = {
    ...answers,
    [questionId]: { selectedAnswer, isCorrect },
  };

  let newSolved = [...solved];
  let newXP = totalXP;

  if (isCorrect && !solved.includes(questionId)) {
    newSolved.push(questionId);
    newXP += xp;
  }

  localStorage.setItem(
    STORAGE_KEYS.SOLVED_QUESTIONS,
    JSON.stringify(newSolved),
  );
  localStorage.setItem(STORAGE_KEYS.USER_ANSWERS, JSON.stringify(newAnswers));
  localStorage.setItem(STORAGE_KEYS.TOTAL_XP, newXP.toString());

  return { solved: newSolved, answers: newAnswers, totalXP: newXP };
};

// Calculate topic progress
export const getTopicProgress = (topicKey, questions) => {
  const { solved } = getUserProgress();
  const topicQuestionIds = questions.map((q) => q.id);
  const solvedInTopic = solved.filter((id) => topicQuestionIds.includes(id));

  return {
    solved: solvedInTopic.length,
    total: questions.length,
    percentage:
      questions.length > 0
        ? Math.round((solvedInTopic.length / questions.length) * 100)
        : 0,
  };
};
