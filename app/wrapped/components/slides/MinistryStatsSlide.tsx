"use client";

import { motion } from "framer-motion";
import CountUp from "../animations/CountUp";

export default function MinistryStatsSlide() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 15 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 14,
      },
    },
  };

  const stats = [
    {
      value: 19,
      label: "vorbitori faini",
      emoji: "🎤",
      borderColor: "border-violet-500/50",
      textColor: "text-violet-400",
      description: "care ne-au inspirat și provocat",
    },
    {
      value: 13,
      label: "trupe de laudă",
      emoji: "🎸",
      borderColor: "border-pink-500/50",
      textColor: "text-pink-400",
      description: "care ne-au ajutat să ne închinăm",
    },
    {
      value: 217,
      label: "cântece",
      emoji: "🎵",
      borderColor: "border-orange-500/50",
      textColor: "text-orange-400",
      description: "cântate împreună în închinare",
    },
  ];

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Background - simple solid gradient, no blur orbs */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-violet-900/30 to-slate-900" />

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 h-full flex flex-col items-center justify-center px-6 py-16"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-10">
          <span className="inline-block px-4 py-1 bg-violet-500/20 rounded-full text-violet-300 text-sm font-medium mb-4">
            Worship & Cuvânt
          </span>
          <h2 className="font-poppins font-bold text-3xl md:text-4xl text-white">
            Ce am auzit și cântat
          </h2>
        </motion.div>

        {/* Stats with spring animation */}
        <div className="space-y-5 w-full max-w-md">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              className={`bg-slate-800/80 border ${stat.borderColor} rounded-2xl p-5 flex items-center gap-4`}
            >
              <span className="text-4xl">{stat.emoji}</span>
              <div className="flex-1">
                <div className="flex items-baseline gap-2">
                  <CountUp
                    end={stat.value}
                    delay={0.3 + index * 0.15}
                    className={`font-poppins font-bold text-4xl ${stat.textColor}`}
                  />
                  <span className="font-poppins font-semibold text-white text-lg">
                    {stat.label}
                  </span>
                </div>
                <p className="font-nunito text-white/50 text-sm mt-1">
                  {stat.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
