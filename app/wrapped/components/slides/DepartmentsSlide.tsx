"use client";

import { motion } from "framer-motion";
import CountUp from "../animations/CountUp";

const departments = [
  { emoji: "🤝", name: "Welcome" },
  { emoji: "⭐", name: "Moments" },
  { emoji: "✉️", name: "Hope Letter" },
  { emoji: "🕯️", name: "Făclia din noapte" },
  { emoji: "📚", name: "Club de carte" },
  { emoji: "🎨", name: "Decor" },
  { emoji: "📱", name: "Social Media" },
  { emoji: "📸", name: "Photo" },
  { emoji: "🎥", name: "Video" },
  { emoji: "🖌️", name: "Design Grafic" },
  { emoji: "🎛️", name: "Tehnic Media" },
  { emoji: "🍪", name: "Snack" },
  { emoji: "👕", name: "Merch" },
  { emoji: "🎤", name: "Speakers" },
  { emoji: "🎸", name: "Worship" },
  { emoji: "🎉", name: "Events" },
  { emoji: "📋", name: "Planning" },
  { emoji: "❤️", name: "Social" },
  { emoji: "🎓", name: "Hope Students" },
  { emoji: "🙏", name: "Rugăciune" },
  { emoji: "💰", name: "Finanțe" },
  { emoji: "💻", name: "Digitalizare" },
  { emoji: "👧", name: "Hope Girls" },
  { emoji: "🚚", name: "Logistic" },
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
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.25,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-emerald-900/30 to-slate-900" />

      {/* Static gradient orbs - no animation, reduced blur for mobile perf */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/15 rounded-full blur-2xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-teal-500/15 rounded-full blur-2xl" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-3 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-4"
        >
          <h2 className="font-poppins font-bold text-2xl md:text-4xl text-white mb-1">
            <CountUp end={24} className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400" /> departamente active
          </h2>
          <p className="font-nunito text-white/60 text-sm">
            cu peste <span className="text-emerald-400 font-semibold">70 voluntari</span> implicați
          </p>
        </motion.div>

        {/* Departments Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 gap-1 md:gap-1.5 w-full max-w-2xl"
        >
          {departments.map((dept) => (
            <motion.div
              key={dept.name}
              variants={itemVariants}
              className="bg-slate-800/60 rounded-md px-1.5 py-1 border border-white/10 cursor-default"
            >
              <div className="flex items-center gap-1">
                <span className="text-sm">{dept.emoji}</span>
                <span className="font-nunito text-white/80 text-[10px] truncate">
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
