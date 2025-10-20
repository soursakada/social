import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
    id: number;
    user?: {
        user_id: number;
        chat_key: number;
        username?: string;
    };
    iat: number;
    exp: number;
}

export function getUserIdFromToken(token: string): JwtPayload['user'] | null {
    try {
        const decoded = jwtDecode<JwtPayload>(token);
        return decoded.user || null;
    } catch (error) {
        console.error('Invalid token:', error);
        return null;
    }
}

interface UserChat {
    username?: string;
    chat_key?: string | number;
}

interface PosterInput {
    name: string;
    profileURL: string;
    external: string;
}

interface PosterService {
    checkOrCreatePoster(data: PosterInput): Promise<any>;
}

interface Context {
    request: {
        header: {
            authorization?: string;
        };
    };
}

/**
 * Retrieves or creates a poster for the authenticated user.
 */
export const getOrCreatePoster = async (
    ctx: Context,
    service: PosterService,
    getUserIdFromToken: (token?: string) => UserChat | null
): Promise<any> => {
    // Extract user info from token
    const userChat = getUserIdFromToken(ctx.request.header.authorization);

    // Prepare poster data
    const posterData: PosterInput = {
        name: userChat?.username || "New User",
        profileURL: "",
        external: userChat?.chat_key ? userChat.chat_key.toString() : "",
    };

    // Create or check existing poster
    const checkOrCreatePoster = await service.checkOrCreatePoster(posterData);

    return checkOrCreatePoster;
};

