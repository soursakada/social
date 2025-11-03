export interface Story {
    id: number;
    documentId?: string;
    caption?: string;
    src?: number;
    poster: number;
    expiredAt: Date;
    viewedBy?: string[];
    createdAt: string;
    updatedAt: string;
    publishedAt: string | null;
}