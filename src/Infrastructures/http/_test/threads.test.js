const pool = require("../../database/postgres/pool");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const TokenTestHelper = require("../../../../tests/TokenTestHelper");
const container = require("../../container");
const createServer = require("../createServer");
const AuthenticationsTableTestHelper = require("../../../../tests/AuthenticationsTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");

describe("/threads endpoint", () => {
  let server;
  let tokenTestHelper;
  let token;

  beforeAll(async () => {
    server = await createServer(container);
    tokenTestHelper = new TokenTestHelper(server);
    token = await tokenTestHelper.getCredentials();
    token = `Bearer ${token.accessToken}`;
  });

  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  describe("when POST /threads", () => {
    it("should response 201 and persisted thread", async () => {
      // Arrange
      const requestPayload = {
        title: "dicoding",
        body: "secret",
      };

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/threads",
        payload: requestPayload,
        headers: { Authorization: token },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.addedThread).toBeDefined();
      expect(responseJson.data.addedThread.title).toEqual(requestPayload.title);
    });

    it("should response 400 when request payload not contain needed property", async () => {
      // Arrange
      const requestPayload = {
        title: "Dicoding Indonesia",
      };

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/threads",
        payload: requestPayload,
        headers: { Authorization: token },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada");
    });

    it("should response 400 when request payload not meet data type specification", async () => {
      // Arrange
      const requestPayload = {
        title: "dicoding",
        body: 1111,
      };

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/threads",
        payload: requestPayload,
        headers: { Authorization: token },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("tidak dapat membuat thread baru karena tipe data tidak sesuai");
    });

    it("should response 401 when headers not contain access token", async () => {
      // Arrange
      const requestPayload = {
        title: "dicoding",
        body: "secret",
      };

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/threads",
        payload: requestPayload,
      });

      // Assert
      expect(response.statusCode).toEqual(401);
    });
  });

  describe("when GET /threads/{threadId}", () => {
    it("should response 200", async () => {
      // Arrange
      const threadId = "thread-mantap";
      const commentId = "comment-mantap";
      const userId1 = "user-1";
      const userId2 = "user-2";

      await UsersTableTestHelper.addUser({ id: userId1 });
      await UsersTableTestHelper.addUser({ id: userId2, username: "clean arsitektur" });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId1 });
      await CommentsTableTestHelper.addComment({ id: commentId, threadId: threadId, owner: userId2 });

      // Action
      const response = await server.inject({
        method: "GET",
        url: `/threads/${threadId}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.thread.id).toStrictEqual(threadId);
      expect(responseJson.data.thread.title).toStrictEqual("dicoding");
      expect(responseJson.data.thread.body).toStrictEqual("secret");
    });
  });
});
