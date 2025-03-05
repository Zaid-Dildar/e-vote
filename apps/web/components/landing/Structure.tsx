import Link from "next/link";
import { motion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";

const Structure = (): JSX.Element => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true });

  return (
    <motion.section
      id="structure"
      ref={sectionRef}
      className="flex flex-col items-center justify-center w-full px-4"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <motion.div
        className="flex flex-col border-2 border-white rounded-md items-center justify-center w-11/12 md:w-3/4 px-5 md:px-[20px] py-[40px]  backdrop-blur-xs "
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
            E-Vote Strcture
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
          E-Vote is an open-source application designed to facilitate secure,
          transparent, and efficient electronic voting. The app is available on
          GitHub, allowing developers and organizations to access, modify, and
          contribute to its codebase1. The primary goal of E-Vote is to provide
          a reliable platform for conducting elections, ensuring voter anonymity
          and accurate vote counting.
          <br />
          The data flow in E-Vote involves several key steps. First, the
          election administrator sets up the election by creating a ballot and
          defining the electorate1. Voters receive a unique, non-identifying
          token via email, which they use to access their personalized ballot
          page. Each voter casts their vote using this token, ensuring their
          vote remains anonymous1. Once the voting period ends, the election
          administrator can publish the list of votes, allowing voters to verify
          that their vote was recorded correctly. This process ensures
          transparency and trust in the election results1.
          <br />
          E-Vote is built using modern web technologies and frameworks, making
          it adaptable and scalable for various election scenarios. The
          app&apos;s open-source nature encourages collaboration and continuous
          improvement, helping to create a more robust and secure voting system.
        </motion.p>

        {/* Button Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
          className="flex justify-center mt-6"
        >
          <Link
            href="https://github.com/Zaid-Dildar/e-vote/tree/feature/web-landing-page/apps/web"
            target="_blank"
            rel="external"
            className="relative rounded px-4 lg:px-8 py-3 overflow-hidden group border border-white hover:bg-gradient-to-r hover:from-gray-900 hover:to-gray-800 text-white transition-all ease-out duration-400 text-sm md:text-lg font-bold"
          >
            <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-90 bg-white opacity-10 rotate-12 group-hover:-translate-x-90 ease rounded"></span>
            <span className="relative tracking-wider">
              View Open Source Repository
            </span>
          </Link>
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default Structure;
