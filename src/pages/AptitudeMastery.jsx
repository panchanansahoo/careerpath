import React, { useState, useEffect } from 'react';
import { ArrowLeft, Check, X, Trophy, Zap, BookOpen, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

import { APTITUDE_TOPICS, DIFFICULTY_CONFIG, getUserProgress, saveAnswer, getTopicProgress } from '../data/aptitudeData';
import { getQuestionsByTopic } from '../data/questionsBank';

const DifficultyBadge = ({ difficulty }) => {
  const config = DIFFICULTY_CONFIG[difficulty];
  return (
    <span
      className="px-2 py-1 rounded-md text-xs font-semibold"
      style={{
        backgroundColor: `${config.color}20`,
        color: config.color
      }}
    >
      {config.label}
    </span>
  );
};

const XPBadge = ({ xp }) => (
  <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-amber-500/10 border border-amber-500/20">
    <Zap size={12} className="text-amber-400" />
    <span className="text-xs font-bold text-amber-400">{xp} XP</span>
  </div>
);

const TopicCard = ({ topic, onSelect }) => {
  const questions = getQuestionsByTopic(topic.key);
  const progress = getTopicProgress(topic.key, questions);

  const Icon = ({ name }) => {
    const iconMap = {
      Calculator: '🔢', Timer: '⏱️', Users: '👥', Hash: '#️⃣', Train: '🚆',
      Calendar: '📅', TrendingUp: '📈', Shuffle: '🔀', Percent: '%',
      Square: '⬜', DollarSign: '💵', Dice5: '🎲', Droplet: '💧',
      Tag: '🏷️', Clock: '🕐', Mountain: '⛰️', Box: '📦'
    };
    return <span className="text-2xl">{iconMap[name] || '📊'}</span>;
  };

  return (
    <button
      onClick={() => onSelect(topic)}
      className="group relative p-6 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 text-left w-full"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${topic.color}20` }}
          >
            <Icon name={topic.icon} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{topic.name}</h3>
            <p className="text-sm text-zinc-500">{topic.count} questions</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-400">Progress</span>
          <span className="text-white font-semibold">{progress.solved}/{progress.total}</span>
        </div>
        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progress.percentage}%`,
              backgroundColor: topic.color
            }}
          />
        </div>
      </div>
    </button>
  );
};

const QuestionView = ({ topic, onBack }) => {
  const questions = getQuestionsByTopic(topic.key);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [progress, setProgress] = useState(getUserProgress());

  const currentQuestion = questions[currentIndex];

  if (!currentQuestion) {
    return (
      <div className="text-center py-20">
        <p className="text-zinc-400 mb-4">No questions available for this topic yet.</p>
        <button
          onClick={onBack}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
        >
          Back to Topics
        </button>
      </div>
    );
  }

  const handleAnswerSelect = (option) => {
    if (showResult) return;
    setSelectedAnswer(option.label);

    // Auto-submit on selection
    const result = saveAnswer(
      currentQuestion.id,
      option.label,
      currentQuestion.correctAnswer,
      currentQuestion.xp
    );

    setProgress(result);
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
  const isSolved = progress.solved.includes(currentQuestion.id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Topics
        </button>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
            <Trophy size={16} className="text-amber-400" />
            <span className="text-white font-bold">{progress.totalXP} XP</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-400">
            Question {currentIndex + 1} of {questions.length}
          </span>
          <span className="text-white font-semibold">
            {progress.solved.filter(id => questions.find(q => q.id === id)).length} solved
          </span>
        </div>
        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="p-8 rounded-2xl border border-white/10 bg-white/5">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <DifficultyBadge difficulty={currentQuestion.difficulty} />
            <XPBadge xp={currentQuestion.xp} />
          </div>
          {isSolved && (
            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30">
              <Check size={14} className="text-green-400" />
              <span className="text-sm font-semibold text-green-400">Solved</span>
            </div>
          )}
        </div>

        <h3 className="text-xl text-white font-medium mb-8 leading-relaxed">
          {currentQuestion.question}
        </h3>

        <div className="space-y-3">
          {currentQuestion.options.map((option) => {
            const isSelected = selectedAnswer === option.label;
            const isCorrectOption = option.label === currentQuestion.correctAnswer;

            let bgColor = 'bg-white/5 hover:bg-white/10';
            let borderColor = 'border-white/10';
            let textColor = 'text-white';

            if (showResult) {
              if (isCorrectOption) {
                bgColor = 'bg-green-500/20';
                borderColor = 'border-green-500/50';
              } else if (isSelected && !isCorrect) {
                bgColor = 'bg-red-500/20';
                borderColor = 'border-red-500/50';
              }
            } else if (isSelected) {
              bgColor = 'bg-indigo-500/20';
              borderColor = 'border-indigo-500/50';
            }

            return (
              <button
                key={option.label}
                onClick={() => handleAnswerSelect(option)}
                disabled={showResult}
                className={`w-full p-4 rounded-xl border ${bgColor} ${borderColor} transition-all duration-200 text-left flex items-center justify-between group ${!showResult && 'hover:scale-[1.02]'}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-sm font-bold">
                    {option.label}
                  </span>
                  <span className={textColor}>{option.value}</span>
                </div>
                {showResult && isCorrectOption && (
                  <Check size={20} className="text-green-400" />
                )}
                {showResult && isSelected && !isCorrect && (
                  <X size={20} className="text-red-400" />
                )}
              </button>
            );
          })}
        </div>

        {/* Result Message with Solution */}
        {showResult && (
          <div className="mt-6 space-y-4">
            <div className={`p-4 rounded-xl ${isCorrect ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'}`}>
              <p className={`font-semibold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                {isCorrect ? (
                  <>🎉 Correct! You earned {currentQuestion.xp} XP</>
                ) : (
                  <>❌ Incorrect. The correct answer is {currentQuestion.correctAnswer}</>
                )}
              </p>
            </div>

            {/* Solution and Trick */}
            {currentQuestion.solution && (
              <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <BookOpen size={16} />
                  Solution
                </h4>
                <p className="text-zinc-300 leading-relaxed mb-4">{currentQuestion.solution}</p>

                {currentQuestion.trick && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <h5 className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Zap size={14} />
                      Quick Trick
                    </h5>
                    <p className="text-zinc-400 leading-relaxed text-sm">{currentQuestion.trick}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="px-6 py-3 rounded-lg bg-white/5 hover:bg-white/10 text-white border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          <button
            onClick={handleNext}
            disabled={currentIndex === questions.length - 1 || !showResult}
            className="px-8 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {currentIndex === questions.length - 1 ? 'Completed' : 'Next Question'}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-2">
        {questions.map((q, idx) => (
          <button
            key={q.id}
            onClick={() => {
              setCurrentIndex(idx);
              setSelectedAnswer(null);
              setShowResult(false);
            }}
            className={`w-8 h-8 rounded-lg border transition-all ${idx === currentIndex
                ? 'bg-indigo-600 border-indigo-600 text-white'
                : progress.solved.includes(q.id)
                  ? 'bg-green-500/20 border-green-500/50 text-green-400'
                  : 'bg-white/5 border-white/10 text-zinc-500 hover:border-white/30'
              }`}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default function AptitudeMastery() {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [progress, setProgress] = useState(getUserProgress());

  useEffect(() => {
    const handleStorageChange = () => {
      setProgress(getUserProgress());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  if (selectedTopic) {
    return (
      <div className="min-h-screen bg-[#050507] text-white selection:bg-indigo-500/30">

        <div className="max-w-4xl mx-auto px-6 py-12 pt-24 relative z-10">
          <QuestionView
            topic={selectedTopic}
            onBack={() => setSelectedTopic(null)}
          />
        </div>
      </div>
    );
  }

  const totalQuestions = APTITUDE_TOPICS.reduce((sum, topic) => sum + topic.count, 0);
  const solvedCount = progress.solved.length;
  const overallProgress = totalQuestions > 0 ? Math.round((solvedCount / totalQuestions) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#050507] text-white selection:bg-indigo-500/30">


      <div className="max-w-7xl mx-auto px-6 py-12 pt-24 relative z-10">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-zinc-500">
                Aptitude Mastery
              </h1>
              <p className="text-xl text-zinc-400 leading-relaxed">
                Master quantitative, logical, and verbal skills for technical interviews.
              </p>
            </div>
            <div className="flex flex-col items-end gap-3">
              <div className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30">
                <Trophy size={24} className="text-amber-400" />
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">{progress.totalXP}</div>
                  <div className="text-xs text-amber-400">Total XP</div>
                </div>
              </div>
              <div className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10">
                <Target size={20} className="text-indigo-400" />
                <div className="text-right">
                  <div className="text-lg font-bold text-white">{solvedCount}/{totalQuestions}</div>
                  <div className="text-xs text-zinc-400">Questions Solved</div>
                </div>
              </div>
            </div>
          </div>

          {/* Overall Progress */}
          <div className="p-6 rounded-2xl border border-white/10 bg-white/5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-zinc-400">Overall Progress</span>
              <span className="text-white font-bold">{overallProgress}%</span>
            </div>
            <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {APTITUDE_TOPICS.map((topic) => (
            <TopicCard
              key={topic.key}
              topic={topic}
              onSelect={setSelectedTopic}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
