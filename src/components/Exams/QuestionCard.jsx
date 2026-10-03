import React, { useState } from 'react';
import { CheckCircle2, XCircle, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

export default function QuestionCard({ 
  question, 
  index, 
  userSelection, 
  onSelectOption 
}) {
  const [showSolution, setShowSolution] = useState(false);
  const isAnswered = userSelection !== undefined;
  const isCorrect = isAnswered && userSelection === question.correctIndex;

  return (
    <div className={`p-5 md:p-6 rounded-xl border transition-all ${
      isAnswered
        ? isCorrect
          ? 'bg-[#0f1011] border-[#27a644]/40 shadow-[0_0_15px_rgba(39,166,68,0.06)]'
          : 'bg-[#0f1011] border-[#eb5757]/40 shadow-[0_0_15px_rgba(235,87,87,0.06)]'
        : 'bg-[#0f1011] border-[#23252a] hover:border-[#383b3f]'
    }`}>
      
      {/* Question Header & Tags */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-[#23252a]">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-md bg-[#161718] border border-[#23252a] flex items-center justify-center font-mono text-xs font-bold text-[#ffffff]">
            {index + 1}
          </span>
          <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-[#161718] text-[#e4f222] border border-[#23252a]">
            {question.exam} &bull; {question.year}
          </span>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#08090a] text-[#8a8f98] border border-[#23252a]">
            {question.topic}
          </span>
        </div>

        <span className="text-[11px] font-mono text-[#62666d]">
          ID: {question.id}
        </span>
      </div>

      {/* Question Text */}
      <p className="text-sm md:text-base text-[#ffffff] font-sans leading-relaxed mb-5">
        {question.question}
      </p>

      {/* Options List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {question.options.map((opt, optIdx) => {
          const isSelected = userSelection === optIdx;
          const isThisCorrect = optIdx === question.correctIndex;

          let btnClass = 'bg-[#161718] border-[#23252a] text-[#d0d6e0] hover:border-[#383b3f] hover:text-[#ffffff]';
          
          if (isAnswered) {
            if (isSelected) {
              if (isCorrect) {
                btnClass = 'bg-[#27a644]/15 border-[#27a644] text-[#27a644] font-bold shadow-[0_0_10px_rgba(39,166,68,0.2)]';
              } else {
                btnClass = 'bg-[#eb5757]/15 border-[#eb5757] text-[#eb5757] font-bold shadow-[0_0_10px_rgba(235,87,87,0.2)]';
              }
            } else if (isThisCorrect) {
              // Highlight the correct answer if student got it wrong
              btnClass = 'bg-[#27a644]/10 border-[#27a644]/60 text-[#27a644] font-medium';
            } else {
              btnClass = 'bg-[#08090a] border-[#23252a] text-[#62666d] opacity-50';
            }
          }

          return (
            <button
              key={optIdx}
              type="button"
              disabled={isAnswered}
              onClick={() => onSelectOption(question.id, optIdx)}
              className={`p-3 rounded-lg border text-left text-xs md:text-sm font-mono flex items-start gap-3 transition-all ${btnClass}`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-xs border ${
                isSelected 
                  ? isCorrect ? 'bg-[#27a644] text-[#08090a] border-[#27a644]' : 'bg-[#eb5757] text-[#ffffff] border-[#eb5757]'
                  : isAnswered && isThisCorrect
                  ? 'bg-[#27a644] text-[#08090a] border-[#27a644]'
                  : 'bg-[#08090a] text-[#8a8f98] border-[#23252a]'
              }`}>
                {String.fromCharCode(65 + optIdx)}
              </span>
              <span className="flex-1">{opt}</span>
              {isAnswered && isThisCorrect && (
                <CheckCircle2 size={16} className="text-[#27a644] shrink-0" />
              )}
              {isAnswered && isSelected && !isCorrect && (
                <XCircle size={16} className="text-[#eb5757] shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Answer Evaluation & Solution Toggle */}
      {isAnswered && (
        <div className="pt-3 border-t border-[#23252a] space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              {isCorrect ? (
                <span className="flex items-center gap-1.5 text-[#27a644] font-bold">
                  <CheckCircle2 size={14} /> Correct (+1.00 Mark)
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-[#eb5757] font-bold">
                  <XCircle size={14} /> Incorrect (-0.33 Negative Mark)
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowSolution(!showSolution)}
              className="text-xs text-[#e4f222] hover:underline flex items-center gap-1 font-sans"
            >
              <span>{showSolution ? 'Hide Solution' : 'View Official Examination Solution'}</span>
              {showSolution ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>

          {/* Official Detailed Examination Solution */}
          {showSolution && (
            <div className="p-4 rounded-lg bg-[#08090a] border border-[#23252a] text-xs font-mono space-y-2">
              <div className="flex items-center gap-1.5 text-[#e4f222] font-semibold">
                <Sparkles size={14} />
                <span>Official Mathematical Solution:</span>
              </div>
              <pre className="whitespace-pre-wrap font-mono text-[11px] text-[#d0d6e0] leading-relaxed">
                {question.solution}
              </pre>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
