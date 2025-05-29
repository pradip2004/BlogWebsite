import React from "react";
import { PenLine } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-secondary border-t border-gray-200">
      <div className="lg:max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <PenLine className="w-8 h-8 text-[#ef233c]" />
          <span className="text-2xl font-bold text-primary">HumanStories</span>
        </div>

        {/* Navigation Links */}
        <nav className="flex gap-6 text-[var(--tertiary)] text-base">
          <Link href="/" className="hover:text-[#ef233c] transition">
            Home
          </Link>
          <Link href="/blog" className="hover:text-[#ef233c] transition">
            Blogs
          </Link>
          <Link href="/about" className="hover:text-[#ef233c] transition">
            About
          </Link>
          <Link href="/contact" className="hover:text-[#ef233c] transition">
            Contact
          </Link>
        </nav>

        {/* Copyright */}
        <div className="text-sm text-gray-500 text-center md:text-right">
          © {new Date().getFullYear()} HumanStories. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;