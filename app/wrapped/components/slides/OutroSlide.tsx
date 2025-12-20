"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";
import Confetti from "../animations/Confetti";
import { FaInstagram, FaFacebookF, FaTiktok, FaYoutube } from "react-icons/fa";

const socials = [
  {
    name: "Instagram",
    icon: FaInstagram,
    url: "https://instagram.com/tineretso",
    color: "from-purple-500 via-pink-500 to-orange-500",
  },
  {
    name: "Facebook",
    icon: FaFacebookF,
    url: "https://facebook.com/tineretso",
    color: "from-blue-600 to-blue-500",
  },
  {
    name: "TikTok",
    icon: FaTiktok,
    url: "https://tiktok.com/@tineretso",
    color: "from-gray-800 to-gray-900",
  },
  {
    name: "YouTube",
    icon: FaYoutube,
    url: "https://youtube.com/@tineretso",
    color: "from-red-600 to-red-500",
  },
];

export default function OutroSlide() {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Trigger confetti after a short delay
    const timer = setTimeout(() => {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
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

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/assets/images/gallery/ZVE03423.jpg"
          alt="Group photo"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
      </div>

      {/* Confetti */}
      <Confetti isActive={showConfetti} duration={4000} />

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 h-full flex flex-col items-center justify-center px-6 py-16"
      >
        {/* Thank you */}
        <motion.div
          variants={itemVariants}
          className="text-center mb-6"
        >
          <motion.h1
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: 0.2,
            }}
            className="font-poppins font-extrabold text-5xl md:text-7xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400"
          >
            MULȚUMIM!
          </motion.h1>
        </motion.div>

        {/* Message */}
        <motion.div
          variants={itemVariants}
          className="max-w-md text-center mb-8"
        >
          <p className="font-nunito text-white/80 text-base md:text-lg leading-relaxed">
            tuturor celor care fac TSO să fie TSO!
            Liderilor, voluntarilor, vouă - participanților de la tineret - și, bineînțeles,
            <span className="text-purple-400 font-semibold"> lui Dumnezeu!</span>
          </p>
          <motion.p
            variants={itemVariants}
            className="mt-4 font-poppins font-bold text-xl text-white"
          >
            Voi sunteți CEI MAI TARI! 🙌
          </motion.p>
        </motion.div>

        {/* Social Links */}
        <motion.div variants={itemVariants} className="mb-8">
          <p className="font-nunito text-white/50 text-sm text-center mb-4">
            Rămâi conectat cu noi
          </p>
          <div className="flex gap-4">
            {socials.map((social, index) => (
              <motion.a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className={`w-12 h-12 rounded-full bg-gradient-to-br ${social.color} flex items-center justify-center shadow-lg`}
                onClick={(e) => e.stopPropagation()}
              >
                <social.icon className="w-5 h-5 text-white" />
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Looking Forward */}
        <motion.div
          variants={itemVariants}
          className="text-center"
        >
          <p className="font-nunito text-white/60 text-sm mb-2">
            Anul 2025 a fost de neuitat!
          </p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="font-poppins font-bold text-2xl md:text-3xl text-white"
          >
            Abia așteptăm 2026! 🚀
          </motion.p>
        </motion.div>

        {/* Replay button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          onClick={(e) => {
            e.stopPropagation();
            window.location.reload();
          }}
          className="mt-8 px-6 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-white/80 text-sm hover:bg-white/20 transition-all"
        >
          ↺ Revezi Wrapped
        </motion.button>

        {/* TSO Logo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="relative w-12 h-12 opacity-30">
            <Image
              src="/assets/images/logo-tso.png"
              alt="TSO Logo"
              fill
              className="object-contain"
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
