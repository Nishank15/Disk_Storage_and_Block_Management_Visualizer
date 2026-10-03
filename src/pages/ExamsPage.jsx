import React, { useState, useMemo } from 'react';
import QuestionCard from '../components/Exams/QuestionCard';
import { EXAM_QUESTIONS } from '../utils/examQuestions';
import { Award, RotateCcw, Filter } from 'lucide-react';

export default function ExamsPage() {
  const [examFilter, setExamFilter] = useState('All');
  const [topicFilter, setTopicFilter] = useState('All Topics');
  const [userAnswers, setUserAnswers] = useState({}); // { [questionId]: optionIndex }

  // Filtered Questions
  const filteredQuestions = useMemo(() => {
    return EXAM_QUESTIONS.filter(q => {
      const matchExam = examFilter === 'All' || q.exam === examFilter;
      const matchTopic = topicFilter === 'All Topics' || q.topic === topicFilter;
      return matchExam && matchTopic;
    });
  }, [examFilter, topicFilter]);

  // Performance Stats Calculation
  const stats = useMemo(() => {
    const total = filteredQuestions.length;
    let attempted = 0;
    let correct = 0;

    filteredQuestions.forEach(q => {
      if (userAnswers[q.id] !== undefined) {
        attempted++;
        if (userAnswers[q.id] === q.correctIndex) {
          correct++;
        }
      }
    });

    const incorrect = attempted - correct;
    const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
    // Standard GATE 1-mark scoring with -0.33 negative marking
    const netScore = Number((correct * 1 - incorrect * 0.33).toFixed(2));

    return { total, attempted, correct, incorrect, accuracy, netScore };
  }, [filteredQuestions, userAnswers]);

  const handleSelectOption = (questionId, optionIndex) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleResetQuiz = () => {
    setUserAnswers({});
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 py-8 space-y-8">
      
      {/* Header section */}
      <div>
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-mono bg-[#161718] border border-[#23252a] text-[#e4f222] mb-3">
          <Award size={14} />
          <span>Competitive Examination Bank &bull; Teacher Requirement 4</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-[510] tracking-[-0.022em] text-[#ffffff] font-sans">
          GATE & ISRO Storage Question Bank
        </h1>
        <p className="text-sm md:text-base text-[#8a8f98] mt-1.5 max-w-3xl leading-relaxed">
          Curated past-year questions covering Disk Scheduling seek metrics, UNIX Inode indexing capacity, RAID levels, and DBMS block organizations with instant scoring and negative marking.
        </p>
      </div>

      {/* Live Performance HUD */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        <div className="p-4 rounded-xl bg-[#0f1011] border border-[#23252a] font-mono shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)]">
          <span className="text-[10px] text-[#8a8f98] uppercase block mb-1">QUESTIONS ATTEMPTED</span>
          <div className="text-xl md:text-2xl font-bold text-[#ffffff]">
            {stats.attempted} <span className="text-xs font-normal text-[#8a8f98]">/ {stats.total}</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0f1011] border border-[#23252a] font-mono shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)]">
          <span className="text-[10px] text-[#8a8f98] uppercase block mb-1">CORRECT ANSWERS</span>
          <div className="text-xl md:text-2xl font-bold text-[#27a644]">
            {stats.correct} <span className="text-xs font-normal text-[#eb5757]">({stats.incorrect} wrong)</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0f1011] border border-[#23252a] font-mono shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)]">
          <span className="text-[10px] text-[#8a8f98] uppercase block mb-1">ACCURACY RATE</span>
          <div className="text-xl md:text-2xl font-bold text-[#e4f222]">
            {stats.accuracy}%
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0f1011] border border-[#23252a] font-mono shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)]">
          <span className="text-[10px] text-[#8a8f98] uppercase block mb-1">NET GATE SCORE</span>
          <div className="text-xl md:text-2xl font-bold text-[#ffffff]">
            {stats.netScore > 0 ? `+${stats.netScore}` : stats.netScore} <span className="text-xs font-normal text-[#8a8f98]">Marks</span>
          </div>
        </div>

      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#0f1011] border border-[#23252a]">
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-[#8a8f98] font-mono">
            <Filter size={14} className="text-[#e4f222]" />
            <span>Filters:</span>
          </div>

          {/* Exam Filter */}
          <div className="flex items-center gap-1 bg-[#161718] p-1 rounded-lg border border-[#23252a] text-xs font-mono">
            {['All', 'GATE CSE', 'ISRO'].map(ex => (
              <button
                key={ex}
                type="button"
                onClick={() => setExamFilter(ex)}
                className={`px-2.5 py-1 rounded transition-colors ${
                  examFilter === ex 
                    ? 'bg-[#08090a] text-[#ffffff] font-bold border border-[#e4f222]' 
                    : 'text-[#8a8f98] hover:text-[#d0d6e0]'
                }`}
              >
                {ex}
              </button>
            ))}
          </div>

          {/* Topic Filter */}
          <select
            value={topicFilter}
            onChange={(e) => setTopicFilter(e.target.value)}
            className="bg-[#161718] border border-[#23252a] text-[#ffffff] rounded-lg px-3 py-1.5 text-xs font-mono focus:border-[#e4f222] outline-none"
          >
            <option value="All Topics">All Topics ({EXAM_QUESTIONS.length})</option>
            <option value="Disk Scheduling">Disk Scheduling</option>
            <option value="Inodes & File Systems">Inodes & File Systems</option>
            <option value="Storage Hardware & RAID">Storage Hardware & RAID</option>
          </select>
        </div>

        {/* Reset Quiz Button */}
        <button
          type="button"
          onClick={handleResetQuiz}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#161718] border border-[#23252a] hover:border-[#eb5757]/40 text-[#8a8f98] hover:text-[#eb5757] text-xs font-mono transition-colors self-start sm:self-auto"
        >
          <RotateCcw size={13} />
          <span>Reset Quiz Attempts</span>
        </button>

      </div>

      {/* Questions Feed */}
      <section className="space-y-6">
        {filteredQuestions.map((q, idx) => (
          <QuestionCard
            key={q.id}
            index={idx}
            question={q}
            userSelection={userAnswers[q.id]}
            onSelectOption={handleSelectOption}
          />
        ))}

        {filteredQuestions.length === 0 && (
          <div className="p-8 rounded-xl bg-[#0f1011] border border-[#23252a] text-center text-[#8a8f98] text-sm">
            No questions matched the selected filters.
          </div>
        )}
      </section>

    </div>
  );
}
