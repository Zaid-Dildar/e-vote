import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";

const About = (): JSX.Element => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true });

  return (
    <motion.section
      ref={sectionRef}
      className="flex flex-col items-center justify-center w-full px-4"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <motion.div
        className="flex flex-col border-2 border-white rounded-md items-center justify-center w-11/12 md:w-3/4 px-5 md:px-[20px] py-[40px] backdrop-blur-xs"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="flex flex-col items-center justify-center w-full gap-5"
        >
          <h2 className="text-center font-kadwa text-3xl md:text-4xl text-white tracking-wide">
            About Us
          </h2>
          <div className="w-3/4 md:w-full h-[2px] bg-white"></div>
        </motion.div>

        {/* Paragraph Section */}
        <motion.p
          className="text-lg text-white text-center mt-4 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          We are a dedicated group of students from MCS (NUST) who developed
          E-Vote, a Biometric-Based Secure Online Voting System. Originally
          created for our university, MCS and NUST, our vision expanded to
          enable our app to facilitate elections for internal affairs of any
          organization, such as electing a CEO or other key positions through
          secure voting processes.
          <br />
          We are committed to continuously improving our app, aiming to
          transform it into the largest and most reliable voting platform
          worldwide. By integrating advanced biometric technology, we ensure the
          utmost security and integrity in every election conducted through
          E-Vote. Check out our repository on GitHub for more details.
        </motion.p>

        {/* Image Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-6 mt-6"
        >
          <div className="relative w-32 h-32 md:w-40 md:h-40">
            <Image
              src="/assets/images/NustLogo.svg"
              alt="Nust vector svg"
              fill
              className="object-contain"
            />
          </div>
          <div className="relative w-32 h-32 md:w-40 md:h-40">
            <Image
              src="/assets/images/NustLogo.svg"
              alt="Images removebg"
              fill
              className="object-contain"
            />
          </div>
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default About;
