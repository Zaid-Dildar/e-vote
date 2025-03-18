"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ListChecks,
  ShieldCheck,
  Menu,
  X,
} from "lucide-react";
import Image from "next/image";

const sidebarLinks = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Users", href: "/users", icon: Users },
  { name: "Elections", href: "/elections", icon: ListChecks },
  { name: "Audit Logs", href: "/audit-logs", icon: ShieldCheck },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Sidebar Toggle Button */}
      <button
        className="lg:hidden p-3 fixed top-2.5 left-1 z-50 bg-gray-900 text-white rounded-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar Container */}
      <aside
        className={`fixed z-30 inset-y-0 left-0 w-64 bg-gradient-to-br from-[#112B4F] to-gray-800 text-white flex flex-col p-5 transition-transform transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Sidebar Header */}
        {/* Logo */}
        <Link
          href="/"
          className="flex justify-center items-center"
          onClick={() => {
            setIsOpen(false);
          }}
        >
          <Image
            src="/assets/images/Logo.svg"
            alt="E-Vote"
            width={60}
            height={89}
            priority
          />
        </Link>
        <h2 className="text-xl text-center font-bold border-b pb-2 my-3">
          Admin Panel
        </h2>

        {/* Sidebar Navigation Links */}
        <nav className="flex-1">
          <ul className="space-y-2">
            {sidebarLinks.map(({ name, href, icon: Icon }, index) => (
              <li key={name}>
                <Link
                  href={href}
                  className={`group relative overflow-hidden flex items-center gap-3 px-4 py-2 rounded-md transition ${
                    pathname === "/admin" + (index !== 0 ? href : "")
                      ? "bg-gray-700"
                      : "hover:bg-gray-900"
                  }`}
                  onClick={() => {
                    setIsOpen(false);
                  }}
                >
                  <span
                    className={`absolute -top-10 w-10 h-30 bg-white opacity-10 rotate-6 translate-x-60 group-hover:-translate-x-40 transition-all duration-1500 ease`}
                  />
                  <Icon className="w-5 h-5" />
                  <span>{name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Overlay for Mobile Sidebar */}
      {isOpen && (
        <div
          className="fixed z-20 inset-0 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
}
