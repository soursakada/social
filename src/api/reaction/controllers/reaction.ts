// ./src/api/post/controllers/post.ts
import { factories } from '@strapi/strapi';
import { getUserIdFromToken } from '../../../util/auth';

export default factories.createCoreController('api::reaction.reaction', ({ strapi }) => ({
    async giveReact(ctx) {
        try {
            const { react, post } = ctx.request.body
            const service = strapi.service('api::reaction.reaction');
            const servicePoster = strapi.service('api::poster.poster');
            const userChat = getUserIdFromToken(ctx.request.header.authorization);
            const checkOrCreatePoster = await servicePoster.checkOrCreatePoster({
                name: userChat?.username || "New User",
                profileURL: "",
                external: userChat?.chat_key ? userChat.chat_key.toString() : "",
            });
            const reacter = checkOrCreatePoster.data.id ?? null;
            const reaction = await service.giveReact({ react, reacter, post });
            ctx.body = reaction;
        } catch (error) {
            ctx.throw(500, error);
        }
    },
    async unReact(ctx) {
        try {
            const { id } = ctx.params
            const documentId = id
            const service = strapi.service('api::reaction.reaction');
            const reaction = await service.unReact({ documentId });
            ctx.body = reaction;
        } catch (error) {
            ctx.throw(500, error);
        }
    },

}));