// ./src/api/post/controllers/post.ts
import { factories } from '@strapi/strapi';
import { getUserIdFromToken } from '../../../util/auth';
// import { getUserIdFromToken } from '../../../util/auth';

export default factories.createCoreController('api::post.post', ({ strapi }) => ({

    async findAll(ctx) {
        try {
            const service = strapi.service('api::post.post');
            const { page, pageSize } = ctx.query;
            const pageNum = parseInt(page as string, 10) || 1;
            const pageSizeNum = parseInt(pageSize as string, 10) || 10;
            const posts = await service.findAll({ page: pageNum, pageSize: pageSizeNum });
            ctx.body = posts;
        } catch (error) {
            ctx.throw(500, error);
        }
    },
    async myPosts(ctx) {
        try {
            const service = strapi.service('api::post.post');
            const servicePoster = strapi.service('api::poster.poster');
            const userChat = getUserIdFromToken(ctx.request.header.authorization);
            const checkOrCreatePoster = await servicePoster.checkOrCreatePoster({
                name: userChat?.username || "New User",
                profileURL: "",
                external: userChat?.chat_key ? userChat.chat_key.toString() : "",
            });
            const poster = checkOrCreatePoster.data.id ?? null;
            const { page, pageSize } = ctx.query;
            const pageNum = parseInt(page as string, 10) || 1;
            const pageSizeNum = parseInt(pageSize as string, 10) || 10;
            const posts = await service.myPosts({ page: pageNum, pageSize: pageSizeNum, poster });
            ctx.body = posts;
        } catch (error) {
            ctx.throw(500, error);
        }
    },
    async uploadFile(ctx) {
        try {
            const { files } = ctx.request; // get files from multipart/form-data
            console.log("files", files)
            const file = files?.file; // assuming form field name is 'image'
            const service = strapi.service('api::post.post');

            const updaloadFiles = await service.uploadFile({ file });
            ctx.body = updaloadFiles;
        } catch (error) {
            ctx.throw(500, error);
        }
    },
    async createPost(ctx) {
        try {
            const { caption, image, type } = ctx.request.body
            const service = strapi.service('api::post.post');
            const servicePoster = strapi.service('api::poster.poster');
            const userChat = getUserIdFromToken(ctx.request.header.authorization);
            const checkOrCreatePoster = await servicePoster.checkOrCreatePoster({
                name: userChat?.username || "New User",
                profileURL: "",
                external: userChat?.chat_key ? userChat.chat_key.toString() : "",
            });
            const poster = checkOrCreatePoster.data.id ?? null;
            const posts = await service.createPost({ caption, image, type, poster });
            ctx.body = posts;
        } catch (error) {
            ctx.throw(500, error);
        }
    },
    async editPost(ctx) {
        try {
            const service = strapi.service('api::post.post');
            const { caption, type } = ctx.request.body;
            const { id } = ctx.params;
            const documentId = id
            const editPost = await service.editPost({ documentId, caption, type });
            ctx.body = editPost;
        } catch (error) {
            ctx.throw(500, error);
        }
    },
    async deletePost(ctx) {
        try {
            const service = strapi.service('api::post.post');
            const { id } = ctx.params;
            const documentId = id
            const deletePost = await service.deletePost({ documentId });
            ctx.body = deletePost;
        } catch (error) {
            ctx.throw(500, error);
        }
    },


}));