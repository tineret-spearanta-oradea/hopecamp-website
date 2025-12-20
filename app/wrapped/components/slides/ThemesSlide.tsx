"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Confetti from "../animations/Confetti";

const quizOptions = [
  { id: 1, text: "Detox", correct: true },
  { id: 2, text: "Sincer", correct: false },
  { id: 3, text: "Miracole", correct: true },
  { id: 4, text: "Aprins", correct: false },
];

export default function ThemesSlide() {
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const correctAnswers = quizOptions.filter(o => o.correct).map(o => o.id);

  const handleSelect = (e: React.MouseEvent, id: number) => {
    e.stopPropagation(); // Prevent navigation
    if (showResults) return;

    setSelectedOptions(prev => {
      if (prev.includes(id)) {
        return prev.filter(i => i !== id);
      }
      return [...prev, id];
    });
  };

  const handleCheckAnswers = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation
    setShowResults(true);
    // Check if all correct answers are selected and no wrong ones
    const allCorrectSelected = correctAnswers.every(id => selectedOptions.includes(id));
    const noWrongSelected = selectedOptions.every(id => correctAnswers.includes(id));

    if (allCorrectSelected && noWrongSelected) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  const getOptionStyle = (option: { id: number; correct: boolean }) => {
    if (!showResults) {
      return selectedOptions.includes(option.id)
        ? "border-purple-500 bg-purple-500/30"
        : "border-white/20 bg-white/5 hover:bg-white/10";
    }

    if (option.correct) {
      return "border-green-500 bg-green-500/30";
    }

    if (selectedOptions.includes(option.id) && !option.correct) {
      return "border-red-500 bg-red-500/30";
    }

    return "border-white/10 bg-white/5 opacity-50";
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/40 to-slate-900" />

      {/* Animated gradient orbs */}
      <motion.div
        className="absolute top-1/3 left-1/4 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, 30, 0],
        }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-pink-500/30 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          y: [0, -30, 0],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      {/* Confetti */}
      <Confetti isActive={showConfetti} />

      {/* Content - only stop propagation when quiz is in progress */}
      <div
        className="relative z-10 h-full flex flex-col items-center justify-center px-6 py-16"
        onClick={(e) => {
          // Allow navigation after quiz is completed
          if (!showResults) {
            e.stopPropagation();
          }
        }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <span className="inline-block px-4 py-1 bg-purple-500/20 rounded-full text-purple-300 text-sm font-medium mb-4">
            Quiz Time!
          </span>
          <h2 className="font-poppins font-bold text-2xl md:text-4xl text-white mb-2">
            Care au fost temele sezoanelor?
          </h2>
          <p className="font-nunito text-white/60 text-sm">
        Selectează titlurile sezoanelor.
          </p>
        </motion.div>

        {/* Options */}
        <div className="w-full max-w-md space-y-3 mb-8">
          {quizOptions.map((option, index) => (
            <motion.button
              key={option.id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              onClick={(e) => handleSelect(e, option.id)}
              disabled={showResults}
              className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left flex items-center gap-3 ${getOptionStyle(option)}`}
            >
              {/* Checkbox indicator */}
              <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                selectedOptions.includes(option.id) || (showResults && option.correct)
                  ? "border-current bg-current/20"
                  : "border-white/30"
              }`}>
                <AnimatePresence>
                  {(selectedOptions.includes(option.id) || (showResults && option.correct)) && (
                    <motion.svg
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="w-4 h-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </motion.svg>
                  )}
                </AnimatePresence>
              </div>

              <span className="font-poppins font-medium text-lg text-white">
                {option.text}
              </span>

              {/* Result indicator */}
              {showResults && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-auto text-xl"
                >
                  {option.correct ? "✓" : (selectedOptions.includes(option.id) ? "✗" : "")}
                </motion.span>
              )}
            </motion.button>
          ))}
        </div>

        {/* Check Button */}
        {!showResults ? (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            onClick={(e) => handleCheckAnswers(e)}
            disabled={selectedOptions.length === 0}
            className={`px-8 py-3 rounded-full font-poppins font-semibold text-white transition-all ${
              selectedOptions.length > 0
                ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90"
                : "bg-white/20 cursor-not-allowed"
            }`}
          >
            Verifică răspunsurile
          </motion.button>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <p className="font-nunito text-white/80 text-lg mb-4">
              {correctAnswers.every(id => selectedOptions.includes(id)) &&
               selectedOptions.every(id => correctAnswers.includes(id)) ? (
                <>
                  <span className="text-2xl mr-2">🎉</span>
                  Perfect! Ai ghicit toate temele!
                </>
              ) : (
                <>
                  Temele sezoanelor au fost:
                  <br />
                  <div className="flex gap-2 justify-center mt-0">
              <span className="px-3 py-1 bg-amber-500/20 rounded-full text-amber-300 text-sm">
                Detox
              </span>
              <span className="px-3 py-1 bg-blue-500/20 rounded-full text-blue-300 text-sm">
                Miracole
              </span>
            </div>
                </>
              )}
            </p>

            {/* Camp themes */}

            <p className="font-nunito text-white/80 text-lg mb-0">
              Temele taberelor au fost:
            </p>
            <div className="flex gap-2 justify-center mt-0">
              <span className="px-3 py-1 bg-amber-500/20 rounded-full text-amber-300 text-sm">
                Gratia Dei
              </span>
              <span className="px-3 py-1 bg-blue-500/20 rounded-full text-blue-300 text-sm">
                Remade
              </span>
            </div>

            {/* Navigation hint */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-white/40 text-xs mt-6"
            >
              Apasă pentru a continua →
            </motion.p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
