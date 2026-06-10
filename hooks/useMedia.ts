'use client';

import { useState, useEffect, useCallback } from 'react';
import { getMedia, type GetMediaParams } from '@/lib/api';
import type { ApiMedia, PaginationInfo } from '@/lib/types';

interface UseMediaResult {
    media:      ApiMedia[];
    pagination: PaginationInfo | null;
    loading:    boolean;
    error:      string | null;
    refetch:    () => void;
}

export function useMedia(params: GetMediaParams = {}): UseMediaResult {
    const [media,      setMedia]      = useState<ApiMedia[]>([]);
    const [pagination, setPagination] = useState<PaginationInfo | null>(null);
    const [loading,    setLoading]    = useState(true);
    const [error,      setError]      = useState<string | null>(null);

    // Stable key to detect when params actually change
    const paramsKey = JSON.stringify(params);

    const fetchMedia = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await getMedia(params);
            setMedia(res.data);
            setPagination(res.pagination);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load media');
        } finally {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paramsKey]);

    useEffect(() => {
        fetchMedia();
    }, [fetchMedia]);

    return { media, pagination, loading, error, refetch: fetchMedia };
}