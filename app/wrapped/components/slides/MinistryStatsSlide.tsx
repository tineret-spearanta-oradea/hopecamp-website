"use client";

import { motion } from "framer-motion";
import CountUp from "../animations/CountUp";

export default function MinistryStatsSlide() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const stats = [
    {
      value: 19,
      label: "vorbitori faini",
      emoji: "🎤",
      gradient: "from-violet-500 to-purple-500",
      description: "care ne-au inspirat și provocat",
    },
    {
      value: 13,
      label: "trupe de laudă",
      emoji: "🎸",
      gradient: "from-pink-500 to-rose-500",
      description: "care ne-au ajutat să ne închinăm",
    },
    {
      value: 217,
      label: "cântece",
      emoji: "🎵",
      gradient: "from-orange-500 to-amber-500",
      description: "cântate împreună în închinare",
    },
  ];

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-violet-900/40 to-slate-900" />

      {/* Animated background elements */}
      <motion.div
        className="absolute top-1/4 -left-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, 30, 0],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-1/4 -right-20 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          y: [0, -40, 0],
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />

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

        {/* Stats */}
        <div className="space-y-6 w-full max-w-md">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              className={`bg-gradient-to-r ${stat.gradient} p-[2px] rounded-2xl`}
            >
              <div className="bg-slate-900/90 backdrop-blur-sm rounded-2xl p-5 flex items-center gap-4">
                <span className="text-4xl">{stat.emoji}</span>
                <div className="flex-1">
                  <div className="flex items-baseline gap-2">
                    <CountUp
                      end={stat.value}
                      delay={0.3 + index * 0.2}
                      className={`font-poppins font-bold text-4xl text-transparent bg-clip-text bg-gradient-to-r ${stat.gradient}`}
                    />
                    <span className="font-poppins font-semibold text-white text-lg">
                      {stat.label}
                    </span>
                  </div>
                  <p className="font-nunito text-white/50 text-sm mt-1">
                    {stat.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
