"use client";

import { motion } from "framer-motion";
import CountUp from "../animations/CountUp";

export default function DecisionsSlide() {
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-sky-900/30 to-slate-900" />

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 h-full flex flex-col items-center justify-center px-6 py-16"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-10">
          <span className="inline-block px-4 py-1 bg-sky-500/20 rounded-full text-sky-300 text-sm font-medium mb-4">
            Cu ajutorul Domnului
          </span>
          <h2 className="font-poppins font-bold text-2xl md:text-4xl text-white">
            Vieți transformate
          </h2>
        </motion.div>

        {/* Stats */}
        <div className="space-y-6 w-full max-w-md">
          {/* Decisions */}
          <motion.div
            variants={itemVariants}
            className="bg-slate-800/80 border border-sky-500/30 rounded-2xl p-5 text-center"
          >
            <CountUp
              end={21}
              delay={0.5}
              className="font-poppins font-bold text-5xl md:text-6xl text-sky-400"
            />
            <p className="font-nunito text-white/80 text-base mt-3">
              tineri care au decis
            </p>
            <p className="font-nunito text-white/60 text-sm mt-1">
            în tabere că-L vor urma pe Domnul toată viața
            </p>
          </motion.div>

          {/* Baptisms */}
          <motion.div
            variants={itemVariants}
            className="bg-slate-800/80 border border-cyan-500/30 rounded-2xl p-5 text-center"
          >
            <CountUp
              end={16}
              delay={0.8}
              className="font-poppins font-bold text-5xl md:text-6xl text-cyan-400"
            />
            <p className="font-nunito text-white/80 text-base mt-3">
              tineri botezați
            </p>
            <p className="font-nunito text-white/60 text-sm mt-1">
              în urma deciziilor luate la tineret și în tabere
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
