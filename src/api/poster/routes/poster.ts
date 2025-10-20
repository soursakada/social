// ./src/api/poster/routes/poster.ts
export default {
    routes: [
        {
            method: 'GET',
            path: '/poster/profile',
            handler: 'poster.getProfile',
            config: {
                auth: false,
            },
        }
    ],
};