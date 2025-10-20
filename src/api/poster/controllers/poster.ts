// ./src/api/post/controllers/poster.ts
import { factories } from '@strapi/strapi';
import { getUserIdFromToken } from '../../../util/auth';

export default factories.createCoreController('api::poster.poster', ({ strapi }) => ({

    async getProfile(ctx) {
        try {
            const service = strapi.service('api::poster.poster');
            const userChat = getUserIdFromToken(ctx.request.header.authorization);
            const checkOrCreatePoster = await service.checkOrCreatePoster({
                name: userChat?.username || "New User",
                profileURL: "",
                external: userChat?.chat_key ? userChat.chat_key.toString() : "",
            });
            // Fetch profile using userChat info
            const profile = await service.getProfile(checkOrCreatePoster.data.documentId);
            ctx.body = profile;
        } catch (error) {
            ctx.throw(500, error);
        }
    },
}));