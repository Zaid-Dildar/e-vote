import React from "react";
import Image from "next/image";

const About = (): JSX.Element => {
  return (
    <section
      id="about"
      className="flex flex-col items-center justify-center min-h-screen w-full bg-cover bg-center bg-no-repeat py-[106px]"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url('/assets/images/AboutBackground.jpeg')",
      }}
    >
      <div className="flex flex-col items-center justify-center w-3/4 px-[20px] py-[50px]">
        {/* Title Section */}
        <div className="flex flex-col items-center justify-center w-full px-[30px] -mt-[25px] gap-5">
          <h2 className="w-full font-kadwa text-[40px] text-white leading-[52px] tracking-[0.8px] m-0 ">
            About Us
          </h2>
          <div className="w-full h-[2px] bg-white -mt-2"></div>
        </div>

        {/* Paragraph Section */}
        <div className="flex justify-center w-full mt-2 p-2 text-white">
          <p className="text-lg mb-8 ">
            We are a dedicated group of students from MCS (NUST) who developed
            E-Vote, a Biometric-Based Secure Online Voting System. Originally
            created for our university, MCS and NUST, our vision expanded to
            enable our app to facilitate elections for internal affairs of any
            organization, such as electing a CEO or other key positions through
            secure voting processes.
            <br /> We are committed to continuously improving our app, aiming to
            transform it into the largest and most reliable voting platform
            worldwide. By integrating advanced biometric technology, we ensure
            the utmost security and integrity in every election conducted
            through E-Vote. Check out our repository on GitHub for more details.
          </p>
        </div>

        {/* Image Section */}
        <div className="flex items-center justify-center gap-[47px] -mb-[25px]">
          <Image
            width={200}
            height={200}
            className="object-cover"
            alt="Nust vector svg"
            src="/assets/images/NustLogo.svg"
          />
          <Image
            height={200}
            width={200}
            className="object-cover"
            alt="Images removebg"
            src="/assets/images/NustLogo.svg"
          />
        </div>
      </div>
    </section>
  );
};

export default About;
