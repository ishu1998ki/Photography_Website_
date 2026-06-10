import type { ApiMedia } from './types';

// ─── Types ────────────────────────────────────────────────────────────────────

export type MediaType     = 'image' | 'video';
export type CategoryValue = 'portrait' | 'landscape' | 'architecture' | 'street' | 'video';

export interface MediaItem {
    id:          string;
    projectId:   string;
    type:        MediaType;
    category:    CategoryValue;
    src:         string;
    thumbnail:   string;
    title:       string;
    description: string;
    location:    string;
    year:        number;
    span:        'normal' | 'tall';
}

// ─── Normalizer: ApiMedia → MediaItem ─────────────────────────────────────────
// Maps the backend DB shape to the shape MediaCard already expects.
// All component code stays unchanged.

export function normalizeMedia(item: ApiMedia): MediaItem {
    return {
        id:          String(item.id),
        projectId:   String(item.project_id),
        type:        item.type,
        category:    item.category,
        src:         item.url,
        thumbnail:   item.thumbnail_url || item.url,
        title:       item.title        || 'Untitled',
        description: item.description  || '',
        location:    item.location     || '',
        year:        item.year         || new Date().getFullYear(),
        span:        item.span         || 'normal',
    };
}

// ─── Legacy helper (kept so nothing else breaks) ──────────────────────────────
export function filterMedia(items: MediaItem[], category: string): MediaItem[] {
    if (!category || category === 'all') return items;
    return items.filter((item) => item.category === category);
}