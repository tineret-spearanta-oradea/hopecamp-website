"use client";

import { motion } from "framer-motion";
import CountUp from "../animations/CountUp";
import Image from "next/image";

const uniteImages = [
  "/assets/images/wrapped/5.png",
  "/assets/images/wrapped/1.png",
];

export default function UniteSlide() {
  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Split screen images - top and bottom */}
      <div className="absolute inset-0 flex flex-col">
        {/* Top half - Image 1 */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative flex-1 overflow-hidden"
        >
          <Image
            src={uniteImages[0]}
            alt="Unite event 1"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
        </motion.div>

        {/* Bottom half - Image 2 */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative flex-1 overflow-hidden"
        >
          <Image
            src={uniteImages[1]}
            alt="Unite event 2"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/60" />
        </motion.div>
      </div>

      {/* Animated glow effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 z-[1]"
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 py-16">
        {/* Record badge */}
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 15,
            delay: 0.6,
          }}
          className="mb-4"
        >
          <span className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-amber-500/40 to-orange-500/40 backdrop-blur-md rounded-full border border-amber-400/30">
            <span className="text-2xl">🔥</span>
            <span className="text-amber-300 font-semibold uppercase tracking-wider text-sm">
              Record 2025
            </span>
          </span>
        </motion.div>

        {/* Big number with background */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center mb-4 bg-black/30 backdrop-blur-sm px-10 py-6 rounded-3xl border border-white/10"
        >
          <CountUp
            end={450}
            duration={2.5}
            className="font-poppins font-extrabold text-7xl md:text-8xl text-white drop-shadow-2xl"
          />
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <h2 className="font-poppins font-bold text-xl md:text-2xl text-white mt-2">
              participanți la <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">UNITE</span>
            </h2>
            <p className="font-nunito text-white/70 text-base mt-1">
              Tinerii din Oradea, uniți 🔥
            </p>
          </motion.div>
        </motion.div>

      </div>
    </div>
  );
}
