// ./src/utils/base-service.ts
import { QueryParams } from "../util/query-helper";

interface QueryParam<T> extends QueryParams<T> { }

export class BaseService<T> {
    protected model: any;

    constructor(model: string) {
        this.model = model;
    }

    private logError(method: string, error: unknown) {
        console.error(`❌ Error in BaseService.${method}()`, error);
    }

    /**
   * Standard response for paginated or normal data
   */
    createResponse(data: T[] | T | null, options?: {
        page?: number;
        pageSize?: number;
        total?: number;
        message?: string;
    }) {
        const { page = 1, pageSize = data instanceof Array ? data.length : 1, total, message = "fetch data successfully" } = options || {};

        const meta = total !== undefined
            ? {
                page,
                pageSize,
                total,
                pageCount: Math.ceil(total / pageSize),
            }
            : undefined;

        return {
            code: 200,
            message,
            ...(meta && { meta }),
            data,
        };
    }


    /** Get all records */
    async find(params: QueryParam<T> = {}): Promise<T[]> {
        try {
            const query = { ...params };
            return (await strapi.documents(this.model).findMany(query as any)) as T[];
        } catch (error) {
            this.logError("find", error);
            throw error;
        }
    }

    /** Get one record by ID */
    async findOne(documentId: string, params: QueryParam<T> = {}): Promise<T> {
        try {
            return (await strapi.documents(this.model).findOne({
                documentId,
                ...(params as any),
            })) as T;
        } catch (error) {
            this.logError("findOne", error);
            throw error;
        }
    }

    /** Create new record */
    async create(data: Partial<T>): Promise<T> {
        try {
            return (await strapi.documents(this.model).create({ data })) as T;
        } catch (error) {
            this.logError("create", error);
            throw error;
        }
    }

    /** Update record by ID */
    async update(id: string, data: Partial<T>): Promise<T> {
        try {
            return (await strapi.documents(this.model).update({
                documentId: id,
                data
            })) as T;
        } catch (error) {
            this.logError("update", error);
            throw error;
        }
    }

    /** Create and publish immediately */
    /** Create and publish immediately, and return populated data */
    async createAndPublish(data: Partial<T>, populate: string[] | Record<string, any> = ["*"]): Promise<T> {
        try {
            // Step 1: Create and publish document
            const created = await strapi.documents(this.model).create({
                data,
                status: "published",
            });

            // Step 2: Fetch again with populate (so we get all relations, like images)
            const populated = await strapi.documents(this.model).findOne({
                documentId: created.documentId,
                populate,
            });

            return populated as T;
        } catch (error) {
            this.logError("createAndPublish", error);
            throw error;
        }
    }

    /** Get first matching record */
    async findFirst(params: QueryParam<T> = {}): Promise<T | null> {
        try {
            const query = { ...params, limit: 1 };
            const results = (await strapi.documents(this.model).findMany(query as any)) as T[];
            return results?.[0] ?? null;
        } catch (error) {
            this.logError("findFirst", error);
            throw error;
        }
    }

    /** Delete record by ID */
    async deleteById(id: string): Promise<T> {
        try {
            return (await strapi.documents(this.model).delete({
                documentId: id,
            })) as T;
        } catch (error) {
            this.logError("deleteById", error);
            throw error;
        }
    }

    /** Count total records */
    async count(params: QueryParam<T> = {}): Promise<number> {
        try {
            return (await strapi.documents(this.model).count(params as any)) as number;
        } catch (error) {
            this.logError("count", error);
            throw error;
        }
    }

    /** 🔼 Upload image from FormData */
    async upload(file: any): Promise<any> {
        try {
            if (!file) {
                throw new Error("No file uploaded");
            }

            // If Strapi v5, use the upload plugin service
            const uploadedFiles = await strapi.plugins["upload"].services.upload.upload({
                data: {}, // additional data if needed
                files: file,
            });

            return {
                code: 200,
                message: "File uploaded successfully",
                data: uploadedFiles,
            };
        } catch (error) {
            this.logError("upload", error);
            throw error;
        }
    }
}
