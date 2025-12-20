"use client";

import { motion } from "framer-motion";
import CountUp from "../animations/CountUp";

const localCities = ["Oradea", "Aleșd", "Peștiș", "Beiuș", "Satu Mare"];
const internationalCities = [
  { name: "Londra", flag: "🇬🇧" },
  { name: "Italia", flag: "🇮🇹" },
  { name: "Spania", flag: "🇪🇸" },
  { name: "Paris", flag: "🇫🇷" },
];

export default function CitiesSlide() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.5,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
      },
    },
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900/40 to-slate-900" />

      {/* Animated globe-like circles */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-white/5"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-white/5"
        animate={{ rotate: -360 }}
        transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full border border-white/10"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />

      {/* Glowing orbs */}
      <motion.div
        className="absolute top-1/3 left-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <span className="inline-block px-4 py-1 bg-blue-500/20 rounded-full text-blue-300 text-sm font-medium mb-4">
            🌍 Fără granițe
          </span>
          <h2 className="font-poppins font-bold text-3xl md:text-4xl text-white mb-2">
            Participanți din
          </h2>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          >
            <CountUp
              end={21}
              className="font-poppins font-extrabold text-6xl md:text-7xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400"
            />
            <span className="font-poppins font-bold text-2xl md:text-3xl text-white ml-3">
              orașe diferite
            </span>
          </motion.div>
        </motion.div>

        {/* Romania section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-6"
        >
          <p className="text-white/50 text-sm text-center mb-3">🇷🇴 România</p>
          <div className="flex flex-wrap justify-center gap-2">
            {localCities.map((city, index) => (
              <motion.div
                key={city}
                variants={itemVariants}
                className={`px-4 py-2 rounded-full border ${
                  city === "Oradea"
                    ? "bg-gradient-to-r from-blue-500/30 to-cyan-500/30 border-blue-400/50 text-white font-semibold"
                    : "bg-white/5 border-white/10 text-white/80"
                }`}
              >
                {city === "Oradea" && <span className="mr-1">📍</span>}
                {city}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* International section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center"
        >
          <p className="text-white/50 text-sm mb-3">✈️ Internațional</p>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap justify-center gap-3"
          >
            {internationalCities.map((city, index) => (
              <motion.div
                key={city.name}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.4 + index * 0.15, type: "spring" }}
                whileHover={{ scale: 1.05, y: -2 }}
                className="px-4 py-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-full border border-amber-400/30 text-white"
              >
                <span className="mr-2">{city.flag}</span>
                {city.name}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
