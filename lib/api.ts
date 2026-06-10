import type {
    MediaApiResponse,
    ProjectApiResponse,
    ProjectsApiResponse,
    CategoryValue,
    ApiMedia,
} from './types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// ─── Generic fetch wrapper ────────────────────────────────────────────────────

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || `API error: ${res.status}`);
    }

    return res.json();
}

// ─── Media API ────────────────────────────────────────────────────────────────

export interface GetMediaParams {
    category?: CategoryValue | 'all';
    type?:     'image' | 'video';
    page?:     number;
    limit?:    number;
}

export async function getMedia(params: GetMediaParams = {}): Promise<MediaApiResponse> {
    const query = new URLSearchParams();
    if (params.category && params.category !== 'all') query.set('category', params.category);
    if (params.type)     query.set('type',     params.type);
    if (params.page)     query.set('page',     String(params.page));
    if (params.limit)    query.set('limit',    String(params.limit));

    const qs = query.toString();
    return apiFetch<MediaApiResponse>(`/media${qs ? `?${qs}` : ''}`);
}

export async function getMediaItem(id: number | string): Promise<ApiMedia> {
    const res = await apiFetch<{ success: boolean; data: ApiMedia }>(`/media/${id}`);
    return res.data;
}

export async function createMedia(payload: Partial<ApiMedia>): Promise<ApiMedia> {
    const res = await apiFetch<{ success: boolean; data: ApiMedia }>('/media', {
        method: 'POST',
        body:   JSON.stringify(payload),
    });
    return res.data;
}

export async function deleteMedia(id: number | string): Promise<void> {
    await apiFetch(`/media/${id}`, { method: 'DELETE' });
}

// ─── Projects API ─────────────────────────────────────────────────────────────

export async function getProjects(): Promise<ProjectsApiResponse> {
    return apiFetch<ProjectsApiResponse>('/projects');
}

export async function getProject(id: number | string): Promise<ProjectApiResponse> {
    return apiFetch<ProjectApiResponse>(`/projects/${id}`);
}

export async function createProject(payload: {
    title: string;
    description?: string;
    category?: CategoryValue;
}): Promise<ProjectApiResponse> {
    return apiFetch<ProjectApiResponse>('/projects', {
        method: 'POST',
        body:   JSON.stringify(payload),
    });
}

export async function deleteProject(id: number | string): Promise<void> {
    await apiFetch(`/projects/${id}`, { method: 'DELETE' });
}

// ─── Health check ─────────────────────────────────────────────────────────────

export async function checkHealth(): Promise<boolean> {
    try {
        await apiFetch('/health');
        return true;
    } catch {
        return false;
    }
}