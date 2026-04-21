"use client";

import Link from "next/link";
import { useState } from "react";

const categories = ["All", "Portrait", "Landscape", "Architecture", "Video"];

export default function Navbar() {
    const [activeCategory, setActiveCategory] = useState("All");
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-brand-dark/90 backdrop-blur-sm border-b border-brand-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Logo */}
                    <Link href="/" className="text-brand-accent font-semibold text-lg tracking-widest uppercase">
                        Lens&Co
                    </Link>

                    {/* Desktop Category Nav */}
                    <nav className="hidden md:flex items-center gap-1">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                                    activeCategory === cat
                                        ? "bg-brand-accent text-brand-dark"
                                        : "text-brand-muted hover:text-brand-accent"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </nav>

                    {/* Admin Link (desktop) */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link
                            href="/admin"
                            className="text-sm text-brand-muted hover:text-brand-accent transition-colors duration-200 border border-brand-border px-3 py-1.5 rounded-md"
                        >
                            Admin
                        </Link>
                    </div>

                    {/* Mobile Hamburger */}
                    <button
                        className="md:hidden text-brand-muted hover:text-brand-accent"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle menu"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {menuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Dropdown */}
                {menuOpen && (
                    <div className="md:hidden border-t border-brand-border py-3 space-y-1">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => {
                                    setActiveCategory(cat);
                                    setMenuOpen(false);
                                }}
                                className={`block w-full text-left px-4 py-2 text-sm rounded-md transition-colors ${
                                    activeCategory === cat
                                        ? "text-brand-accent font-medium"
                                        : "text-brand-muted hover:text-brand-accent"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                        <div className="pt-2 border-t border-brand-border">
                            <Link
                                href="/admin"
                                className="block px-4 py-2 text-sm text-brand-muted hover:text-brand-accent"
                                onClick={() => setMenuOpen(false)}
                            >
                                Admin
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}