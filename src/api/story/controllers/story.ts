import { factories } from "@strapi/strapi";
import { getUserIdFromToken } from "../../../util/auth";

export default factories.createCoreController("api::story.story", ({ strapi }) => ({

    /** Upload media separately */
    async uploadStoryMedia(ctx) {
        try {
            const file = ctx.request.files?.file;
            if (!file) return ctx.badRequest("No file provided");

            const service = strapi.service("api::story.story");
            const uploadResult = await service.uploadStoryMedia(file);

            ctx.body = uploadResult;
        } catch (error) {
            ctx.throw(500, error);
        }
    },

    /** Create story after media uploaded */
    async createStory(ctx) {
        try {
            const { caption, srcId } = ctx.request.body;

            const servicePoster = strapi.service('api::poster.poster');
            const userChat = getUserIdFromToken(ctx.request.header.authorization);
            const checkOrCreatePoster = await servicePoster.checkOrCreatePoster({
                name: userChat?.username || "New User",
                profileURL: "",
                external: userChat?.chat_key ? userChat.chat_key.toString() : "",
            });
            const userId = checkOrCreatePoster.data.id ?? null;

            if (!userId) return ctx.badRequest("Missing userId");

            const service = strapi.service("api::story.story");
            const result = await service.createStory({
                userId: Number(userId),
                caption,
                srcId: srcId ? Number(srcId) : null,
            });

            ctx.body = result;
        } catch (error) {
            ctx.throw(500, error);
        }
    },

    /** Keep the rest of your endpoints the same */
    async getStories(ctx) {
        const { page = '1', pageSize = '10' } = ctx.query;
        const service = strapi.service("api::story.story");
        ctx.body = await service.getStories({
            page: Number(page),
            pageSize: Number(pageSize),
        });
    },

    async markViewed(ctx) {
        const { storyId } = ctx.request.body;
        const servicePoster = strapi.service('api::poster.poster');
        const userChat = getUserIdFromToken(ctx.request.header.authorization);
        const checkOrCreatePoster = await servicePoster.checkOrCreatePoster({
            name: userChat?.username || "New User",
            profileURL: "",
            external: userChat?.chat_key ? userChat.chat_key.toString() : "",
        });
        const userId = checkOrCreatePoster.data.id ?? null;
        const service = strapi.service("api::story.story");
        ctx.body = await service.markViewed(storyId, userId);
    },

    async cleanupExpiredStories(ctx) {
        const service = strapi.service("api::story.story");
        ctx.body = await service.cleanupExpiredStories();
    },
}));
