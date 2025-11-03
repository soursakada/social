export default {
    routes: [
        {
            method: "POST",
            path: "/stories/upload",
            handler: "story.uploadStoryMedia",
            config: { auth: false },
        },
        {
            method: "POST",
            path: "/stories",
            handler: "story.createStory",
            config: { auth: false },
        },
        {
            method: "POST",
            path: "/get-stories",
            handler: "story.getStories",
            config: { auth: false },
        },
        {
            method: "POST",
            path: "/stories/mark-viewed",
            handler: "story.markViewed",
            config: { auth: false },
        },
        {
            method: "DELETE",
            path: "/stories/cleanup",
            handler: "story.cleanupExpiredStories",
            config: { auth: false },
        },
    ],
};
