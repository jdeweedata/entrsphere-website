"use client";

import { useState } from "react";
import Link from "next/link";
import { List, X } from "@phosphor-icons/react";

interface NavLink {
  href: string;
  label: string;
}

interface MobileMenuButtonProps {
  navLinks: NavLink[];
}

export default function MobileMenuButton({ navLinks }: MobileMenuButtonProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <button
        className="md:hidden p-2"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle menu"
        aria-expanded={isMenuOpen}
      >
        {isMenuOpen ? (
          <X weight="duotone" className="h-6 w-6 text-slate-800" />
        ) : (
          <List weight="duotone" className="h-6 w-6 text-slate-800" />
        )}
      </button>

      {isMenuOpen && (
        <nav className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-200 py-4 px-6 z-50">
          <div className="flex flex-col gap-4">
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
          </div>
        </nav>
      )}
    </>
  );
}
