"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const galleryImages = [
  "/assets/images/wrapped/2.png",
  "/assets/images/wrapped/4.png",
];

export default function GallerySlide() {
  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Split screen images - top and bottom */}
      <div className="absolute inset-0 flex flex-col">
        {/* Top half - Image 1 */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative flex-1 overflow-hidden"
        >
          <Image
            src={galleryImages[0]}
            alt="Gallery image 1"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />
        </motion.div>

        {/* Bottom half - Image 2 */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative flex-1 overflow-hidden"
        >
          <Image
            src={galleryImages[1]}
            alt="Gallery image 2"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />
        </motion.div>
      </div>

      {/* Center divider line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="absolute top-1/2 left-0 right-0 h-[2px] bg-white/30 z-10"
      />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">
        {/* Caption */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
          className="text-center bg-black/40 backdrop-blur-sm px-8 py-4 rounded-2xl border border-white/10"
        >
          <p className="font-nunito text-white text-lg md:text-xl">
            Momente care rămân în inimă...
          </p>
        </motion.div>
      </div>
    </div>
  );
}
