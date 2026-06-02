"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { filterMedia, type MediaItem } from "@/lib/data";

// ─── Animation variants ───────────────────────────────────────────────────────

const gridVariants = {
    hidden: {},
    show: {
        transition: { staggerChildren: 0.07 },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 24, scale: 0.97 },
    show:   { opacity: 1, y: 0,  scale: 1,
        transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
    },
    exit:   { opacity: 0, scale: 0.95,
        transition: { duration: 0.2, ease: "easeIn" },
    },
};

// ─── Individual card ──────────────────────────────────────────────────────────

function MediaCard({ item }: { item: MediaItem }) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [videoReady, setVideoReady] = useState(false);

    const handleMouseEnter = () => {
        if (item.type === "video" && videoRef.current) {
            videoRef.current.play().catch(() => {});
        }
    };

    const handleMouseLeave = () => {
        if (item.type === "video" && videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    };

    return (
        <motion.div
            variants={cardVariants}
            className={`
        relative overflow-hidden rounded-xl bg-brand-card cursor-pointer group
        ${item.span === "tall" ? "row-span-2" : "row-span-1"}
      `}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <Link href={`/projects/${item.projectId}`} className="block w-full h-full">

                {/* ── Thumbnail image (always shown, fades when video plays) ── */}
                <Image
                    src={item.thumbnail}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className={`
            object-cover transition-all duration-700
            group-hover:scale-105
            ${item.type === "video" && videoReady ? "opacity-0" : "opacity-100"}
          `}
                    priority={item.id === "1"}
                />

                {/* ── Video element (hidden until hovered) ───────────────────── */}
                {item.type === "video" && (
                    <video
                        ref={videoRef}
                        src={item.src}
                        muted
                        loop
                        playsInline
                        onCanPlay={() => setVideoReady(true)}
                        className="absolute inset-0 w-full h-full object-cover
              opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    />
                )}

                {/* ── Dark gradient overlay ───────────────────────────────────── */}
                <div className="absolute inset-0 bg-gradient-to-t
          from-black/70 via-black/10 to-transparent
          opacity-0 group-hover:opacity-100
          transition-opacity duration-300" />

                {/* ── Video badge ─────────────────────────────────────────────── */}
                {item.type === "video" && (
                    <div className="absolute top-3 right-3 z-10
            flex items-center gap-1.5 bg-black/60 backdrop-blur-sm
            px-2.5 py-1 rounded-full">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-white text-xs font-medium tracking-wide">
              VIDEO
            </span>
                    </div>
                )}

                {/* ── Caption overlay (appears on hover) ─────────────────────── */}
                <div className="absolute bottom-0 left-0 right-0 p-4 z-10
          translate-y-3 group-hover:translate-y-0
          opacity-0 group-hover:opacity-100
          transition-all duration-300 ease-out">
                    <p className="text-white text-sm font-medium leading-snug">
                        {item.title}
                    </p>
                    <p className="text-white/60 text-xs mt-0.5 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {item.location}
                    </p>
                </div>

            </Link>
        </motion.div>
    );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ category }: { category: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="col-span-full flex flex-col items-center justify-center
        py-32 text-center"
        >
            <div className="w-16 h-16 rounded-full bg-brand-card border border-brand-border
        flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-brand-muted" fill="none"
                     stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586
            a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6
            a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
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

// ─── Main GalleryGrid component ───────────────────────────────────────────────

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
                        <span className="text-brand-accent ml-1">
              · {category}
            </span>
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