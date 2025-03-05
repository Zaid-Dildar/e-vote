"use client";

import { motion } from "framer-motion";

export default function ParticlesAnimation() {
  const particles = Array.from({ length: 30 });

  return (
    <div className="absolute top-0 left-0 w-full h-screen overflow-hidden">
      {particles.map((_, index) => (
        <motion.div
          key={index}
          className="absolute w-3 h-3 bg-white rounded-full opacity-30"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            scale: Math.random(),
            opacity: 0,
          }}
          animate={{
            y: [Math.random() * window.innerHeight, -50],
            opacity: [0.5, 0],
          }}
          transition={{
            duration: Math.random() * 4 + 3,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            left: `${Math.random() * 100}vw`,
            top: `${Math.random() * 100}vh`,
          }}
        />
      ))}
    </div>
  );
}
