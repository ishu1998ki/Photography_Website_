// ─── Types ───────────────────────────────────────────────────────────────────

export type MediaType     = "image" | "video";
export type CategoryValue = "portrait" | "landscape" | "architecture" | "street" | "video";

export interface MediaItem {
    id:          string;
    projectId:   string;
    type:        MediaType;
    category:    CategoryValue;
    src:         string;       // full image/video URL
    thumbnail:   string;       // always a still image
    title:       string;
    description: string;
    location:    string;
    year:        number;
    span:        "normal" | "tall"; // tall = row-span-2 in grid
}

// ─── Static Data ─────────────────────────────────────────────────────────────

export const MEDIA_ITEMS: MediaItem[] = [
    // ── Portraits ──────────────────────────────────────────────────────────────
    {
        id: "1",
        projectId: "proj-portrait-1",
        type: "image",
        category: "portrait",
        src: "https://picsum.photos/seed/face10/800/1100",
        thumbnail: "https://picsum.photos/seed/face10/800/1100",
        title: "Golden Hour",
        description: "A portrait captured during the warmth of golden hour. Natural light shapes the contours of the face with extraordinary softness.",
        location: "Colombo, Sri Lanka",
        year: 2024,
        span: "tall",
    },
    {
        id: "2",
        projectId: "proj-portrait-2",
        type: "image",
        category: "portrait",
        src: "https://picsum.photos/seed/face22/800/1000",
        thumbnail: "https://picsum.photos/seed/face22/800/1000",
        title: "Quiet Reflection",
        description: "Stillness captured in a single frame. The subject's gaze tells a story beyond words.",
        location: "Galle, Sri Lanka",
        year: 2024,
        span: "normal",
    },
    {
        id: "3",
        projectId: "proj-portrait-3",
        type: "image",
        category: "portrait",
        src: "https://picsum.photos/seed/face35/900/1200",
        thumbnail: "https://picsum.photos/seed/face35/900/1200",
        title: "Depth of Character",
        description: "A study of light and shadow across the human form.",
        location: "Kandy, Sri Lanka",
        year: 2023,
        span: "normal",
    },

    // ── Landscape ──────────────────────────────────────────────────────────────
    {
        id: "4",
        projectId: "proj-landscape-1",
        type: "image",
        category: "landscape",
        src: "https://picsum.photos/seed/mount1/1200/800",
        thumbnail: "https://picsum.photos/seed/mount1/1200/800",
        title: "Misty Peaks",
        description: "Rolling hills wrapped in morning fog, revealing layers of depth and solitude.",
        location: "Ella, Sri Lanka",
        year: 2024,
        span: "normal",
    },
    {
        id: "5",
        projectId: "proj-landscape-2",
        type: "image",
        category: "landscape",
        src: "https://picsum.photos/seed/nature55/1200/900",
        thumbnail: "https://picsum.photos/seed/nature55/1200/900",
        title: "Still Waters",
        description: "A glassy lake mirrors the sky in perfect symmetry.",
        location: "Nuwara Eliya, Sri Lanka",
        year: 2024,
        span: "tall",
    },
    {
        id: "6",
        projectId: "proj-landscape-3",
        type: "image",
        category: "landscape",
        src: "https://picsum.photos/seed/beach77/1400/900",
        thumbnail: "https://picsum.photos/seed/beach77/1400/900",
        title: "Horizon Line",
        description: "Where the ocean meets the sky in an endless expanse of blue.",
        location: "Mirissa, Sri Lanka",
        year: 2023,
        span: "normal",
    },

    // ── Architecture ───────────────────────────────────────────────────────────
    {
        id: "7",
        projectId: "proj-arch-1",
        type: "image",
        category: "architecture",
        src: "https://picsum.photos/seed/building10/900/1200",
        thumbnail: "https://picsum.photos/seed/building10/900/1200",
        title: "Glass & Steel",
        description: "Modern architecture distilled to its purest geometric forms.",
        location: "Colombo, Sri Lanka",
        year: 2024,
        span: "tall",
    },
    {
        id: "8",
        projectId: "proj-arch-2",
        type: "image",
        category: "architecture",
        src: "https://picsum.photos/seed/interior20/1200/800",
        thumbnail: "https://picsum.photos/seed/interior20/1200/800",
        title: "Open Space",
        description: "Light floods a minimalist interior, casting long shadows across polished floors.",
        location: "Singapore",
        year: 2023,
        span: "normal",
    },

    // ── Street ─────────────────────────────────────────────────────────────────
    {
        id: "9",
        projectId: "proj-street-1",
        type: "image",
        category: "street",
        src: "https://picsum.photos/seed/street11/900/1100",
        thumbnail: "https://picsum.photos/seed/street11/900/1100",
        title: "City Pulse",
        description: "The relentless rhythm of urban life compressed into a single decisive moment.",
        location: "Colombo Fort, Sri Lanka",
        year: 2024,
        span: "tall",
    },
    {
        id: "10",
        projectId: "proj-street-2",
        type: "image",
        category: "street",
        src: "https://picsum.photos/seed/urban44/1100/800",
        thumbnail: "https://picsum.photos/seed/urban44/1100/800",
        title: "After Rain",
        description: "Wet cobblestones reflect neon light in an empty alley at dusk.",
        location: "Pettah, Sri Lanka",
        year: 2023,
        span: "normal",
    },

    // ── Video ──────────────────────────────────────────────────────────────────
    {
        id: "11",
        projectId: "proj-video-1",
        type: "video",
        category: "video",
        src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        thumbnail: "https://picsum.photos/seed/fire99/1200/800",
        title: "Ember",
        description: "A short film about the fleeting beauty of light and movement.",
        location: "Unawatuna, Sri Lanka",
        year: 2024,
        span: "normal",
    },
    {
        id: "12",
        projectId: "proj-video-2",
        type: "video",
        category: "video",
        src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        thumbnail: "https://picsum.photos/seed/ocean88/1200/900",
        title: "Drift",
        description: "Time-lapse waves and shifting skies, a meditation on impermanence.",
        location: "Trincomalee, Sri Lanka",
        year: 2024,
        span: "tall",
    },
];

// ─── Helper: filter by category ──────────────────────────────────────────────
export function filterMedia(category: string): MediaItem[] {
    if (!category || category === "all") return MEDIA_ITEMS;
    return MEDIA_ITEMS.filter((item) => item.category === category);
}

// ─── Helper: get single item by projectId ─────────────────────────────────────
export function getMediaByProjectId(projectId: string): MediaItem | undefined {
    return MEDIA_ITEMS.find((item) => item.projectId === projectId);
}

// ─── Helper: get related items (same category, excluding current) ─────────────
export function getRelatedMedia(
    currentId: string,
    category: CategoryValue
): MediaItem[] {
    return MEDIA_ITEMS.filter(
        (item) => item.category === category && item.id !== currentId
    ).slice(0, 6);
}