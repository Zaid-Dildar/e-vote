// components/Navbar.tsx
"use client";
import { Button } from "antd";
import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center py-4 px-8 bg-black text-white">
      <div className="flex items-center">
        <Image
          src="/assets/images/logo.png"
          alt="E-Vote"
          width={50}
          height={50}
        />
        <span className="ml-2 text-xl font-bold">E-VOTE</span>
      </div>
      <div className="flex space-x-6">
        <Link href="/">Home</Link>
        <Link href="#security">Security</Link>
        <Link href="#structure">Structure</Link>
        <Link href="#priorities">Priorities</Link>
        <Link href="#about">About Us</Link>
      </div>
      <div className="flex space-x-4">
        <Button type="text" className="text-white">
          Login
        </Button>
        <Button type="default" className="border-white text-white">
          Sign Up
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
