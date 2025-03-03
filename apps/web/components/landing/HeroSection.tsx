import Image from "next/image";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section
      id="home"
      className="relative h-screen flex flex-col justify-center items-center bg-cover bg-center bg-no-repeat text-white  px-8"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),url('/assets/images/HeroBackground.jpeg')",
      }}
    >
      <div className="max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Lorem ipsum dolor sit amet consectetur.
        </h1>
        <p className="text-lg mb-8">
          Lorem ipsum dolor sit amet consectetur. Nunc dui pellentesque mollis
          eget nibh purus. Lectus a pharetra aliquam enim dolor auctor dolor
          vitae consequat. In id velit accumsan lacinia massa lobortis id
          consectetur.
          <br />
          Et vel faucibus est nunc in pharetra turpis accumsan. Sit euismod
          etiam vitae laoreet massa feugiat. Vitae ut potenti mollis aliquam
          faucibus et morbi vestibulum vitae. Urna turpis aliquet cursus nibh
          fermentum vitae etiam massa laoreet.
        </p>
        <div className="flex flex-row-reverse gap-x-4">
          <Link
            href="/login"
            className="relative rounded px-10 py-2.5 overflow-hidden shadow-2xl group bg-gray-900 hover:bg-gradient-to-r hover:from-gray-900 hover:to-gray-800 text-white  hover:ring transition-all ease-out duration-400"
          >
            <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-50 bg-white opacity-10 rotate-12 group-hover:-translate-x-50 ease rounded"></span>
            <span className="relative tracking-wider">Get Started</span>
          </Link>

          <button className="cursor-pointer flex relative rounded px-7 py-2.5 overflow-hidden shadow-2xl group border hover:bg-gradient-to-r hover:from-gray-900 hover:to-gray-800 text-white  hover:ring transition-all ease-out duration-400">
            <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-55 bg-white opacity-10 rotate-12 group-hover:-translate-x-55 ease rounded"></span>
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-900 transition group-hover:bg-white mr-1">
              <Image
                src="/assets/images/PlayButton.svg"
                alt="Play"
                width={19}
                height={19}
              />
            </span>
            <span className="relative tracking-wider">Watch Tutorial</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
