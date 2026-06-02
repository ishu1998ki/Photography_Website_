import { notFound } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { getMediaByProjectId, getRelatedMedia } from "@/lib/data";
import ProjectHero from "@/components/ProjectHero";
import RelatedMedia from "@/components/RelatedMedia";
import type { Metadata } from "next";

// ─── Static params (optional but good for build-time generation) ──────────────
export { generateStaticParams } from "./generateStaticParams";

// ─── Metadata ─────────────────────────────────────────────────────────────────
export async function generateMetadata({
                                           params,
                                       }: {
    params: Promise<{ projectId: string }>;
}): Promise<Metadata> {
    const { projectId } = await params;
    const item = getMediaByProjectId(projectId);
    if (!item) return { title: "Project Not Found" };
    return {
        title: `${item.title} — Lens&Co`,
        description: item.description,
    };
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function ProjectPage({
                                              params,
                                          }: {
    params: Promise<{ projectId: string }>;
}) {
    const { projectId } = await params;
    const item = getMediaByProjectId(projectId);

    if (!item) notFound();

    const related = getRelatedMedia(item.id, item.category);

    return (
        <article className="min-h-screen bg-brand-dark">

            {/* ── Hero ──────────────────────────────────────────────────── */}
            <ProjectHero item={item} />

            {/* ── Body ──────────────────────────────────────────────────── */}
            <div className="max-w-3xl mx-auto px-6 md:px-12 py-12">

                {/* Back button */}
                <Link
                    href={`/?category=${item.category}`}
                    className="inline-flex items-center gap-2 text-brand-muted
            hover:text-brand-accent text-sm transition-colors duration-200 mb-10 group"
                >
                    <svg
                        className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to {item.category}
                </Link>

                {/* Description */}
                <p className="text-brand-muted leading-relaxed text-base md:text-lg">
                    {item.description}
                </p>

                {/* Metadata grid */}
                <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-6
          border-t border-brand-border pt-8">
                    <div>
                        <p className="text-brand-muted text-xs uppercase tracking-widest mb-1">Category</p>
                        <p className="text-brand-accent text-sm capitalize">{item.category}</p>
                    </div>
                    <div>
                        <p className="text-brand-muted text-xs uppercase tracking-widest mb-1">Location</p>
                        <p className="text-brand-accent text-sm">{item.location}</p>
                    </div>
                    <div>
                        <p className="text-brand-muted text-xs uppercase tracking-widest mb-1">Year</p>
                        <p className="text-brand-accent text-sm">{item.year}</p>
                    </div>
                    <div>
                        <p className="text-brand-muted text-xs uppercase tracking-widest mb-1">Type</p>
                        <p className="text-brand-accent text-sm capitalize">{item.type}</p>
                    </div>
                </div>
            </div>

            {/* ── Related ────────────────────────────────────────────────── */}
            <RelatedMedia items={related} />
        </article>
    );
}