"use client";

import { motion } from "framer-motion";

const topics = [
  { text: "Miracolele Dumnezeirii", size: "text-base md:text-3xl", color: "from-purple-400 to-pink-400" },
  { text: "Miracolul credinței", size: "text-sm md:text-2xl", color: "from-pink-400 to-rose-400" },
  { text: "Ziua mondială a Bibliei", size: "text-xs md:text-xl", color: "from-blue-400 to-purple-400" },
  { text: "Thanksgiving day", size: "text-sm md:text-2xl", color: "from-orange-400 to-amber-400" },
  { text: "Gândește pe termen lung", size: "text-xs md:text-xl", color: "from-emerald-400 to-teal-400" },
  { text: "Creștin într-o lume cu alte filosofii", size: "text-[10px] md:text-lg", color: "from-cyan-400 to-blue-400" },
  { text: "Educație financiară", size: "text-xs md:text-xl", color: "from-yellow-400 to-orange-400" },
  { text: "Despre excelență", size: "text-sm md:text-2xl", color: "from-violet-400 to-purple-400" },
  { text: "Despre bullying", size: "text-xs md:text-xl", color: "from-red-400 to-pink-400" },
  { text: "Renunță la ce nu poți păstra", size: "text-[10px] md:text-lg", color: "from-fuchsia-400 to-pink-400" },
  { text: "Drumul spre căsătorie", size: "text-sm md:text-2xl", color: "from-rose-400 to-red-400" },
  { text: "Cu cărțile pe față", size: "text-xs md:text-xl", color: "from-indigo-400 to-violet-400" },
  { text: "Dragostea care schimbă vieți!", size: "text-base md:text-3xl", color: "from-pink-400 to-red-400" },
  { text: "Eliberați prin înviere", size: "text-sm md:text-2xl", color: "from-amber-400 to-yellow-400" },
  { text: "He lives: Why & For Who?", size: "text-xs md:text-xl", color: "from-teal-400 to-emerald-400" },
];

export default function TopicsSlide() {
  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900" />

      {/* Animated background shapes */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          x: [0, -30, 0],
          y: [0, 50, 0],
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-4"
        >
          <span className="inline-block px-3 py-1 bg-pink-500/20 rounded-full text-pink-300 text-xs font-medium mb-2">
            Temele Anului
          </span>
          <h2 className="font-poppins font-bold text-2xl md:text-4xl text-white">
            Ce am învățat împreună
          </h2>
        </motion.div>

        {/* Word Cloud */}
        <div className="flex flex-wrap justify-center items-center gap-2 md:gap-4 max-w-4xl">
          {topics.map((topic, index) => (
            <motion.div
              key={topic.text}
              initial={{ opacity: 0, scale: 0, rotate: Math.random() * 20 - 10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{
                delay: 0.3 + index * 0.08,
                type: "spring",
                stiffness: 200,
                damping: 15,
              }}
              whileHover={{ scale: 1.1 }}
              className="cursor-default"
            >
              <span
                className={`font-poppins font-semibold ${topic.size} text-transparent bg-clip-text bg-gradient-to-r ${topic.color} drop-shadow-lg`}
              >
                {topic.text}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.5 }}
          className="font-nunito text-white/50 text-xs mt-6 text-center"
        >
          Fiecare mesaj, un pas mai aproape de El.
        </motion.p>
      </div>
    </div>
  );
}
