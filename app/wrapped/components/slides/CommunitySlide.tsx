"use client";

import { motion } from "framer-motion";
import CountUp from "../animations/CountUp";
import Image from "next/image";

export default function CommunitySlide() {
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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Background Image - using wrapped folder image */}
      <div className="absolute inset-0">
        <Image
          src="/assets/images/wrapped/3.png"
          alt="Youth gathering"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
      </div>

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 h-full flex flex-col items-center justify-center px-6 py-16"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-10">
          <h2 className="font-poppins font-bold text-3xl md:text-5xl text-white">
            Serile Noastre de Tineret
          </h2>
          <p className="font-nunito text-white/60 text-base md:text-lg mt-3 max-w-md mx-auto">
            Joi seara, locul unde ne întâlnim să creștem împreună.
          </p>
        </motion.div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-lg">
          {/* Youth Nights */}
          <motion.div
            variants={itemVariants}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 text-center border border-white/10"
          >
            <CountUp
              end={32}
              className="font-poppins font-bold text-5xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400"
            />
            <p className="font-nunito text-white/70 text-base md:text-lg mt-3">
              seri de tineret
            </p>
            <p className="font-nunito text-white/50 text-sm mt-1">
              + întâlniri extra!
            </p>
          </motion.div>

          {/* Average Attendance */}
          <motion.div
            variants={itemVariants}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 text-center border border-white/10"
          >
            <CountUp
              end={196}
              delay={0.2}
              className="font-poppins font-bold text-5xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-orange-400"
            />
            <p className="font-nunito text-white/70 text-base md:text-lg mt-3">
              media participanți
            </p>
            <p className="font-nunito text-white/50 text-sm mt-1">
              la fiecare întâlnire
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
