import Link from "next/link";
import React from "react";

const Security = (): JSX.Element => {
  return (
    <section
      id="security"
      className="flex flex-col items-center justify-center min-h-screen w-full bg-cover bg-center bg-no-repeat py-[106px]"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url('/assets/images/SecurityBackground.jpeg')",
      }}
    >
      <div className="flex flex-col border-2 border-white rounded-md items-center justify-center w-3/4 px-[20px] py-[50px]">
        {/* Title Section */}
        <div className="flex flex-col items-center justify-center w-full px-[30px] -mt-[25px] gap-5">
          <h2 className="w-full font-kadwa text-[40px] text-white leading-[52px] tracking-[0.8px] m-0 ">
            Security Technologies
          </h2>
          <div className="w-full h-[2px] bg-white -mt-2"></div>
        </div>

        {/* Paragraph Section */}
        <div className="flex justify-center w-full mt-2 p-2 text-white">
          <p className="text-lg mb-8 ">
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
        </div>

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
              Get Security Certifications
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Security;
