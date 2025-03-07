"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Define types for dimensions and particles
interface Dimensions {
  width: number;
  height: number;
}

interface Particle {
  x: number;
  y: number;
  scale: number;
  left: string;
  top: string;
  duration: number;
}

export default function ParticlesAnimation() {
  const [dimensions, setDimensions] = useState<Dimensions>({
    width: 1920,
    height: 1080,
  });

  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });

      const handleResize = () => {
        setDimensions({ width: window.innerWidth, height: window.innerHeight });
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  useEffect(() => {
    setParticles(
      Array.from({ length: 30 }).map(
        (): Particle => ({
          x: Math.random() * dimensions.width,
          y: Math.random() * dimensions.height,
          scale: Math.random(),
          left: `${Math.random() * 100}vw`,
          top: `${Math.random() * 100}vh`,
          duration: Math.random() * 4 + 3,
        })
      )
    );
  }, [dimensions]);

  return (
    <div className="absolute top-0 left-0 w-full h-screen overflow-hidden">
      {particles.map((particle, index) => (
        <motion.div
          key={index}
          className="absolute w-3 h-3 bg-white rounded-full opacity-30"
          initial={{
            x: particle.x,
            y: particle.y,
            scale: particle.scale,
            opacity: 0,
          }}
          animate={{
            y: [-50, particle.y],
            opacity: [0.5, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            left: particle.left,
            top: particle.top,
          }}
        />
      ))}
    </div>
  );
}
