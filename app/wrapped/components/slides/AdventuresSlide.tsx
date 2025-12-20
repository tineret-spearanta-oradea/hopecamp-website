"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import CountUp from "../animations/CountUp";

const camps = [
  {
    name: "Hope Camp #6",
    theme: "Gratia Dei",
    year: "2025",
    image: "/assets/images/hopecamp/gratiadei/ELI02865.jpg",
    gradient: "from-purple-600 to-pink-600",
  },
  {
    name: "Winter Camp 2",
    theme: "Remade",
    year: "2025",
    image: "/assets/images/wintercamp/Day2-26.jpg",
    gradient: "from-blue-600 to-cyan-600",
  },
];

export default function AdventuresSlide() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-900/50 to-slate-900" />

      {/* Animated mountains silhouette */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3">
        <svg
          viewBox="0 0 1440 320"
          className="absolute bottom-0 w-full h-full"
          preserveAspectRatio="none"
        >
          <motion.path
            fill="rgba(99, 102, 241, 0.1)"
            initial={{ d: "M0,320L1440,320L1440,320L0,320Z" }}
            animate={{
              d: "M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,218.7C672,235,768,245,864,234.7C960,224,1056,192,1152,181.3C1248,171,1344,181,1392,186.7L1440,192L1440,320L0,320Z",
            }}
            transition={{ duration: 1, delay: 0.5 }}
          />
          <motion.path
            fill="rgba(139, 92, 246, 0.15)"
            initial={{ d: "M0,320L1440,320L1440,320L0,320Z" }}
            animate={{
              d: "M0,256L48,261.3C96,267,192,277,288,266.7C384,256,480,224,576,218.7C672,213,768,235,864,250.7C960,267,1056,277,1152,272C1248,267,1344,245,1392,234.7L1440,224L1440,320L0,320Z",
            }}
            transition={{ duration: 1, delay: 0.3 }}
          />
        </svg>
      </div>

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 h-full flex flex-col items-center justify-center px-6 py-16"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-6">
          <h2 className="font-poppins font-bold text-3xl md:text-4xl text-white">
            Taberele anului
          </h2>
        </motion.div>

        {/* Distance stat */}
        <motion.div
          variants={itemVariants}
          className="flex items-center gap-3 mb-8 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/10"
        >
          <span className="text-2xl">🚌</span>
          <span className="font-poppins font-bold text-2xl md:text-3xl text-white">
            <CountUp end={768} suffix=" km" />
          </span>
          <span className="text-white/60">parcurși</span>
        </motion.div>

        {/* Camp Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full max-w-2xl">
          {camps.map((camp, index) => (
            <motion.div
              key={camp.name}
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -5 }}
              className="relative overflow-hidden rounded-2xl border border-white/10 group cursor-default"
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src={camp.image}
                  alt={camp.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${camp.gradient} opacity-60`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              </div>

              {/* Content */}
              <div className="relative z-10 p-6 h-48 md:h-56 flex flex-col justify-end">
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.2 }}
                  className="text-white/60 text-sm font-medium mb-1"
                >
                  {camp.year}
                </motion.span>
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + index * 0.2 }}
                  className="font-poppins font-bold text-2xl md:text-3xl text-white mb-2"
                >
                  {camp.name}
                </motion.h3>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 + index * 0.2 }}
                >
                  <span className={`inline-block px-3 py-1 bg-gradient-to-r ${camp.gradient} rounded-full text-white text-sm font-semibold`}>
                    {camp.theme}
                  </span>
                </motion.div>
              </div>

              {/* Shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
                initial={{ x: "-200%" }}
                animate={{ x: "200%" }}
                transition={{ delay: 1.5 + index * 0.3, duration: 0.8 }}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
