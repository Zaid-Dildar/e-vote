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
            href="/sign-up"
            className="cursor-pointer bg-[#112B4F]/95 hover:bg-[#112B4F] text-white px-6 py-3 rounded-md transition"
          >
            Get Started
          </Link>
          <button className="group cursor-pointer flex items-center hover:bg-[#112B4F]/95 text-white px-6 py-3 rounded-md transition">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#112B4F] transition group-hover:bg-white mr-1">
              <Image
                src="/assets/images/PlayButton.png"
                alt="Play"
                width={20}
                height={20}
                className="group-hover:invert"
              />
            </div>
            Watch Tutorial
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
