"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function IntroSlide() {
  return (
    <div className="relative h-full w-full flex flex-col items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900" />

      {/* Animated gradient circles - larger and more prominent */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, 50, 0],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          y: [0, -50, 0],
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-6">
        {/* Year badge */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          className="mb-6"
        >
          <span className="font-jersey text-7xl md:text-8xl text-white/10">
            2025
          </span>
        </motion.div>

        {/* Logo */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 20,
            delay: 0.3,
          }}
          className="mb-6"
        >
          <div className="relative w-20 h-20 md:w-24 md:h-24 mx-auto">
            <Image
              src="/assets/images/logo-tso.png"
              alt="TSO Logo"
              fill
              className="object-contain drop-shadow-2xl"
            />
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <h1 className="font-poppins font-extrabold text-4xl md:text-6xl lg:text-7xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 mb-2">
            TSO Wrapped
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <p className="font-nunito text-white/60 text-base md:text-lg mb-2">
            Recap-ul anului la Tineret Speranța Oradea
          </p>
        </motion.div>

        {/* Epic badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="mt-4"
        >
          <span className="inline-block px-5 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-full border border-white/10">
            <span className="font-poppins font-semibold text-lg md:text-xl text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
              Un an EPIC
            </span>
          </span>
        </motion.div>
      </div>

      {/* Decorative floating elements */}
      <motion.div
        className="absolute top-24 left-10 w-2 h-2 bg-purple-400 rounded-full"
        animate={{
          y: [0, -20, 0],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <motion.div
        className="absolute top-40 right-16 w-3 h-3 bg-pink-400 rounded-full"
        animate={{
          y: [0, 20, 0],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{ duration: 2.5, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-40 left-20 w-2 h-2 bg-orange-400 rounded-full"
        animate={{
          y: [0, -15, 0],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />
    </div>
  );
}
