"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import CountUp from "../animations/CountUp";

// Age distribution data (total: 167 participants)
// Raw data grouped for display
const ageData = [
  { age: "15", count: 11, percentage: 11 },   // 1 + 10
  { age: "16", count: 32, percentage: 32 },
  { age: "17", count: 33, percentage: 33 },
  { age: "18", count: 22, percentage: 22 },
  { age: "19", count: 16, percentage: 16 },
  { age: "20-22", count: 21, percentage: 21 },  // 7 + 7 + 7
  { age: "23-25", count: 18, percentage: 18 },  // 9 + 7 + 2
  { age: "26+", count: 14, percentage: 14 },     // 6 + 2 + 1 + 1 + 1 + 2 + 1
];

export default function HopeCampSlide() {
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

  const malePercentage = 42.7;
  const femalePercentage = 57.3;

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/assets/images/hopecamp/gratiadei/ELI03065.jpg"
          alt="Hope Camp"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80" />
      </div>

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 h-full flex flex-col items-center justify-center px-4 py-8 overflow-y-auto"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-3">
          <span className="inline-block px-3 py-1 bg-amber-500/20 rounded-full text-amber-300 text-xs font-medium mb-2">
            Hope Camp #6
          </span>
          <h2 className="font-poppins font-bold text-2xl md:text-4xl text-white">
            Gratia Dei în cifre
          </h2>
        </motion.div>

        {/* Total Participants */}
        <motion.div
          variants={itemVariants}
          className="mb-4 text-center"
        >
          <CountUp
            end={167}
            className="font-poppins font-extrabold text-5xl md:text-7xl text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400"
          />
          <p className="font-nunito text-white/70 text-base mt-1">participanți</p>
        </motion.div>

        {/* Gender Ratio */}
        <motion.div
          variants={itemVariants}
          className="w-full max-w-sm mb-4"
        >
          <p className="font-nunito text-white/60 text-xs text-center mb-2">Raport băieți / fete</p>

          {/* Animated bar */}
          <div className="h-6 bg-white/10 rounded-full overflow-hidden flex">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${malePercentage}%` }}
              transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
              className="bg-gradient-to-r from-blue-500 to-blue-400 flex items-center justify-center"
            >
              <span className="font-poppins font-bold text-white text-xs">
                {malePercentage}%
              </span>
            </motion.div>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${femalePercentage}%` }}
              transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
              className="bg-gradient-to-r from-pink-400 to-pink-500 flex items-center justify-center"
            >
              <span className="font-poppins font-bold text-white text-xs">
                {femalePercentage}%
              </span>
            </motion.div>
          </div>

          <div className="flex justify-between mt-1 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-white/70">70 băieți</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-white/70">94 fete</span>
              <div className="w-2 h-2 rounded-full bg-pink-500" />
            </div>
          </div>
        </motion.div>

        {/* Age Distribution */}
        <motion.div
          variants={itemVariants}
          className="w-full max-w-md"
        >
          <p className="font-nunito text-white/60 text-xs text-center mb-2">Distribuție pe vârstă</p>

          <div className="space-y-1">
            {ageData.map((item, index) => (
              <motion.div
                key={item.age}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 + index * 0.1 }}
                className="flex items-center gap-2"
              >
                <span className="font-mono text-white/60 text-xs w-10">{item.age}</span>
                <div className="flex-1 h-5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percentage}%` }}
                    transition={{ delay: 1.2 + index * 0.1, duration: 0.8, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-end pr-1"
                  >
                    {item.percentage > 10 && (
                      <span className="font-poppins font-semibold text-white text-[10px]">
                        {item.count}
                      </span>
                    )}
                  </motion.div>
                </div>
                {item.percentage <= 10 && (
                  <span className="font-poppins font-semibold text-white/60 text-[10px] w-5">
                    {item.count}
                  </span>
                )}
              </motion.div>
            ))}
          </div>

        </motion.div>
      </motion.div>
    </div>
  );
}
