"use client";

import { motion, AnimatePresence } from "framer-motion";
import { filterMedia } from "@/lib/data";
import MediaCard, { cardVariants } from "@/components/MediaCard";

// ─── Grid animation ───────────────────────────────────────────────────────────

const gridVariants = {
    hidden: {},
    show: {
        transition: { staggerChildren: 0.07 },
    },
};

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ category }: { category: string }) {
    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="show"
            className="col-span-full flex flex-col items-center justify-center
        py-32 text-center"
        >
            <div
                className="w-16 h-16 rounded-full bg-brand-card border border-brand-border
          flex items-center justify-center mb-4"
            >
                <svg
                    className="w-7 h-7 text-brand-muted"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586
              a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6
              a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                </svg>
            </div>
            <p className="text-brand-accent text-sm font-medium">
                No media in &ldquo;{category}&rdquo;
            </p>
            <p className="text-brand-muted text-xs mt-1">
                Check back soon or browse another category.
            </p>
        </motion.div>
    );
}

// ─── GalleryGrid ──────────────────────────────────────────────────────────────

interface GalleryGridProps {
    category: string;
}

export default function GalleryGrid({ category }: GalleryGridProps) {
    const items = filterMedia(category);

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

            {/* ── Result count ─────────────────────────────────────────────── */}
            <div className="flex items-center justify-between mb-6">
                <p className="text-brand-muted text-xs tracking-widest uppercase">
                    {items.length} {items.length === 1 ? "work" : "works"}
                    {category !== "all" && (
                        <span className="text-brand-accent ml-1">· {category}</span>
                    )}
                </p>
            </div>

            {/* ── Grid ─────────────────────────────────────────────────────── */}
            <AnimatePresence mode="popLayout">
                {items.length === 0 ? (
                    <EmptyState key="empty" category={category} />
                ) : (
                    <motion.div
                        key={category}
                        variants={gridVariants}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
              gap-3 md:gap-4
              [grid-auto-rows:280px]"
                    >
                        {items.map((item) => (
                            <MediaCard key={item.id} item={item} />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

        </section>
    );
}