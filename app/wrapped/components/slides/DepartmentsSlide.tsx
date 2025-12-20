"use client";

import { motion } from "framer-motion";
import CountUp from "../animations/CountUp";

const departments = [
  { emoji: "📚", name: "Club de carte" },
  { emoji: "🎨", name: "Decor" },
  { emoji: "🖌️", name: "Design Grafic" },
  { emoji: "💻", name: "Digitalizare" },
  { emoji: "🎉", name: "Events" },
  { emoji: "👧", name: "Hope Girls" },
  { emoji: "✉️", name: "Hope Letter" },
  { emoji: "🎓", name: "Hope Students" },
  { emoji: "🚚", name: "Logistic" },
  { emoji: "👕", name: "Merch" },
  { emoji: "⭐", name: "Moments" },
  { emoji: "📸", name: "Photo" },
  { emoji: "🙏", name: "Rugăciune" },
  { emoji: "🍪", name: "Snack" },
  { emoji: "❤️", name: "Social" },
  { emoji: "📱", name: "Social Media" },
  { emoji: "🎤", name: "Speakers" },
  { emoji: "🎛️", name: "Tehnic Media" },
  { emoji: "🎥", name: "Video" },
  { emoji: "🤝", name: "Welcome" },
];

export default function DepartmentsSlide() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
        delayChildren: 0.5,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
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
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-emerald-900/30 to-slate-900" />

      {/* Animated background */}
      <motion.div
        className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          y: [0, 50, 0],
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-0 right-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          x: [0, -30, 0],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 py-20 pt-24 overflow-y-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6 mt-4"
        >
          <h2 className="font-poppins font-bold text-3xl md:text-4xl text-white mb-2">
            <CountUp end={20} className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400" /> departamente active
          </h2>
          <p className="font-nunito text-white/60 text-base">
            cu peste <span className="text-emerald-400 font-semibold">60 voluntari</span> implicați
          </p>
        </motion.div>

        {/* Departments Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5 md:gap-2 w-full max-w-2xl"
        >
          {departments.map((dept, index) => (
            <motion.div
              key={dept.name}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="bg-white/5 backdrop-blur-sm rounded-lg px-2 py-1.5 border border-white/10 hover:border-emerald-500/30 transition-colors cursor-default"
            >
              <div className="flex items-center gap-1.5">
                <span className="text-base">{dept.emoji}</span>
                <span className="font-nunito text-white/80 text-xs truncate">
                  {dept.name}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
