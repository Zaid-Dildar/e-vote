import Link from "next/link";
import React from "react";

const Structure = (): JSX.Element => {
  return (
    <section
      id="structure"
      className="flex flex-col items-center justify-center min-h-screen w-full bg-cover bg-center bg-no-repeat py-[106px]"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/assets/images/StructureBackground.jpeg')",
      }}
    >
      <div className="flex flex-col items-center justify-center w-3/4 px-[20px] py-[50px]">
        {/* Title Section */}
        <div className="flex flex-col items-center justify-center w-full px-[30px] -mt-[25px] gap-5">
          <h2 className="w-full font-kadwa text-[40px] text-white leading-[52px] tracking-[0.8px] m-0 ">
            E-Vote Structure
          </h2>
          <div className="w-full h-[2px] bg-white -mt-2"></div>
        </div>

        {/* Paragraph Section */}
        <div className="flex justify-center w-full mt-2 p-2 text-white">
          <p className="text-lg mb-8 ">
            E-Vote is an open-source application designed to facilitate secure,
            transparent, and efficient electronic voting. The app is available
            on GitHub, allowing developers and organizations to access, modify,
            and contribute to its codebase1. The primary goal of E-Vote is to
            provide a reliable platform for conducting elections, ensuring voter
            anonymity and accurate vote counting.
            <br />
            The data flow in E-Vote involves several key steps. First, the
            election administrator sets up the election by creating a ballot and
            defining the electorate1. Voters receive a unique, non-identifying
            token via email, which they use to access their personalized ballot
            page. Each voter casts their vote using this token, ensuring their
            vote remains anonymous1. Once the voting period ends, the election
            administrator can publish the list of votes, allowing voters to
            verify that their vote was recorded correctly. This process ensures
            transparency and trust in the election results1.
            <br />
            E-Vote is built using modern web technologies and frameworks, making
            it adaptable and scalable for various election scenarios. The
            app&apos;s open-source nature encourages collaboration and
            continuous improvement, helping to create a more robust and secure
            voting system.
          </p>
        </div>
        {/* Button Section */}
        {/* Button Section */}
        <div className="flex justify-center mt-5">
          <Link
            href="https://github.com/Zaid-Dildar/e-vote/tree/feature/web-landing-page/apps/web"
            target="_blank"
            rel="external"
            className="relative rounded px-10 py-2.5 overflow-hidden group border border-white hover:bg-gradient-to-r hover:from-gray-900 hover:to-gray-800 text-white  hover:ring transition-all ease-out duration-400"
            // className="px-6 py-4 cursor-pointer text-white text-lg font-bold rounded-md border-2 border-white hover:bg-[#112B4F]/95"
          >
            <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-90 bg-white opacity-10 rotate-12 group-hover:-translate-x-90 ease rounded"></span>

            <span className="relative tracking-wider text-lg font-bold">
              View Open Source Repository
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Structure;
