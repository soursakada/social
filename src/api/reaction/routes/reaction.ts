// ./src/api/post/routes/reaction.ts
export default {
    routes: [
        {
            method: 'POST',
            path: '/react-post',
            handler: 'reaction.giveReact',
            config: {
                auth: false,
            },
        },
        {
            method: 'DELETE',
            path: '/unreact-post/:id',
            handler: 'reaction.unReact',
            config: {
                auth: false,
            },
        }
    ],
};