"use client";

import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Category config (single source of truth, Gallery will import this too) ───
export const CATEGORIES = [
    { label: "All",          value: "all" },
    { label: "Portrait",     value: "portrait" },
    { label: "Landscape",    value: "landscape" },
    { label: "Architecture", value: "architecture" },
    { label: "Street",       value: "street" },
    { label: "Video",        value: "video" },
];

export default function Navbar() {
    const router       = useRouter();
    const pathname     = usePathname();
    const searchParams = useSearchParams();

    const activeCategory = searchParams.get("category") ?? "all";
    const [menuOpen,    setMenuOpen]    = useState(false);
    const [scrolled,    setScrolled]    = useState(false);

    // ── Scroll shadow effect ─────────────────────────────────────────────────
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // ── Close mobile menu on route change ───────────────────────────────────
    useEffect(() => {
        setMenuOpen(false);
    }, [pathname, searchParams]);

    // ── Update URL with selected category ───────────────────────────────────
    const selectCategory = useCallback(
        (value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value === "all") {
                params.delete("category");
            } else {
                params.set("category", value);
            }
            // Navigate to homepage with new filter
            router.push(`/?${params.toString()}`);
            setMenuOpen(false);
        },
        [router, searchParams]
    );

    // ── Only show category nav on homepage ──────────────────────────────────
    const showCategories = pathname === "/";

    return (
        <header
            className={`
        fixed top-0 left-0 right-0 z-50
        transition-all duration-300
        bg-brand-dark/90 backdrop-blur-md
        ${scrolled ? "border-b border-brand-border shadow-[0_4px_24px_rgba(0,0,0,0.4)]" : "border-b border-transparent"}
      `}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* ── Logo ───────────────────────────────────────────────────── */}
                    <Link
                        href="/"
                        className="flex items-center gap-2 group shrink-0"
                        aria-label="Go to homepage"
                    >
                        {/* Dot accent */}
                        <span className="w-2 h-2 rounded-full bg-brand-accent
              group-hover:scale-125 transition-transform duration-200" />
                        <span className="text-brand-accent font-semibold text-base
              tracking-[0.2em] uppercase select-none">
              Lens&amp;Co
            </span>
                    </Link>

                    {/* ── Desktop Category Pills ──────────────────────────────────── */}
                    {showCategories && (
                        <nav
                            className="hidden md:flex items-center gap-1"
                            aria-label="Filter by category"
                        >
                            {CATEGORIES.map((cat) => {
                                const isActive = activeCategory === cat.value;
                                return (
                                    <button
                                        key={cat.value}
                                        onClick={() => selectCategory(cat.value)}
                                        className="relative px-4 py-1.5 rounded-full text-sm font-medium
                      transition-colors duration-200 outline-none
                      focus-visible:ring-2 focus-visible:ring-brand-accent
                      focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark"
                                        aria-pressed={isActive}
                                    >
                                        {/* Animated pill background */}
                                        {isActive && (
                                            <motion.span
                                                layoutId="activePill"
                                                className="absolute inset-0 rounded-full bg-brand-accent"
                                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                            />
                                        )}
                                        <span
                                            className={`relative z-10 transition-colors duration-200 ${
                                                isActive ? "text-brand-dark" : "text-brand-muted hover:text-brand-accent"
                                            }`}
                                        >
                      {cat.label}
                    </span>
                                    </button>
                                );
                            })}
                        </nav>
                    )}

                    {/* ── Right side: Admin link + Mobile Hamburger ───────────────── */}
                    <div className="flex items-center gap-3">
                        {/* Admin button (desktop) */}
                        <Link
                            href="/admin"
                            className="hidden md:inline-flex items-center gap-1.5 text-sm
                text-brand-muted hover:text-brand-accent transition-colors duration-200
                border border-brand-border hover:border-brand-accent/40
                px-3 py-1.5 rounded-md"
                        >
                            {/* Lock icon */}
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                                      d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5
                  a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75
                  a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                            </svg>
                            Admin
                        </Link>

                        {/* Hamburger (mobile) */}
                        <button
                            className="md:hidden w-9 h-9 flex items-center justify-center
                text-brand-muted hover:text-brand-accent rounded-md
                hover:bg-brand-border/40 transition-colors duration-200"
                            onClick={() => setMenuOpen((o) => !o)}
                            aria-label={menuOpen ? "Close menu" : "Open menu"}
                            aria-expanded={menuOpen}
                        >
                            <motion.svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                animate={menuOpen ? "open" : "closed"}
                            >
                                <motion.path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.8}
                                    variants={{
                                        closed: { d: "M4 6h16M4 12h16M4 18h16" },
                                        open:   { d: "M6 18L18 6M6 6l12 12" },
                                    }}
                                    transition={{ duration: 0.2 }}
                                />
                            </motion.svg>
                        </button>
                    </div>
                </div>

                {/* ── Mobile Dropdown Menu ─────────────────────────────────────── */}
                <AnimatePresence>
                    {menuOpen && (
                        <motion.div
                            key="mobile-menu"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{   opacity: 0, height: 0 }}
                            transition={{ duration: 0.25, ease: "easeInOut" }}
                            className="md:hidden overflow-hidden"
                        >
                            <div className="border-t border-brand-border py-3 space-y-0.5">
                                {/* Category buttons (only on homepage) */}
                                {showCategories && CATEGORIES.map((cat) => {
                                    const isActive = activeCategory === cat.value;
                                    return (
                                        <button
                                            key={cat.value}
                                            onClick={() => selectCategory(cat.value)}
                                            className={`flex w-full items-center gap-3 px-4 py-2.5 text-sm
                        rounded-md transition-colors duration-150
                        ${isActive
                                                ? "text-brand-accent bg-brand-border/40 font-medium"
                                                : "text-brand-muted hover:text-brand-accent hover:bg-brand-border/20"
                                            }`}
                                        >
                                            {isActive && (
                                                <span className="w-1.5 h-1.5 rounded-full bg-brand-accent shrink-0" />
                                            )}
                                            {!isActive && (
                                                <span className="w-1.5 h-1.5 rounded-full shrink-0" />
                                            )}
                                            {cat.label}
                                        </button>
                                    );
                                })}

                                {/* Divider + Admin link */}
                                <div className="pt-2 mt-1 border-t border-brand-border">
                                    <Link
                                        href="/admin"
                                        className="flex w-full items-center gap-3 px-4 py-2.5
                      text-sm text-brand-muted hover:text-brand-accent
                      hover:bg-brand-border/20 rounded-md transition-colors"
                                    >
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                                                  d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5
                        a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75
                        a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                        </svg>
                                        Admin Panel
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </header>
    );
}