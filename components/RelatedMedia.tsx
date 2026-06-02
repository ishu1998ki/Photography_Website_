"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { MediaItem } from "@/lib/data";

interface RelatedMediaProps {
    items: MediaItem[];
}

export default function RelatedMedia({ items }: RelatedMediaProps) {
    if (items.length === 0) return null;

    return (
        <section className="mt-16 mb-12">
            <h2 className="text-brand-muted text-xs uppercase tracking-widest mb-5 px-6 md:px-12">
                More in this series
            </h2>

            {/* Horizontal scroll strip */}
            <div className="flex gap-3 overflow-x-auto px-6 md:px-12 pb-4 scrollbar-hide">
                {items.map((item, i) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * i, duration: 0.4 }}
                        className="shrink-0"
                    >
                        <Link
                            href={`/projects/${item.projectId}`}
                            className="block w-44 h-32 md:w-56 md:h-40 relative overflow-hidden
                rounded-lg bg-brand-card group"
                            aria-label={item.title}
                        >
                            <Image
                                src={item.thumbnail}
                                alt={item.title}
                                fill
                                sizes="224px"
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />

                            {/* Video indicator */}
                            {item.type === "video" && (
                                <div className="absolute top-2 right-2 w-6 h-6 rounded-full
                  bg-black/60 flex items-center justify-center">
                                    <svg className="w-3 h-3 text-white translate-x-px" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                </div>
                            )}

                            {/* Hover caption */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent
                opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <p className="absolute bottom-2 left-2 right-2 text-white text-xs font-medium
                line-clamp-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                {item.title}
                            </p>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}