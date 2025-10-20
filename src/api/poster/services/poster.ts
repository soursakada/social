// ./src/api/post/services/post.ts

import { BaseService } from "../../../util/base-service";
import { QueryParams } from "../../../util/query-helper";
import { Post } from "../../post/interface/post";
import { Poster } from "../interface/poster";


class PostService extends BaseService<Poster> {
    constructor() {
        super("api::poster.poster");
    }

    /** Fetch posts with pagination + custom response */
    async getProfile(documentId: any) {
        const data = await this.findOne(documentId, {} as QueryParams<Poster>);
        // Build custom response
        return this.createResponse(data, { message: "fetch poster successfully" });
    }
    // create poster
    async checkOrCreatePoster({ name, profileURL, external }: Partial<Poster>) {

        const existingUser = await this.findFirst({ filters: { external: external || "" } });
        if (existingUser) {
            return this.createResponse(existingUser, { message: "poster already exists" });
        }

        const createdPoster = await this.createAndPublish({
            name: name || "New User",
            profileURL: profileURL || "",
            external: external || "",
        });
        return this.createResponse(createdPoster, { message: "poster created successfully" });
    }
}

export default new PostService();