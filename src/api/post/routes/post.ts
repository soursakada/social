// ./src/api/post/routes/post.ts
export default {
    routes: [
        {
            method: 'GET',
            path: '/posts',
            handler: 'post.findAll',
            config: {
                auth: false,
            },
        },
        {
            method: 'GET',
            path: '/my-posts',
            handler: 'post.myPosts',
            config: {
                auth: false,
            },
        },
        {
            method: 'POST',
            path: '/create-post',
            handler: 'post.createPost',
            config: {
                auth: false,
            },
        },
        {
            method: 'POST',
            path: '/upload-file',
            handler: 'post.uploadFile',
            config: {
                auth: false,
            },
        },
        {
            method: 'PUT',
            path: '/edit-post/:id',
            handler: 'post.editPost',
            config: {
                auth: false,
            },
        },
        {
            method: 'DELETE',
            path: '/delete-post/:id',
            handler: 'post.deletePost',
            config: {
                auth: false,
            },
        }
    ],
};