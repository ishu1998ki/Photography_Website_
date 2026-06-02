"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import type { MediaItem } from "@/lib/data";

// ─── Animation variants ───────────────────────────────────────────────────────

export const cardVariants = {
    hidden: { opacity: 0, y: 24, scale: 0.97 },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const },
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        transition: { duration: 0.2, ease: "easeIn" as const },
    },
};

// ─── Video Play Button Overlay ────────────────────────────────────────────────

function PlayButton() {
    return (
        <div
            className="absolute inset-0 flex items-center justify-center z-10
        opacity-100 group-hover:opacity-0 transition-opacity duration-300
        pointer-events-none"
        >
            <div
                className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm
          border border-white/20 flex items-center justify-center"
            >
                <svg
                    className="w-5 h-5 text-white translate-x-0.5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path d="M8 5v14l11-7z" />
                </svg>
            </div>
        </div>
    );
}

// ─── Category Badge ───────────────────────────────────────────────────────────

function VideoBadge() {
    return (
        <div
            className="absolute top-3 right-3 z-20
        flex items-center gap-1.5 bg-black/60 backdrop-blur-sm
        px-2.5 py-1 rounded-full"
        >
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-white text-xs font-medium tracking-wide">
        VIDEO
      </span>
        </div>
    );
}

// ─── Caption Overlay ──────────────────────────────────────────────────────────

function CaptionOverlay({ item }: { item: MediaItem }) {
    return (
        <div
            className="absolute bottom-0 left-0 right-0 p-4 z-10
        translate-y-3 group-hover:translate-y-0
        opacity-0 group-hover:opacity-100
        transition-all duration-300 ease-out"
        >
            <p className="text-white text-sm font-semibold leading-snug line-clamp-1">
                {item.title}
            </p>
            <div className="flex items-center justify-between mt-1">
                <p className="text-white/60 text-xs flex items-center gap-1 line-clamp-1">
                    <svg
                        className="w-3 h-3 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
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
                <span className="text-white/40 text-xs shrink-0 ml-2">{item.year}</span>
            </div>
        </div>
    );
}

// ─── MediaCard ────────────────────────────────────────────────────────────────

interface MediaCardProps {
    item: MediaItem;
}

export default function MediaCard({ item }: MediaCardProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [videoReady, setVideoReady] = useState(false);
    const [isTouched, setIsTouched] = useState(false);

    const playVideo = useCallback(() => {
        if (item.type === "video" && videoRef.current) {
            videoRef.current.play().catch(() => {});
        }
    }, [item.type]);

    const pauseVideo = useCallback(() => {
        if (item.type === "video" && videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    }, [item.type]);

    // Mobile: toggle on tap (first tap plays, second tap navigates)
    const handleTouchStart = useCallback(() => {
        if (item.type === "video") {
            if (!isTouched) {
                setIsTouched(true);
                playVideo();
            }
        }
    }, [item.type, isTouched, playVideo]);

    return (
        <motion.div
            variants={cardVariants}
            className={`
        relative overflow-hidden rounded-xl bg-brand-card cursor-pointer group
        ${item.span === "tall" ? "row-span-2" : "row-span-1"}
      `}
            onMouseEnter={playVideo}
            onMouseLeave={() => {
                pauseVideo();
                setIsTouched(false);
            }}
            onTouchStart={handleTouchStart}
        >
            <Link
                href={`/projects/${item.projectId}`}
                className="block w-full h-full"
                aria-label={`View project: ${item.title}`}
            >
                {/* ── Thumbnail (always visible, fades when video is active) ── */}
                <Image
                    src={item.thumbnail}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className={`
            object-cover transition-all duration-700
            group-hover:scale-105
            ${item.type === "video" && videoReady ? "opacity-0" : "opacity-100"}
          `}
                    priority={item.id === "1"}
                />

                {/* ── Video element ────────────────────────────────────────── */}
                {item.type === "video" && (
                    <video
                        ref={videoRef}
                        src={item.src}
                        muted
                        loop
                        playsInline
                        preload="none"
                        onCanPlay={() => setVideoReady(true)}
                        className="absolute inset-0 w-full h-full object-cover
              opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    />
                )}

                {/* ── Dark gradient overlay ─────────────────────────────────── */}
                <div
                    className="absolute inset-0 bg-gradient-to-t
            from-black/70 via-black/10 to-transparent
            opacity-0 group-hover:opacity-100
            transition-opacity duration-300"
                />

                {/* ── Top-left: category pill ───────────────────────────────── */}
                <div
                    className="absolute top-3 left-3 z-20
            opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
          <span
              className="text-[10px] uppercase tracking-widest font-medium
              text-white/70 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full
              border border-white/10"
          >
            {item.category}
          </span>
                </div>

                {/* ── Video badge (top-right) ───────────────────────────────── */}
                {item.type === "video" && <VideoBadge />}

                {/* ── Play button (centered, visible before hover on video) ─── */}
                {item.type === "video" && <PlayButton />}

                {/* ── Caption (bottom, appears on hover) ───────────────────── */}
                <CaptionOverlay item={item} />
            </Link>
        </motion.div>
    );
}