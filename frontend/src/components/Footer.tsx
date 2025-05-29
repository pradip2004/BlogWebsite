import React from "react";
import { PenLine, Twitter, Github, Linkedin } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-secondary border-t border-gray-200">
      <div className="lg:max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left: Logo, Description, Socials */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <PenLine className="w-8 h-8 text-[#ef233c]" />
            <span className="text-2xl font-bold text-primary">DevBlog.</span>
          </div>
          <p className="text-[var(--tertiary)] max-w-md">
            Discover, share, and read inspiring stories from real people. Join our community and start your journey today.
          </p>
          <div className="flex gap-4 mt-2">
            <Link href="https://twitter.com/" target="_blank" aria-label="Twitter">
              <Twitter className="w-5 h-5 text-[var(--tertiary)] hover:text-[#ef233c] transition" />
            </Link>
            <Link href="https://github.com/" target="_blank" aria-label="GitHub">
              <Github className="w-5 h-5 text-[var(--tertiary)] hover:text-[#ef233c] transition" />
            </Link>
            <Link href="https://linkedin.com/" target="_blank" aria-label="LinkedIn">
              <Linkedin className="w-5 h-5 text-[var(--tertiary)] hover:text-[#ef233c] transition" />
            </Link>
          </div>
        </div>

        {/* Right: Navigation & Newsletter */}
        <div className="flex flex-col gap-8">
          <nav className="flex flex-wrap gap-6 text-[var(--tertiary)] text-base">
            <Link href="/" className="hover:text-[#ef233c] transition">Home</Link>
            <Link href="/blog" className="hover:text-[#ef233c] transition">Blogs</Link>
            {/* <Link href="/about" className="hover:text-[#ef233c] transition">About</Link> */}
            <Link href="/contact" className="hover:text-[#ef233c] transition">Contact</Link>
          </nav>
          <form
            className="flex flex-col sm:flex-row gap-3"
            onSubmit={e => {
              e.preventDefault();
              // Add your newsletter logic here
            }}
          >
            <input
              type="email"
              required
              placeholder="Subscribe to newsletter"
              className="px-4 py-2 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#ef233c] transition"
            />
            <button
              type="submit"
              className="px-6 py-2 rounded-md bg-[#ef233c] text-white font-semibold hover:bg-[#d90429] transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
      <div className="border-t border-gray-200 mt-8 py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} DevBlog. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;