"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@components/landing/Navbar";
import HeroSection from "@components/landing/HeroSection";
import About from "@components/landing/About";
import Priorities from "@components/landing/Priorities";
import Security from "@components/landing/Security";
import Structure from "@components/landing/Structure";
import Image from "next/image";

interface Section {
  id: string;
  component: JSX.Element;
  bg: string;
  overlay?: string; // Optional overlay color or gradient
}

export default function Home() {
  // Memoized sections array
  const sections = useMemo<Section[]>(
    () => [
      {
        id: "home",
        component: <HeroSection />,
        bg: "/assets/images/HeroBackground.jpeg",
        overlay: "bg-black/70",
      },
      {
        id: "security",
        component: <Security />,
        bg: "/assets/images/SecurityBackground.jpeg",
        overlay: "bg-black/60",
      },
      {
        id: "structure",
        component: <Structure />,
        bg: "/assets/images/StructureBackground.jpeg",
        overlay: "bg-black/50",
      },
      {
        id: "priorities",
        component: <Priorities />,
        bg: "/assets/images/PrioritiesBackground.jpg",
        overlay: "bg-black/50",
      },
      {
        id: "about",
        component: <About />,
        bg: "/assets/images/AboutBackground.jpeg",
        overlay: "bg-black/70",
      },
    ],
    []
  );

  // Array of refs for each section
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [activeBg, setActiveBg] = useState<string>(sections[0]?.bg || "");
  const [activeOverlay, setActiveOverlay] = useState<string>(
    sections[0]?.overlay || ""
  );

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRefs.current.length) return;

      const firstSection = sectionRefs.current[0];

      // Check if the first section is fully visible
      if (firstSection && sections[0]) {
        const firstRect = firstSection?.getBoundingClientRect();
        if (firstRect?.top >= 0 && firstRect?.bottom <= window.innerHeight) {
          setActiveBg(sections[0].bg);
          setActiveOverlay(sections[0].overlay || "");
          return; // Stop further checks if the first section is fully in view
        }
      }

      // Check other sections
      sectionRefs.current.forEach((section, i) => {
        if (section && sections[i]) {
          const rect = section.getBoundingClientRect();
          const inView = rect.top <= window.innerHeight / 2;

          if (inView) {
            setActiveBg(sections[i].bg);
            setActiveOverlay(sections[i].overlay || "");
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  return (
    <div className="relative">
      {/* Background Image with Animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeBg}
          initial={{ opacity: 0.7, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0.7, scale: 1.05 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed top-0 left-0 w-full h-screen z-[-1] overflow-hidden"
        >
          <Image
            src={activeBg}
            alt="Background"
            layout="fill"
            objectFit="cover"
            priority
            quality={90} // Adjust quality to balance performance and visuals
            className="w-full h-full"
          />
        </motion.div>
      </AnimatePresence>

      {/* Overlay */}
      <div
        className={`fixed top-0 left-0 w-full h-full z-[-1] transition-all duration-500 ${activeOverlay}`}
      />

      <Navbar />

      {sections.map((section, index) => (
        <div
          id={section.id}
          key={section.id}
          ref={(el) => {
            sectionRefs.current[index] = el;
          }}
          className="relative w-full py-10 lg:py-16 flex items-center justify-center scroll-mt-20 "
        >
          {section.component}
        </div>
      ))}
    </div>
  );
}
