"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react"; // Icons for mobile menu

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false); // Function to close menu

  return (
    <nav className="fixed w-full z-20 bg-black/70 backdrop-blur-sm text-white">
      <div className="flex justify-between items-center py-3 px-6 md:px-10">
        {/* Logo */}
        <Link href="#home" className="flex items-center" onClick={closeMenu}>
          <Image
            src="/assets/images/Logo.svg"
            alt="E-Vote"
            width={40}
            height={59}
            // className="w-auto h-auto"
            priority
          />
        </Link>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white focus:outline-none"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6">
          <NavLinks onClick={closeMenu} />
        </div>

        {/* Login Button */}
        <div className="hidden md:flex">
          <LoginButton onClick={closeMenu} />
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden flex flex-col items-center space-y-4 py-4 bg-gray-900">
          <NavLinks onClick={closeMenu} />
          <LoginButton onClick={closeMenu} />
        </div>
      )}
    </nav>
  );
};

const NavLinks = ({ onClick }: { onClick: () => void }) => (
  <>
    <Link
      href="#home"
      className="hover:text-gray-300 transition"
      onClick={onClick}
    >
      Home
    </Link>
    <Link
      href="#security"
      className="hover:text-gray-300 transition"
      onClick={onClick}
    >
      Security
    </Link>
    <Link
      href="#structure"
      className="hover:text-gray-300 transition"
      onClick={onClick}
    >
      Structure
    </Link>
    <Link
      href="#priorities"
      className="hover:text-gray-300 transition"
      onClick={onClick}
    >
      Priorities
    </Link>
    <Link
      href="#about"
      className="hover:text-gray-300 transition"
      onClick={onClick}
    >
      About Us
    </Link>
  </>
);

const LoginButton = ({ onClick }: { onClick: () => void }) => (
  <Link
    href="/login"
    className="relative rounded px-8 py-2.5 overflow-hidden group border border-white hover:bg-gradient-to-r hover:from-gray-900 hover:to-gray-800 text-white hover:ring transition-all ease-out duration-400"
    onClick={onClick}
  >
    <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-40 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease rounded"></span>
    <span className="relative tracking-wider">Login</span>
  </Link>
);

export default Navbar;
