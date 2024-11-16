const routes = (handler) => [
  {
    method: "POST",
    path: "/threads",
    handler: handler.postThreadHandler,
    handler: (request, h) => handler.postThreadHandler(request, h),
    options: {
      auth: "forumapp_jwt",
    },
  },
];

module.exports = routes;
