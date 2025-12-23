"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function LeadersSlide() {
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
        type: "spring" as const,
        stiffness: 120,
        damping: 14,
      },
    },
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-amber-900/20 to-slate-900" />

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 h-full flex flex-col items-center justify-center px-6 py-16"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-6">
        <p className="font-nunito text-white/70 text-base md:text-lg">
          În spatele cortinei
          </p>
          <h2 className="font-poppins font-bold text-2xl md:text-4xl text-white mb-2">
            o echipă de lideri dedicați
          </h2>
        </motion.div>

        {/* Photo */}
        <motion.div
          variants={itemVariants}
          className="relative w-full max-w-md aspect-[4/3] rounded-2xl overflow-hidden border-2 border-white/10"
        >
          <Image
            src="/assets/images/wrapped/leaders.jpeg"
            alt="Echipa de lideri Hope Youth"
            fill
            className="object-cover"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
