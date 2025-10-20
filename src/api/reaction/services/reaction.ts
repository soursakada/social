// ./src/api/post/services/reaction.ts

import { BaseService } from "../../../util/base-service";
import { giveReactProps, React, unReactProps } from "../interface/reaction";


class ReactionService extends BaseService<React> {
    constructor() {
        super("api::reaction.reaction");
    }
    // create
    async giveReact({ react, post, reacter }: Partial<giveReactProps>) {
        // Check if this user already reacted to this post
        const existingReact = await this.findFirst({
            filters: {
                post: post,
                reacter: reacter
            }
        });

        if (existingReact) {
            // Optionally return existing reaction or an error message
            return this.createResponse(existingReact, { message: "User already reacted" });
        }

        // Only create a new reaction if it doesn't exist
        const giveReact = await this.createAndPublish({
            react,
            post,
            reacter
        });

        return this.createResponse(giveReact, { message: "React created successfully" });
    }

    async unReact({ documentId }: Partial<unReactProps>) {
        const unReact = await this.deleteById(documentId)
        return this.createResponse(unReact, { message: "un-react created successfully" });
    }
}

export default new ReactionService();