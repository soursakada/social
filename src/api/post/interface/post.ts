export interface Post {
    id: number;
    documentId?: string;
    caption: string;
    type: string;
    image: string;
    poster: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string | null;
    // Add other fields as necessary
}

export interface FetchPostProps {
    page: number;
    pageSize: number;
    poster: string
}

export interface FetchPostOneProps {
    documentId: string;
}

export interface createPostProps {
    poster: string
    caption: string
    image: any
    file: any
    type: string
}