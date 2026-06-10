'use client';

import Link        from 'next/link';
import Image       from 'next/image';
import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence }                  from 'framer-motion';
import { getMedia }       from '@/lib/api';
import { normalizeMedia } from '@/lib/data';
import type { MediaItem, CategoryValue } from '@/lib/data';

// ─── Animation variants ───────────────────────────────────────────────────────

const gridVariants = {
    hidden: {},
    show:   { transition: { staggerChildren: 0.07 } },
};

const cardVariants = {
    hidden: { opacity: 0, y: 24, scale: 0.97 },
    show:   { opacity: 1, y: 0,  scale: 1,
        transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
    },
    exit:   { opacity: 0, scale: 0.95,
        transition: { duration: 0.2, ease: 'easeIn' },
    },
};

// ─── Skeleton card ────────────────────────────────────────────────────────────

function SkeletonCard({ tall }: { tall?: boolean }) {
    return (
        <div
            className={`relative overflow-hidden rounded-xl bg-brand-card animate-pulse
        ${tall ? 'row-span-2' : 'row-span-1'}`}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-border/40 to-brand-card" />
            {/* shimmer sweep */}
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite]
        bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        </div>
    );
}

const SKELETON_PATTERN = [false, true, false, false, false, true, false, false, false];

function GallerySkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
      gap-3 md:gap-4 [grid-auto-rows:280px]">
            {SKELETON_PATTERN.map((tall, i) => (
                <SkeletonCard key={i} tall={tall} />
            ))}
        </div>
    );
}

// ─── Error state ──────────────────────────────────────────────────────────────

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
    return (
        <div className="col-span-full flex flex-col items-center justify-center py-32 text-center">
            <div className="w-16 h-16 rounded-full bg-brand-card border border-red-900/40
        flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374
               1.948 3.374h14.71c1.73 0 2.813-1.874
               1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898
               0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
            </div>
            <p className="text-red-400 text-sm font-medium">Failed to load gallery</p>
            <p className="text-brand-muted text-xs mt-1 mb-4">{message}</p>
            <button
                onClick={onRetry}
                className="text-xs text-brand-accent border border-brand-accent/30
          hover:border-brand-accent px-4 py-2 rounded-md transition-colors"
            >
                Try again
            </button>
        </div>
    );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ category }: { category: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="col-span-full flex flex-col items-center justify-center py-32 text-center"
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

// ─── Individual card ──────────────────────────────────────────────────────────

function MediaCard({ item }: { item: MediaItem }) {
    const videoRef                    = useRef<HTMLVideoElement>(null);
    const [videoReady, setVideoReady] = useState(false);

    const handleMouseEnter = () => {
        if (item.type === 'video' && videoRef.current) {
            videoRef.current.play().catch(() => {});
        }
    };

    const handleMouseLeave = () => {
        if (item.type === 'video' && videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    };

    return (
        <motion.div
            variants={cardVariants}
            className={`relative overflow-hidden rounded-xl bg-brand-card cursor-pointer group
        ${item.span === 'tall' ? 'row-span-2' : 'row-span-1'}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <Link href={`/projects/${item.projectId}`} className="block w-full h-full">

                {/* Thumbnail */}
                <Image
                    src={item.thumbnail}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className={`object-cover transition-all duration-700 group-hover:scale-105
            ${item.type === 'video' && videoReady ? 'opacity-0' : 'opacity-100'}`}
                />

                {/* Video overlay */}
                {item.type === 'video' && (
                    <video
                        ref={videoRef}
                        src={item.src}
                        muted
                        loop
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover"
                        onCanPlay={() => setVideoReady(true)}
                    />
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent
          opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Video badge */}
                {item.type === 'video' && (
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm
            rounded-full px-2.5 py-1 flex items-center gap-1.5
            opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-white text-xs font-medium">VIDEO</span>
                    </div>
                )}

                {/* Info overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4
          translate-y-2 opacity-0 group-hover:translate-y-0
          group-hover:opacity-100 transition-all duration-300">
                    <p className="text-white font-semibold text-sm truncate">{item.title}</p>
                    {item.location && (
                        <p className="text-white/60 text-xs mt-0.5 truncate">{item.location}</p>
                    )}
                </div>

            </Link>
        </motion.div>
    );
}

// ─── Main GalleryGrid component ───────────────────────────────────────────────

interface GalleryGridProps {
    category: string;
}

export default function GalleryGrid({ category }: GalleryGridProps) {
    const [items,   setItems]   = useState<MediaItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error,   setError]   = useState<string | null>(null);

    const fetchMedia = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await getMedia({
                category: category !== 'all'
                    ? (category as CategoryValue)
                    : undefined,
            });
            setItems(res.data.map(normalizeMedia));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
        } finally {
            setLoading(false);
        }
    }, [category]);

    useEffect(() => {
        fetchMedia();
    }, [fetchMedia]);

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

            {/* ── Result count ───────────────────────────────────────────────────── */}
            <div className="flex items-center justify-between mb-6">
                <p className="text-brand-muted text-xs tracking-widest uppercase">
                    {loading ? (
                        <span className="inline-block w-24 h-3 bg-brand-border/60 rounded animate-pulse" />
                    ) : (
                        <>
                            {items.length} {items.length === 1 ? 'work' : 'works'}
                            {category !== 'all' && (
                                <span className="text-brand-accent ml-1">· {category}</span>
                            )}
                        </>
                    )}
                </p>
            </div>

            {/* ── States ─────────────────────────────────────────────────────────── */}
            {loading ? (
                <GallerySkeleton />
            ) : error ? (
                <div className="grid">
                    <ErrorState message={error} onRetry={fetchMedia} />
                </div>
            ) : (
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
                gap-3 md:gap-4 [grid-auto-rows:280px]"
                        >
                            {items.map((item) => (
                                <MediaCard key={item.id} item={item} />
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            )}

        </section>
    );
}