"use client";

import { motion } from "framer-motion";
import CountUp from "../animations/CountUp";

export default function SocialProjectSlide() {
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 14,
      },
    },
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-rose-900/30 to-slate-900" />

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 h-full flex flex-col items-center justify-center px-6 py-16"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <span className="inline-block px-4 py-1 bg-rose-500/20 rounded-full text-rose-300 text-sm font-medium mb-4">
            Proiect Social
          </span>
          <h2 className="font-poppins font-bold text-2xl md:text-4xl text-white mb-3">
            Dincolo de întâlniri,
          </h2>
          <p className="font-nunito text-white/70 text-base md:text-lg max-w-sm mx-auto">
            am ales să fim o binecuvântare și pentru alții.
          </p>
        </motion.div>

        {/* Project Card */}
        <motion.div
          variants={itemVariants}
          className="bg-slate-800/80 border border-rose-500/30 rounded-2xl p-6 md:p-8 max-w-sm w-full text-center"
        >
          <span className="text-5xl mb-4 block">🎁</span>
          <h3 className="font-poppins font-bold text-xl md:text-2xl text-white mb-4">
            O cutie cu zâmbet
          </h3>
          <div className="flex items-baseline justify-center gap-2 mb-3">
            <CountUp
              end={603}
              className="font-poppins font-bold text-5xl md:text-6xl text-rose-400"
            />
          </div>
          <p className="font-nunito text-white/70 text-base">
            cadouri și pachete pentru copii și familii nevoiașe
          </p>
        </motion.div>

        {/* Footer */}
        <motion.p
          variants={itemVariants}
          className="font-nunito text-white/50 text-sm mt-8 text-center"
        >
          Fiecare dar, un zâmbet în plus.
        </motion.p>
      </motion.div>
    </div>
  );
}
