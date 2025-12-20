"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const hopeCampImages = [
  "/assets/images/hopecamp/gratiadei/ELI03065.jpg",
  "/assets/images/hopecamp/gratiadei/ELI09640.jpg",
];

export default function HopeCampGallerySlideTwo() {
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
            src={hopeCampImages[0]}
            alt="Hope Camp moment 1"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
        </motion.div>

        {/* Bottom half - Image 2 */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative flex-1 overflow-hidden"
        >
          <Image
            src={hopeCampImages[1]}
            alt="Hope Camp moment 2"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/60" />
        </motion.div>
      </div>

      {/* Gradient overlay for text readability */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-orange-500/5 to-amber-500/5 z-[1]"
        animate={{
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

    </div>
  );
}
