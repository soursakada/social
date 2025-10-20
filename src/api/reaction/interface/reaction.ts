export interface React {
    id: number;
    documentId?: string;
    react: string;
    post: number;
    reacter: number
    createdAt: string;
    updatedAt: string;
    publishedAt: string | null;
    // Add other fields as necessary
}

export interface giveReactProps {
    react: string;
    post: number;
    reacter: number
}

export interface unReactProps {
    documentId: string;
}