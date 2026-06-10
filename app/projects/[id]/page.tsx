'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter }        from 'next/navigation';
import Image                           from 'next/image';
import Link                            from 'next/link';
import { motion, AnimatePresence }     from 'framer-motion';
import { getProject }                  from '@/lib/api';
import type { ApiProject, ApiMedia }   from '@/lib/types';

// ─── Animation variants ───────────────────────────────────────────────────────

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
};

const stagger = {
    hidden: {},
    show:   { transition: { staggerChildren: 0.08 } },
};

// ─── Loading Skeleton ─────────────────────────────────────────────────────────

function ProjectSkeleton() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-pulse">
            {/* Back button */}
            <div className="w-24 h-4 bg-brand-border rounded mb-10" />

            {/* Hero */}
            <div className="w-full aspect-[16/8] rounded-2xl bg-brand-card mb-10" />

            {/* Title block */}
            <div className="max-w-2xl mb-12 space-y-3">
                <div className="w-16 h-3 bg-brand-border rounded" />
                <div className="w-64 h-8 bg-brand-border rounded" />
                <div className="w-full h-4 bg-brand-border/60 rounded" />
                <div className="w-3/4 h-4 bg-brand-border/60 rounded" />
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="aspect-square rounded-xl bg-brand-card" />
                ))}
            </div>
        </div>
    );
}

// ─── Not Found ────────────────────────────────────────────────────────────────

function NotFound() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
            <div className="w-16 h-16 rounded-full bg-brand-card border border-brand-border
        flex items-center justify-center mx-auto mb-6">
                <svg className="w-7 h-7 text-brand-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21
               12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <p className="text-brand-accent font-semibold text-lg mb-2">Project not found</p>
            <p className="text-brand-muted text-sm mb-8">
                This project may have been removed or the link is incorrect.
            </p>
            <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm text-brand-accent
          border border-brand-border hover:border-brand-accent/40
          px-5 py-2.5 rounded-lg transition-colors"
            >
                ← Back to gallery
            </Link>
        </div>
    );
}

// ─── Hero Media ───────────────────────────────────────────────────────────────

function HeroMedia({ item }: { item: ApiMedia }) {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (item.type === 'video' && videoRef.current) {
            videoRef.current.play().catch(() => {});
        }
    }, [item.type]);

    return (
        <div className="relative w-full aspect-[16/8] rounded-2xl overflow-hidden bg-brand-card mb-10">
            {item.type === 'video' ? (
                <video
                    ref={videoRef}
                    src={item.url}
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                />
            ) : (
                <Image
                    src={item.url}
                    alt={item.title}
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover"
                />
            )}
            {/* Subtle bottom gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

            {/* Hero label */}
            <div className="absolute bottom-6 left-6">
        <span className="text-white/50 text-xs uppercase tracking-widest">
          {item.type === 'video' ? '▶ Video' : '◆ Featured'}
        </span>
            </div>
        </div>
    );
}

// ─── Media Grid Item ──────────────────────────────────────────────────────────

function GridItem({ item, onClick }: { item: ApiMedia; onClick: () => void }) {
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
            variants={fadeUp}
            onClick={onClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="relative aspect-square rounded-xl overflow-hidden bg-brand-card
        cursor-pointer group"
        >
            <Image
                src={item.thumbnail_url || item.url}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className={`object-cover transition-all duration-500 group-hover:scale-105
          ${item.type === 'video' && videoReady ? 'opacity-0' : 'opacity-100'}`}
            />

            {item.type === 'video' && (
                <video
                    ref={videoRef}
                    src={item.url}
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                    onCanPlay={() => setVideoReady(true)}
                />
            )}

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10
        to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Video badge */}
            {item.type === 'video' && (
                <div className="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur-sm
          rounded-full px-2 py-0.5 flex items-center gap-1
          opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-white text-[10px] font-medium">VIDEO</span>
                </div>
            )}

            {/* Info */}
            <div className="absolute bottom-0 left-0 right-0 p-3
        translate-y-2 opacity-0 group-hover:translate-y-0
        group-hover:opacity-100 transition-all duration-300">
                <p className="text-white text-xs font-semibold truncate">{item.title}</p>
                {item.location && (
                    <p className="text-white/50 text-[10px] mt-0.5 truncate">{item.location}</p>
                )}
            </div>
        </motion.div>
    );
}

// ─── Lightbox ────────────────────────────────────────────────────────────────

function Lightbox({ item, onClose }: { item: ApiMedia; onClose: () => void }) {
    // Close on Escape key
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onClose]);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm
          flex items-center justify-center p-4 cursor-zoom-out"
            >
                <motion.div
                    initial={{ scale: 0.92, opacity: 0 }}
                    animate={{ scale: 1,    opacity: 1 }}
                    exit={{    scale: 0.92, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative max-w-5xl w-full max-h-[90vh] rounded-2xl overflow-hidden
            bg-brand-card cursor-default"
                >
                    {item.type === 'video' ? (
                        <video
                            src={item.url}
                            controls
                            autoPlay
                            className="w-full max-h-[90vh] object-contain"
                        />
                    ) : (
                        <div className="relative w-full" style={{ aspectRatio: '16/10' }}>
                            <Image
                                src={item.url}
                                alt={item.title}
                                fill
                                className="object-contain"
                                sizes="90vw"
                            />
                        </div>
                    )}

                    {/* Caption bar */}
                    <div className="absolute bottom-0 left-0 right-0 px-6 py-4
            bg-gradient-to-t from-black/80 to-transparent">
                        <p className="text-white font-semibold text-sm">{item.title}</p>
                        <div className="flex items-center gap-3 mt-1">
                            {item.location && (
                                <span className="text-white/50 text-xs">{item.location}</span>
                            )}
                            {item.year && (
                                <span className="text-white/30 text-xs">{item.year}</span>
                            )}
                        </div>
                    </div>

                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-9 h-9 rounded-full
              bg-black/60 backdrop-blur-sm flex items-center justify-center
              text-white/70 hover:text-white transition-colors"
                        aria-label="Close"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ProjectPage() {
    const params  = useParams();
    const router  = useRouter();
    const id      = params?.id as string;

    const [project,       setProject]       = useState<ApiProject | null>(null);
    const [loading,       setLoading]       = useState(true);
    const [notFound,      setNotFound]      = useState(false);
    const [lightboxItem,  setLightboxItem]  = useState<ApiMedia | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchProject = async () => {
            setLoading(true);
            try {
                const res = await getProject(id);
                setProject(res.data);
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : '';
                if (message.includes('404') || message.includes('not found')) {
                    setNotFound(true);
                } else {
                    setNotFound(true); // show not-found for any error
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [id]);

    if (loading)  return <div className="pt-16"><ProjectSkeleton /></div>;
    if (notFound) return <div className="pt-16"><NotFound /></div>;
    if (!project) return null;

    const hero       = project.media?.[0];
    const gridItems  = project.media?.slice(1) ?? [];
    const allMedia   = project.media ?? [];

    return (
        <>
            {/* Lightbox */}
            {lightboxItem && (
                <Lightbox item={lightboxItem} onClose={() => setLightboxItem(null)} />
            )}

            <motion.div
                variants={stagger}
                initial="hidden"
                animate="show"
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
            >

                {/* ── Back button ──────────────────────────────────────────────────── */}
                <motion.div variants={fadeUp} className="mb-10">
                    <button
                        onClick={() => router.back()}
                        className="inline-flex items-center gap-2 text-sm text-brand-muted
              hover:text-brand-accent transition-colors group"
                    >
                        <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1"
                             fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                                  d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>
                        Back
                    </button>
                </motion.div>

                {/* ── Hero media ───────────────────────────────────────────────────── */}
                {hero && (
                    <motion.div
                        variants={fadeUp}
                        className="cursor-zoom-in"
                        onClick={() => setLightboxItem(hero)}
                    >
                        <HeroMedia item={hero} />
                    </motion.div>
                )}

                {/* ── Project info ─────────────────────────────────────────────────── */}
                <motion.div variants={fadeUp} className="max-w-2xl mb-12">
                    {project.category && (
                        <p className="text-brand-muted text-xs uppercase tracking-widest mb-2">
                            {project.category}
                        </p>
                    )}
                    <h1 className="text-3xl sm:text-4xl font-semibold text-brand-accent mb-4">
                        {project.title}
                    </h1>
                    {project.description && (
                        <p className="text-brand-muted text-sm leading-relaxed">
                            {project.description}
                        </p>
                    )}

                    {/* Stats row */}
                    <div className="flex items-center gap-6 mt-6 pt-6 border-t border-brand-border">
                        <div>
                            <p className="text-brand-muted text-[10px] uppercase tracking-widest">Works</p>
                            <p className="text-brand-accent text-lg font-semibold mt-0.5">
                                {allMedia.length}
                            </p>
                        </div>
                        {allMedia[0]?.year && (
                            <div>
                                <p className="text-brand-muted text-[10px] uppercase tracking-widest">Year</p>
                                <p className="text-brand-accent text-lg font-semibold mt-0.5">
                                    {allMedia[0].year}
                                </p>
                            </div>
                        )}
                        {allMedia[0]?.location && (
                            <div>
                                <p className="text-brand-muted text-[10px] uppercase tracking-widest">Location</p>
                                <p className="text-brand-accent text-lg font-semibold mt-0.5 truncate max-w-[180px]">
                                    {allMedia[0].location}
                                </p>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* ── Media grid ───────────────────────────────────────────────────── */}
                {gridItems.length > 0 && (
                    <motion.div variants={stagger}>
                        <motion.p
                            variants={fadeUp}
                            className="text-brand-muted text-xs uppercase tracking-widest mb-5"
                        >
                            All works · {allMedia.length}
                        </motion.p>
                        <motion.div
                            variants={stagger}
                            className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4"
                        >
                            {gridItems.map((item) => (
                                <GridItem
                                    key={item.id}
                                    item={item}
                                    onClick={() => setLightboxItem(item)}
                                />
                            ))}
                        </motion.div>
                    </motion.div>
                )}

            </motion.div>
        </>
    );
}