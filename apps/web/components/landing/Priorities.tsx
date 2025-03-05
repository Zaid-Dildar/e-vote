import { motion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";
import Image from "next/image";

const priorities = [
  { id: 1, title: "Security", img: "/assets/images/reliability.svg" },
  { id: 2, title: "Integrity", img: "/assets/images/reliability.svg" },
  { id: 3, title: "Reliability", img: "/assets/images/reliability.svg" },
  {
    id: 4,
    title: "User-Friendliness",
    img: "/assets/images/reliability.svg",
  },
];

const Priorities = (): JSX.Element => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true });

  return (
    <motion.section
      id="priorities"
      ref={sectionRef}
      className="flex flex-col items-center justify-center w-full px-4"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <motion.div
        className="flex flex-col rounded-md items-center justify-center w-11/12 md:w-3/4 px-5 md:px-[20px]"
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
            Priorities
          </h2>
          <div className="w-3/4 md:w-full h-[2px] bg-white"></div>
        </motion.div>

        {/* Priorities Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mt-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { staggerChildren: 0.2, duration: 0.6 },
            },
          }}
        >
          {priorities.map(({ id, title, img }) => (
            <motion.div
              key={id}
              className="flex flex-col items-center p-6 border border-white rounded-lg text-white text-lg font-semibold text-center bg-transparent backdrop-blur-xs hover:bg-white hover:text-gray-900 transition-all duration-300"
              variants={{
                hidden: { opacity: 0, scale: 0.8 },
                visible: { opacity: 1, scale: 1 },
              }}
            >
              <div className="relative w-24 h-24 md:w-32 md:h-32 mb-4">
                <Image src={img} alt={title} fill className="object-contain" />
              </div>
              {title}
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default Priorities;
