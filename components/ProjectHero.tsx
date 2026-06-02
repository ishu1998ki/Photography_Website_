"use client";

import Image from "next/image";
import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import type { MediaItem } from "@/lib/data";

interface ProjectHeroProps {
    item: MediaItem;
}

export default function ProjectHero({ item }: ProjectHeroProps) {
    const videoRef = useRef<HTMLVideoElement>(null);

    // Auto-play video on mount
    useEffect(() => {
        if (item.type === "video" && videoRef.current) {
            videoRef.current.play().catch(() => {});
        }
    }, [item.type]);

    return (
        <div className="relative w-full h-[60vh] md:h-[75vh] overflow-hidden bg-brand-card">

            {/* ── Media ─────────────────────────────────────────────────── */}
            {item.type === "image" ? (
                <motion.div
                    className="absolute inset-0"
                    initial={{ scale: 1.08 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
                >
                    <Image
                        src={item.src}
                        alt={item.title}
                        fill
                        sizes="100vw"
                        className="object-cover"
                        priority
                    />
                </motion.div>
            ) : (
                <motion.video
                    ref={videoRef}
                    src={item.src}
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                    initial={{ scale: 1.08 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
                />
            )}

            {/* ── Gradient overlay ──────────────────────────────────────── */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/30 to-transparent" />

            {/* ── Title block ───────────────────────────────────────────── */}
            <div className="absolute bottom-0 left-0 right-0 px-6 pb-8 md:px-12 md:pb-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
                >
                    {/* Category + year pill */}
                    <div className="flex items-center gap-2 mb-3">
            <span
                className="text-[10px] uppercase tracking-[0.2em] font-medium
                text-white/60 bg-white/10 backdrop-blur-sm
                px-3 py-1 rounded-full border border-white/10"
            >
              {item.category}
            </span>
                        <span className="text-white/40 text-xs">{item.year}</span>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                        {item.title}
                    </h1>

                    {/* Location */}
                    <p className="mt-2 text-white/50 text-sm flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827
                  0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                        </svg>
                        {item.location}
                    </p>
                </motion.div>
            </div>
        </div>
    );
}