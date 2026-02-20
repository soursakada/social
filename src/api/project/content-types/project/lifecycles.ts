import { errors } from '@strapi/utils';
const { ValidationError } = errors;

export default {
    /**
     * ======================
     * BEFORE CREATE
     * ======================
     */
    async beforeCreate(event: any) {
        try {
            const { data } = event.params;
            if (data.title) {
                data.code = data.title.toLowerCase().replace(/\s+/g, '-');
            }

        } catch (err) {
            if (err instanceof ValidationError) {
                throw err;
            }

            throw new ValidationError(
                'Failed to validate warranty before creation'
            );
        }
    }
};