import GalleryGrid from "@/components/GalleryGrid";

interface HomePageProps {
    searchParams: Promise<{ category?: string }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
    // Next.js 15+ requires awaiting searchParams
    const { category } = await searchParams;
    const activeCategory = category ?? "all";

    return <GalleryGrid category={activeCategory} />;
}