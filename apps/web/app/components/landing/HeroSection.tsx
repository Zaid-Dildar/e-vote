"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";

const HeroSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true });

  return (
    <section
      ref={sectionRef}
      className="relative flex flex-col justify-center items-center text-white px-6 sm:px-8 md:px-12 pt-20"
    >
      <div className="max-w-3xl text-center md:text-left">
        {/* Animated Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6"
        >
          Lorem ipsum dolor sit amet consectetur.
        </motion.h1>

        {/* Animated Paragraph */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className="text-sm sm:text-base md:text-lg mb-8"
        >
          Lorem ipsum dolor sit amet consectetur. Nunc dui pellentesque mollis
          eget nibh purus. Lectus a pharetra aliquam enim dolor auctor dolor
          vitae consequat. In id velit accumsan lacinia massa lobortis id
          consectetur.
          <br />
          Et vel faucibus est nunc in pharetra turpis accumsan. Sit euismod
          etiam vitae laoreet massa feugiat. Vitae ut potenti mollis aliquam
          faucibus et morbi vestibulum vitae. Urna turpis aliquet cursus nibh
          fermentum vitae etiam massa laoreet.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
          className="flex flex-col sm:flex-row-reverse gap-4 items-center sm:items-start"
        >
          {/* Get Started Button */}
          <Link
            href="/login"
            className="relative rounded px-8 sm:px-10 py-2.5 sm:py-3 overflow-hidden shadow-xl group bg-gray-900 hover:bg-gradient-to-r hover:from-gray-900 hover:to-gray-800 text-white hover:ring transition-all ease-out duration-400 text-sm sm:text-base"
          >
            <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-50 bg-white opacity-10 rotate-12 group-hover:-translate-x-50 ease rounded"></span>
            <span className="relative tracking-wider">Get Started</span>
          </Link>

          {/* Watch Tutorial Button */}
          <button className="cursor-pointer flex items-center relative rounded px-6 sm:px-7 py-2.5 sm:py-3 overflow-hidden shadow-xl group border hover:bg-gradient-to-r hover:from-gray-900 hover:to-gray-800 text-white hover:ring transition-all ease-out duration-400 text-sm sm:text-base">
            <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-55 bg-white opacity-10 rotate-12 group-hover:-translate-x-55 ease rounded"></span>
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-900 transition group-hover:bg-white mr-2">
              <Image
                src="/assets/images/PlayButton.svg"
                alt="Play"
                width={19}
                height={19}
              />
            </span>
            <span className="relative tracking-wider">Watch Tutorial</span>
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
