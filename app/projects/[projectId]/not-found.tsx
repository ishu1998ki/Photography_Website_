import Link from "next/link";

export default function ProjectNotFound() {
    return (
        <div className="min-h-screen bg-brand-dark flex flex-col items-center
      justify-center text-center px-6">
            <p className="text-brand-muted text-xs uppercase tracking-widest mb-3">
                404
            </p>
            <h1 className="text-2xl font-bold text-brand-accent mb-3">
                Project not found
            </h1>
            <p className="text-brand-muted text-sm mb-8 max-w-sm">
                This project may have been removed or the link is incorrect.
            </p>
            <Link
                href="/"
                className="text-sm text-brand-accent border border-brand-border
          hover:border-brand-accent/40 px-5 py-2 rounded-md
          transition-colors duration-200"
            >
                ← Back to gallery
            </Link>
        </div>
    );
}