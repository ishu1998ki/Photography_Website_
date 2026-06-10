// ─── Types that match the PostgreSQL schema ───────────────────────────────────

export type MediaType     = 'image' | 'video';
export type CategoryValue = 'portrait' | 'landscape' | 'architecture' | 'street' | 'video';
export type SpanValue     = 'normal' | 'tall';

export interface ApiMedia {
    id:            number;
    project_id:    number;
    type:          MediaType;
    url:           string;
    thumbnail_url: string;
    title:         string;
    description:   string;
    location:      string;
    year:          number;
    span:          SpanValue;
    created_at:    string;
    category:      CategoryValue;
    project_title: string;
}

export interface ApiProject {
    id:          number;
    title:       string;
    description: string;
    category:    CategoryValue;
    created_at:  string;
    media?:      ApiMedia[];
}

export interface PaginationInfo {
    total:      number;
    page:       number;
    limit:      number;
    totalPages: number;
    hasNext:    boolean;
    hasPrev:    boolean;
}

export interface MediaApiResponse {
    success:    boolean;
    count:      number;
    data:       ApiMedia[];
    pagination: PaginationInfo;
}

export interface ProjectApiResponse {
    success: boolean;
    data:    ApiProject;
}

export interface ProjectsApiResponse {
    success: boolean;
    count:   number;
    data:    ApiProject[];
}