"use client";

import { motion } from "framer-motion";

const topics = [
  { text: "Miracolele Dumnezeirii", size: "text-base md:text-3xl", color: "text-purple-400" },
  { text: "Miracolul credinței", size: "text-sm md:text-2xl", color: "text-pink-400" },
  { text: "Ziua mondială a Bibliei", size: "text-xs md:text-xl", color: "text-blue-400" },
  { text: "Thanksgiving day", size: "text-sm md:text-2xl", color: "text-orange-400" },
  { text: "Gândește pe termen lung", size: "text-xs md:text-xl", color: "text-emerald-400" },
  { text: "Creștin într-o lume cu alte filosofii", size: "text-[10px] md:text-lg", color: "text-cyan-400" },
  { text: "Educație financiară", size: "text-xs md:text-xl", color: "text-yellow-400" },
  { text: "Despre excelență", size: "text-sm md:text-2xl", color: "text-violet-400" },
  { text: "Despre bullying", size: "text-xs md:text-xl", color: "text-red-400" },
  { text: "Renunță la ce nu poți păstra", size: "text-[10px] md:text-lg", color: "text-fuchsia-400" },
  { text: "Drumul spre căsătorie", size: "text-sm md:text-2xl", color: "text-rose-400" },
  { text: "Cu cărțile pe față", size: "text-xs md:text-xl", color: "text-indigo-400" },
  { text: "Dragostea care schimbă vieți!", size: "text-base md:text-3xl", color: "text-pink-400" },
  { text: "Eliberați prin înviere", size: "text-sm md:text-2xl", color: "text-amber-400" },
  { text: "He lives: Why & For Who?", size: "text-xs md:text-xl", color: "text-teal-400" },
];

export default function TopicsSlide() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 150,
        damping: 12,
      },
    },
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900" />

      {/* Static gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-500/20 rounded-full blur-xl" />

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 h-full flex flex-col items-center justify-center px-4 py-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-4">
          <span className="inline-block px-3 py-1 bg-pink-500/20 rounded-full text-pink-300 text-xs font-medium mb-2">
            Temele Anului
          </span>
          <h2 className="font-poppins font-bold text-2xl md:text-4xl text-white">
            Ce am învățat împreună
          </h2>
        </motion.div>

        {/* Word Cloud - staggered spring animations */}
        <div className="flex flex-wrap justify-center items-center gap-2 md:gap-4 max-w-4xl">
          {topics.map((topic) => (
            <motion.span
              key={topic.text}
              variants={itemVariants}
              className={`font-poppins font-semibold ${topic.size} ${topic.color} cursor-default`}
            >
              {topic.text}
            </motion.span>
          ))}
        </div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="font-nunito text-white/50 text-xs mt-6 text-center"
        >
          Fiecare mesaj, un pas mai aproape de El.
        </motion.p>
      </motion.div>
    </div>
  );
}
