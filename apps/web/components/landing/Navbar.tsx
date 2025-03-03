import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  return (
    <nav className="fixed w-full z-10 flex justify-between items-center py-2 px-8 bg-black/70 backdrop-blur-xs text-white">
      {/* Logo */}
      <Link className="flex items-center px-5" href="#home">
        <Image
          src="/assets/images/Logo.svg"
          alt="E-Vote"
          width={40}
          height={40}
        />
      </Link>

      {/* Navigation Links */}
      <div className="flex space-x-6">
        <Link href="#home" className="hover:text-gray-300 transition">
          Home
        </Link>
        <Link href="#security" className="hover:text-gray-300 transition">
          Security
        </Link>
        <Link href="#structure" className="hover:text-gray-300 transition">
          Structure
        </Link>
        <Link href="#priorities" className="hover:text-gray-300 transition">
          Priorities
        </Link>
        <Link href="#about" className="hover:text-gray-300 transition">
          About Us
        </Link>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center">
        <Link
          href="/login"
          className="relative rounded px-10 py-2.5 overflow-hidden group border border-white hover:bg-gradient-to-r hover:from-gray-900 hover:to-gray-800 text-white  hover:ring transition-all ease-out duration-400"
          // className="border border-white text-white px-5 py-2 rounded-xs hover:bg-[#112B4F] "
        >
          <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-40 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease rounded"></span>
          <span className="relative tracking-wider">Login</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
