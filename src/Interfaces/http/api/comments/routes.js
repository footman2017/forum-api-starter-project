const routes = (handler) => [
  {
    method: "POST",
    path: "/threads/{threadId}/comments",
    handler: (request, h) => handler.postCommentHandler(request, h),
    options: {
      auth: "forumapp_jwt",
    },
  },
];

module.exports = routes;
