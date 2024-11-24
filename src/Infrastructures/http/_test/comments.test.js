const pool = require("../../database/postgres/pool");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const TokenTestHelper = require("../../../../tests/TokenTestHelper");
const container = require("../../container");
const createServer = require("../createServer");
const AuthenticationsTableTestHelper = require("../../../../tests/AuthenticationsTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");

describe("/comments endpoint", () => {
  let server;
  let tokenTestHelper;
  let token;
  let loginUser;

  beforeAll(async () => {
    server = await createServer(container);
    tokenTestHelper = new TokenTestHelper(server);
    token = await tokenTestHelper.getCredentials();
    loginUser = token.userId;
    token = `Bearer ${token.accessToken}`;
  });

  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  describe("when POST /threads/{threadId}/comments", () => {
    it("should response 201 and persisted comment", async () => {
      // Arrange
      const requestPayload = {
        content: "dicoding",
      };

      const threadId = "thread-mantap";
      const ownerId = "user-1";

      await UsersTableTestHelper.addUser({ id: ownerId });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: ownerId });

      // Action
      const response = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: { Authorization: token },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.addedComment).toBeDefined();
      expect(responseJson.data.addedComment.content).toEqual(requestPayload.content);
    });

    it("should response 404 when thread doesn't exist", async () => {
      // Arrange
      const requestPayload = {
        content: "dicoding",
      };

      const threadId = "thread-mantap";
      ownerId = "user-1";

      // Action
      const response = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: { Authorization: token },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual("fail");
    });

    it("should response 400 when request payload not contain needed property", async () => {
      // Arrange
      const requestPayload = {
        title: "Dicoding Indonesia",
      };

      const threadId = "thread-mantap";
      const ownerId = "user-1";

      await UsersTableTestHelper.addUser({ id: ownerId });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: ownerId });

      // Action
      const response = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: { Authorization: token },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("tidak dapat membuat comment baru karena properti yang dibutuhkan tidak ada");
    });

    it("should response 400 when request payload not meet data type specification", async () => {
      // Arrange
      const requestPayload = {
        content: 1111,
      };

      const threadId = "thread-mantap";
      ownerId = "user-1";

      await UsersTableTestHelper.addUser({ id: ownerId });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: ownerId });

      // Action
      const response = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: { Authorization: token },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("tidak dapat membuat comment baru karena tipe data tidak sesuai");
    });

    it("should response 401 when headers not contain access token", async () => {
      // Arrange
      const requestPayload = {
        content: "dicoding",
      };

      const threadId = "thread-mantap";
      ownerId = "user-1";

      await UsersTableTestHelper.addUser({ id: ownerId });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: ownerId });

      // Action
      const response = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
      });

      // Assert
      expect(response.statusCode).toEqual(401);
    });
  });

  describe("when DELETE /threads/{threadId}/comments/{commentId}", () => {
    it("should response 200", async () => {
      // Arrange
      const threadId = "thread-mantap";
      const commentId = "comment-mantap";
      const userId1 = "user-1";

      await UsersTableTestHelper.addUser({ id: userId1 });
      await UsersTableTestHelper.addUser({ id: loginUser, username: "clean arsitektur tolol" });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId1 });
      await CommentsTableTestHelper.addComment({ id: commentId, threadId: threadId, owner: loginUser });

      // Action
      const response = await server.inject({
        method: "DELETE",
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: { Authorization: token },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
    });

    it("should response 404 when thread doesn't exist", async () => {
      // Arrange
      const threadId = "thread-mantap";
      const commentId = "comment-mantap";
      const userId1 = "user-1";

      await UsersTableTestHelper.addUser({ id: userId1 });
      await UsersTableTestHelper.addUser({ id: loginUser, username: "clean arsitektur" });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId1 });
      await CommentsTableTestHelper.addComment({ id: commentId, threadId: threadId, owner: loginUser });

      // Action
      const response = await server.inject({
        method: "DELETE",
        url: `/threads/clean-arsitektur/comments/${commentId}`,
        headers: { Authorization: token },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual("fail");
    });

    it("should response 404 when comment doesn't exist", async () => {
      // Arrange
      const threadId = "thread-mantap";
      const commentId = "comment-mantap";
      const userId1 = "user-1";

      await UsersTableTestHelper.addUser({ id: userId1 });
      await UsersTableTestHelper.addUser({ id: loginUser, username: "clean arsitektur" });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId1 });
      await CommentsTableTestHelper.addComment({ id: commentId, threadId: threadId, owner: loginUser });

      // Action
      const response = await server.inject({
        method: "DELETE",
        url: `/threads/${threadId}/comments/${commentId}sad`,
        headers: { Authorization: token },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual("fail");
    });

    it("should response 401 when headers not contain access token", async () => {
      // Arrange
      const threadId = "thread-mantap";
      const commentId = "comment-mantap";
      const userId1 = "user-1";

      await UsersTableTestHelper.addUser({ id: userId1 });
      await UsersTableTestHelper.addUser({ id: loginUser, username: "clean arsitektur" });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId1 });
      await CommentsTableTestHelper.addComment({ id: commentId, threadId: threadId, owner: loginUser });

      // Action
      const response = await server.inject({
        method: "DELETE",
        url: `/threads/${threadId}/comments/${commentId}`,
      });

      // Assert
      expect(response.statusCode).toEqual(401);
    });

    it("should response 403 not the comment's owner", async () => {
      // Arrange
      const threadId = "thread-mantap";
      const commentId = "comment-mantap";
      const userId1 = "user-1";

      await UsersTableTestHelper.addUser({ id: userId1 });
      await UsersTableTestHelper.addUser({ id: "user-lain", username: "clean arsitektur" });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId1 });
      await CommentsTableTestHelper.addComment({ id: commentId, threadId: threadId, owner: "user-lain" });

      // Action
      const response = await server.inject({
        method: "DELETE",
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: { Authorization: token },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual("fail");
    });
  });
});
