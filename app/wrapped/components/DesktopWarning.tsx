"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { FaMobileAlt } from "react-icons/fa";

export default function DesktopWarning() {
  const [showWarning, setShowWarning] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if device is desktop (width > 768px and not touch device)
    const checkDevice = () => {
      const isDesktop = window.innerWidth > 768 && !('ontouchstart' in window);
      setShowWarning(isDesktop && !dismissed);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, [dismissed]);

  const handleContinue = () => {
    setDismissed(true);
    setShowWarning(false);
  };

  return (
    <AnimatePresence>
      {showWarning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-slate-900 flex items-center justify-center p-6"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            className="max-w-md text-center"
          >
            {/* Phone Icon */}
            <motion.div
              animate={{
                rotate: [0, -10, 10, -10, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatDelay: 2,
              }}
              className="mb-6 inline-block"
            >
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                <FaMobileAlt className="w-10 h-10 text-white" />
              </div>
            </motion.div>

            {/* Title */}
            <h2 className="font-poppins font-bold text-2xl md:text-3xl text-white mb-4">
              Experiență Optimizată pe Mobil
            </h2>

            {/* Message */}
            <p className="font-nunito text-white/70 text-base mb-8 leading-relaxed">
              TSO Wrapped este creat pentru a fi vizualizat pe telefon,
              similar cu Instagram Stories. Pentru cea mai bună experiență,
              te rugăm să accesezi această pagină de pe telefonul tău.
            </p>

            {/* QR Code hint */}
            <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/10">
              <p className="font-nunito text-white/50 text-sm">
                💡 Accesează linkul de pe telefon
              </p>
              <p className="font-mono text-purple-400 text-sm mt-2">
                {typeof window !== 'undefined' ? window.location.href : ''}
              </p>
            </div>

            {/* Continue Button */}
            <button
              onClick={handleContinue}
              className="px-8 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full border border-white/20 text-white font-medium transition-all duration-300 hover:scale-105"
            >
              Continuă oricum pe desktop
            </button>

            {/* Subtle hint */}
            <p className="font-nunito text-white/30 text-xs mt-4">
              Navigarea se face cu click stânga/dreapta sau cu săgețile
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
