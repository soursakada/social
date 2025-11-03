import { BaseService } from "../../../util/base-service";
import { QueryParams } from "../../../util/query-helper";
import { Story } from "../interface/story";

class StoryService extends BaseService<Story> {
    constructor() {
        super("api::story.story");
    }

    /** Get all active (non-expired) stories */
    async getStories({ page, pageSize }: { page: number; pageSize: number }) {
        const start = (page - 1) * pageSize;
        const now = new Date().toISOString();

        const data = await this.find({
            pagination: { page, pageSize },
            start,
            limit: pageSize,
            filters: { expiredAt: { $gt: now } },
            populate: {
                poster: { fields: ["id", "name", "external"] },
                src: { fields: ["id", "name", "url", "mime"] },
                viewedBy: { fields: ["id", "name"] },
            },
            sort: { createdAt: "desc" },
        } as QueryParams<any>);

        const total = await this.count({ filters: { expiredAt: { $gt: now } } });

        return this.createResponse(data, {
            page,
            pageSize,
            total,
            message: "Fetched stories successfully",
        });
    }

    /** Upload story media only */
    async uploadStoryMedia(file: any) {
        if (!file) throw new Error("No file uploaded");

        const uploaded = await this.upload(file);
        const uploadedFile = uploaded?.data?.[0];

        return uploadedFile
    }

    /** Create story using uploaded srcId */
    async createStory({
        userId,
        caption,
        srcId,
    }: {
        userId: number;
        caption?: string;
        srcId?: number | null;
    }) {
        const expiredAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

        const newStory = await this.createAndPublish(
            {
                poster: userId,
                caption,
                expiredAt,
                ...(srcId && { src: srcId }),
            },
            ["poster", "src"]
        );

        return this.createResponse(newStory, {
            message: "Story created successfully",
        });
    }

    /** Mark a story as viewed */
    async markViewed(storyId: number | string, userId: number | string) {
        const story = await strapi.db.query("api::story.story").findOne({
            where: { id: Number(storyId) },
            populate: { viewedBy: true },
        });

        if (!story) {
            return this.createResponse(null, { message: "Story not found" });
        }

        const alreadyViewed = story.viewedBy.some((v) => v.id === Number(userId));
        if (!alreadyViewed) {
            await strapi.db.query("api::story.story").update({
                where: { id: story.id },
                data: {
                    viewedBy: [...story.viewedBy.map((v) => v.id), Number(userId)],
                },
            });
        }

        return this.createResponse(null, { message: "Story marked as viewed" });
    }

    /** 🧹 Remove expired stories */
    async cleanupExpiredStories() {
        const now = new Date().toISOString();
        const expiredStories = await this.find({
            filters: { expiredAt: { $lt: now } },
            populate: { src: true },
        });

        if (!expiredStories.length) {
            return this.createResponse([], {
                message: "No expired stories found",
            });
        }

        for (const story of expiredStories) {
            if (story.src && typeof story.src === "object") {
                try {
                    await strapi.plugins["upload"].services.upload.remove(story.src);
                } catch (err) {
                    console.warn("⚠️ Failed to remove media for story", story.id, err);
                }
            }
            await this.deleteById(String(story.id));
        }

        return this.createResponse(expiredStories, {
            message: `Deleted ${expiredStories.length} expired stories`,
        });
    }
}

export default new StoryService();
