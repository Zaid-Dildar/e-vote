"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

const Security = (): JSX.Element => {
  const sectionRef = useRef(null);
  const [viewAmount, setViewAmount] = useState(0.02);

  useEffect(() => {
    const updateViewAmount = () => {
      if (window.innerWidth > 768) {
        // Larger screens (e.g., desktop)
        setViewAmount(0.2);
      } else {
        // Smaller screens (e.g., mobile)
        setViewAmount(0.05);
      }
    };

    updateViewAmount(); // Set initial value
    window.addEventListener("resize", updateViewAmount);

    return () => window.removeEventListener("resize", updateViewAmount);
  }, []);

  const isInView = useInView(sectionRef, { once: true, amount: viewAmount });

  return (
    <section
      ref={sectionRef}
      className="flex flex-col items-center justify-center w-full"
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col border-2 border-white rounded-md items-center justify-center w-11/12 md:w-3/4 px-5 md:px-[20px] py-[40px]  backdrop-blur-xs bg-black/60"
      >
        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="flex flex-col items-center justify-center w-full gap-5"
        >
          <h2 className="text-center font-kadwa text-3xl md:text-4xl text-white tracking-wide">
            Security Technologies
          </h2>
          <div className="w-3/4 md:w-full h-[2px] bg-white"></div>
        </motion.div>

        {/* Paragraph Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
          className="flex justify-center w-full mt-4 px-4 md:px-6 text-white text-sm md:text-lg leading-relaxed"
        >
          <p className="text-center md:text-left">
            Lorem ipsum dolor sit amet consectetur. Nunc dui pellentesque mollis
            eget nibh purus. Lectus a pharetra aliquam enim dolor auctor dolor
            vitae consequat. In id velit accumsan lacinia massa lobortis id
            consectetur.
            <br /> Et vel faucibus est nunc in pharetra turpis accumsan. Sit
            euismod etiam vitae laoreet massa feugiat.Lorem ipsum dolor sit amet
            consectetur. Nunc dui pellentesque mollis eget nibh purus. Lectus a
            pharetra aliquam enim dolor auctor dolor vitae consequat.
            <br />
            In id velit accumsan lacinia massa lobortis id consectetur. Et vel
            faucibus est nunc in pharetra turpis accumsan. Sit euismod etiam
            vitae laoreet massa feugiat.Lorem ipsum dolor sit amet consectetur.
            Nunc dui pellentesque mollis eget nibh purus. Lectus a pharetra
            aliquam enim dolor auctor dolor vitae consequat. In id velit
            accumsan lacinia massa lobortis id consectetur.
            <br /> Et vel faucibus est nunc in pharetra turpis accumsan. Sit
            euismod etiam vitae laoreet massa feugiat.
          </p>
        </motion.div>

        {/* Button Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
          className="flex justify-center mt-6"
        >
          <Link
            href="https://github.com/Zaid-Dildar/e-vote/"
            target="_blank"
            rel="external"
            className="relative rounded px-4 lg:px-8 py-3 overflow-hidden group border border-white hover:bg-gradient-to-r hover:from-gray-900 hover:to-gray-800 text-white transition-all ease-out duration-400 text-sm md:text-lg font-bold"
          >
            <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-90 bg-white opacity-10 rotate-12 group-hover:-translate-x-90 ease rounded"></span>
            <span className="relative tracking-wider">
              Get Security Certifications
            </span>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Security;
