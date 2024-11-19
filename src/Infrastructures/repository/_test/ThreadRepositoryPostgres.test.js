const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const InvariantError = require("../../../Commons/exceptions/InvariantError");
const CreatedThread = require("../../../Domains/threads/entities/CreatedThread");
const CreateThread = require("../../../Domains/threads/entities/CreateThread");
const pool = require("../../database/postgres/pool");
const ThreadRepositoryPostgres = require("../ThreadRepositoryPostgres");
const UserRepositoryPostgres = require("../UserRepositoryPostgres");

describe("ThreadRepositoryPostgres", () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("createThread function", () => {
    it("should persist create thread and return created thread correctly", async () => {
      // Arrange
      const createThread = new CreateThread({
        title: "dicoding",
        body: "secret_password",
      });
      const fakeIdGenerator = () => "1"; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      await UsersTableTestHelper.addUser({ username: "dicoding" });
      // Action
      await threadRepositoryPostgres.createThread("user-123", createThread);

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadsById("thread-1");
      expect(threads).toHaveLength(1);
    });

    it("should return created thread correctly", async () => {
      // Arrange
      const createThread = new CreateThread({
        title: "dicoding",
        body: "secret_password",
      });
      const fakeIdGenerator = () => "1"; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      await UsersTableTestHelper.addUser({ username: "dicoding" });

      // Action
      const creteadThread = await threadRepositoryPostgres.createThread("user-123", createThread);

      // Assert
      expect(creteadThread).toStrictEqual(
        new CreatedThread({
          id: "thread-1",
          title: "dicoding",
          owner: "user-123",
        })
      );
    });
  });

  describe("getThreadById function", () => {
    it("should throw InvariantError when thread not found", async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.getThreadById("thread-1")).rejects.toThrowError(InvariantError);
    });

    it("should return thread correctly", async () => {
      // Arrange
      ownerId = "user-1";
      threadId = "thread-1";

      await UsersTableTestHelper.addUser({ id: ownerId });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: ownerId });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      const threadData = await threadRepositoryPostgres.getThreadById(threadId);

      // Assert
      expect(threadData.id).toStrictEqual(threadId);
    });
  });

  describe("isThreadExist function", () => {
    it("should throw InvariantError when thread not available", async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.isThreadExist("thread-1")).rejects.toThrowError(InvariantError);
    });

    it("should not throw InvariantError when thread available", async () => {
      // Arrange
      const userId = "user-123";
      const threadId = "thread-1";

      await UsersTableTestHelper.addUser({ id: userId });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.isThreadExist(threadId)).resolves.not.toThrowError(InvariantError);
    });
  });
});
