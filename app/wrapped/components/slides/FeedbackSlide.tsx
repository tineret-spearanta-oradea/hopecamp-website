"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const feedbacks = [
  {
    name: "Sebi",
    message: "O familie unită și primitoare 🫶",
    image: "/assets/images/wrapped/sebi.jpeg",
  },
  {
    name: "Alexia",
    message: "Anul în care am văzut roadele pentru care ne-am rugat ani de zile",
    image: "/assets/images/wrapped/alexia.jpeg",
  },
  {
    name: "Alex",
    message: "Am fost constanți în încercarea de a aduce îmbunătățiri și ajustări de la săptămână la săptămână.",
    image: "/assets/images/wrapped/alex.png",
  },
  {
    name: "Ianis",
    message: "Miracole - foarte faină tema. Un subiect vast dar foarte frumos.",
    image: "/assets/images/wrapped/ianis.jpeg",
  },
  {
    name: "Adelin",
    message: "Multe MIRACOLE. Am văzut că Dumnezeu investește mult în noi.",
    image: "/assets/images/wrapped/adelin.png",
  },
  {
    name: "Iosua",
    message: "Tinerii implicați transmit entuziasm",
    image: "/assets/images/wrapped/iosua.jpeg",
  },
];

export default function FeedbackSlide() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.3,
      },
    },
  };

  const messageVariants = {
    hidden: { opacity: 0, x: -20, scale: 0.95 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
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
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-violet-900/20 to-slate-900" />

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 h-full flex flex-col items-center justify-center px-4 py-10 overflow-y-auto"
      >
        {/* Messages */}
        <div className="w-full max-w-sm space-y-2">
          {feedbacks.map((feedback) => (
            <motion.div
              key={feedback.name}
              variants={messageVariants}
              className="flex items-start gap-2"
            >
              {/* Avatar */}
              <div className="relative w-7 h-7 rounded-full overflow-hidden flex-shrink-0 bg-slate-700">
                <Image
                  src={feedback.image}
                  alt={feedback.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Message bubble */}
              <div className="flex-1">
                <span className="font-poppins font-semibold text-[10px] text-white/60 ml-1">
                  {feedback.name}
                </span>
                <div className="bg-slate-800/90 rounded-2xl rounded-tl-sm px-2.5 py-1.5 border border-white/5">
                  <p className="font-nunito text-white/90 text-xs leading-relaxed">
                    {feedback.message}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
