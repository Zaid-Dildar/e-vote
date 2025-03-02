import Image from "next/image";
import React from "react";

const Priorities = (): JSX.Element => {
  return (
    <section
      id="priorities"
      className="flex flex-col items-center justify-center min-h-screen w-full bg-cover bg-center bg-no-repeat py-[106px]"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/assets/images/PrioritiesBackground.jpg')",
      }}
    >
      <div className="flex flex-col items-center justify-center gap-[2.5px] px-[200px] py-[70px] w-full">
        {/* Title Section */}
        <div className="flex flex-col items-center justify-center w-full px-[30px] -mt-[25px] gap-5">
          <h2 className="w-full font-kadwa text-[40px] text-white leading-[52px] tracking-[0.8px] m-0 ">
            Priorities
          </h2>
          <div className="w-full h-[2px] bg-white -mt-2"></div>
        </div>

        {/* Priorities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full -mb-5 mt-2 p-2">
          <div key={1} className="flex flex-col items-center gap-[2.5px]">
            <div className="relative w-full h-[250px]">
              <Image
                src="/assets/images/reliable.svg"
                alt="Security"
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <p className="h3-text text-white whitespace-nowrap">Security</p>
          </div>
          <div key={2} className="flex flex-col items-center gap-[2.5px]">
            <div className="relative w-full h-[250px]">
              <Image
                src="/assets/images/reliable.svg"
                alt="Integrity"
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <p className="h3-text text-white whitespace-nowrap">Integrity</p>
          </div>
          <div key={3} className="flex flex-col items-center gap-[2.5px]">
            <div className="relative w-full h-[250px]">
              <Image
                src="/assets/images/reliable.svg"
                alt="Reliability"
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <p className="h3-text text-white whitespace-nowrap">Reliability</p>
          </div>
          <div key={4} className="flex flex-col items-center gap-[2.5px]">
            <div className="relative w-full h-[250px]">
              <Image
                src="/assets/images/reliable.svg"
                alt="User-Friendliness"
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <p className="h3-text text-white whitespace-nowrap">
              User-Friendliness
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Priorities;
