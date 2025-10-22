// ./src/api/post/services/post.ts

import { BaseService } from "../../../util/base-service";
import { QueryParams } from "../../../util/query-helper";
import { createPostProps, FetchPostOneProps, FetchPostProps, Post } from "../interface/post";


class PostService extends BaseService<Post> {
    constructor() {
        super("api::post.post");
    }

    /** Fetch posts with pagination + custom response */
    async findAll({ page, pageSize }: FetchPostProps) {
        const start = (page - 1) * pageSize;

        // Fetch paginated data using QueryParams<T>
        const data = await this.find({
            pagination: {
                page,
                pageSize,
            },
            start,
            limit: pageSize,
            populate: {
                poster: true,
                comments: {
                    populate: {
                        commenter: true,
                        parentComment: {
                            populate: { commenter: true }
                        },
                        childrenComment: {
                            populate: { commenter: true }
                        }
                    },
                },
                reactions: {
                    populate: {
                        reacter: true,
                    },
                },
                image: {
                    fields: ["id", "name", "url"]
                }
            },
            sort: {
                createdAt: 'desc',
            },
        } as QueryParams<Post>);

        // Count total records
        const total = await this.count();

        // Build custom response
        return this.createResponse(data, { page, pageSize, total, message: "fetch post successfully" });
    }

    // my posts
    async myPosts({ page, pageSize, poster }: FetchPostProps) {
        const start = (page - 1) * pageSize;

        // Fetch paginated data using QueryParams<T>
        const data = await this.find({
            pagination: {
                page,
                pageSize,
            },
            where: {
                poster: poster
            },
            start,
            limit: pageSize,
            populate: {
                poster: true,
                comments: {
                    populate: {
                        commenter: true,
                        parentComment: {
                            populate: { commenter: true }
                        },
                        childrenComment: {
                            populate: { commenter: true }
                        }
                    },
                },
                reactions: {
                    populate: {
                        reacter: true,
                    },
                },
                image: {
                    fields: ["id", "name", "url"]
                }
            },
            sort: {
                createdAt: 'desc',
            },
        } as QueryParams<Post>);

        // Count total records
        const total = await this.count();

        // Build custom response
        return this.createResponse(data, { page, pageSize, total, message: "fetch post successfully" });
    }

    // my posts
    async postDetail({ documentId }: FetchPostOneProps) {

        const data = await this.findOne(documentId, {
            populate: {
                poster: true,
                comments: {
                    populate: {
                        commenter: true,
                        parentComment: {
                            populate: { commenter: true }
                        },
                        childrenComment: {
                            populate: { commenter: true }
                        }
                    },
                },
                reactions: {
                    populate: {
                        reacter: true,
                    },
                },
                image: {
                    fields: ["id", "name", "url"]
                }
            },
        })

        // Build custom response
        return this.createResponse(data, { message: "fetch post successfully" });
    }

    // upload file
    async uploadFile({ file }: Partial<createPostProps>) {
        // upload file
        const uploadFile = await this.upload(file);
        console.log(uploadFile)
        // const createdPost = await this.createAndPublish({
        //     caption,
        //     image,
        //     type
        // })
        return this.createResponse(uploadFile, { message: "post created successfully" });
    }
    // create post
    async createPost({ caption, image, type, poster }: Partial<createPostProps>) {
        const createdPost = await this.createAndPublish({
            caption,
            image,
            type,
            poster
        }, {
            image: {
                fields: ["id", "name", "url"]
            }
        }
        )
        return this.createResponse(createdPost, { message: "post created successfully" });
    }

    // edit post
    async editPost({ documentId, caption, type }: Partial<Post>) {
        const updatePost = await this.update(documentId, { caption: caption, type: type })
        return this.createResponse(updatePost, { message: "post updated successfully" })
    }

    // delete post
    async deletePost({ documentId }: Partial<Post>) {
        const deletePost = await this.deleteById(documentId)

        return this.createResponse(deletePost, { message: "post deleted successfully" })
    }

}

export default new PostService();