"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { List, X } from "@phosphor-icons/react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: "/solutions", label: "Solutions" },
    { href: "/case-studies", label: "Case Studies" },
    { href: "/about", label: "About" },
    { href: "/blog", label: "Blog" },
  ];

  return (
    <header className="pt-6 pb-4">
      <div className="container mx-auto px-6">
        {/* Wordmark and Mobile Menu Button */}
        <div className="flex items-center justify-between mb-4">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/entrsphere_asset_icon_transparent.webp"
              alt="EntrSphere icon"
              width={32}
              height={32}
              className="h-8 w-8"
            />
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              entrsphere
            </span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X weight="duotone" className="h-6 w-6 text-slate-800" />
            ) : (
              <List weight="duotone" className="h-6 w-6 text-slate-800" />
            )}
          </button>
        </div>

        <div className="border-t border-slate-200 pt-4">
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-slate-800 hover:text-slate-600 transition-all font-medium border-b-2 border-transparent hover:border-slate-800 pb-1"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="text-slate-800 hover:text-slate-600 transition-colors font-medium border border-slate-800 rounded-full px-4 py-1.5"
            >
              Contact
            </Link>
          </nav>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <nav className="md:hidden flex flex-col gap-4 pb-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-slate-800 hover:text-slate-600 transition-colors font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/contact"
                className="text-slate-800 hover:text-slate-600 transition-colors font-medium border border-slate-800 rounded-full px-4 py-2 text-center w-fit"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
