import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  return (
    <nav className="fixed w-full z-10 flex justify-between items-center py-4 px-8 bg-black/80 backdrop-blur-xs text-white">
      {/* Logo */}
      <Link className="flex items-center" href="#home">
        <Image
          src="/assets/images/Logo.svg"
          alt="E-Vote"
          width={30}
          height={30}
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
      <div className="flex items-center space-x-4">
        <Link
          href="/login"
          className=" text-white hover:text-gray-300 transition"
        >
          Login
        </Link>
        <Link
          href="/sign-up"
          className="border border-white text-white px-5 py-2 rounded-xs hover:bg-[#112B4F] "
        >
          Sign Up
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
