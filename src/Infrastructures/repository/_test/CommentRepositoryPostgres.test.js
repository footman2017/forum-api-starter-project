const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const AddedComment = require("../../../Domains/comments/entities/AddedComment");
const AddComment = require("../../../Domains/comments/entities/AddComment");
const pool = require("../../database/postgres/pool");
const CommentRepositoryPostgres = require("../CommentRepositoryPostgres");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const AuthorizationError = require("../../../Commons/exceptions/AuthorizationError");

describe("CommentRepositoryPostgres", () => {
  beforeEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  const initializeTestData = async () => {
    const user1 = { id: "user-1", username: "sad" };
    const user2 = { id: "user-2", username: "qwe" };
    const thread = { id: "thread-1", owner: user1.id };

    await UsersTableTestHelper.addUser(user1);
    await UsersTableTestHelper.addUser(user2);
    await ThreadsTableTestHelper.addThread(thread);

    return { user1, user2, thread };
  };

  describe("addComment function", () => {
    it("should persist and return added comment correctly", async () => {
      // Arrange
      const { user1, thread } = await initializeTestData();
      const addComment = new AddComment({ content: "dicoding" });
      const fakeIdGenerator = () => "1"; // stub
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(user1.id, thread.id, addComment);

      // Assert: Check persistence
      const comments = await CommentsTableTestHelper.findCommentsById("comment-1");
      expect(comments).toHaveLength(1);

      // Assert: Check return value
      expect(addedComment).toStrictEqual(
        new AddedComment({
          id: "comment-1",
          content: "dicoding",
          owner: user1.id,
        })
      );
    });
  });

  describe("deleteComment function", () => {
    it("should mark a comment as deleted correctly", async () => {
      // Arrange
      const { user1, thread } = await initializeTestData();
      const commentId = "comment-1";

      await CommentsTableTestHelper.addComment({
        id: commentId,
        content: "sample comment",
        thread: thread.id,
        owner: user1.id,
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      await commentRepositoryPostgres.deleteComment(commentId);

      // Assert
      const comments = await CommentsTableTestHelper.findCommentsById(commentId);
      expect(comments).toHaveLength(1);
      expect(comments[0].deleted_at).toBeTruthy();
    });
  });

  describe("getCommentsByThreadId function", () => {
    it("should return comments for a thread sorted by date", async () => {
      // Arrange
      const { user1, user2, thread } = await initializeTestData();

      await CommentsTableTestHelper.addComment({
        id: "comment-1",
        content: "comment 1",
        createdDate: "2024-11-09",
        thread: thread.id,
        owner: user1.id,
        deleted_at: null,
      });

      await CommentsTableTestHelper.addComment({
        id: "comment-2",
        content: "comment 2",
        createdDate: "2024-11-24",
        thread: thread.id,
        owner: user2.id,
        deleted_at: "2024-11-25",
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const comments = await commentRepositoryPostgres.getCommentsByThreadId(thread.id);

      // Assert
      expect(comments).toHaveLength(2);

      // Validate comment structure and order
      expect(comments[0]).toMatchObject({
        id: "comment-1",
        username: user1.username,
        content: "comment 1",
        date: "2024-11-09",
        deleted_at: null,
      });

      expect(comments[1]).toMatchObject({
        id: "comment-2",
        username: user2.username,
        content: "comment 2",
        date: "2024-11-24",
        deleted_at: "2024-11-25",
      });
    });
  });

  describe("isCommentExist function", () => {
    it("should throw NotFoundError when comment does not exist", async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.isCommentExist("comment-1", "thread-1")).rejects.toThrowError(NotFoundError);
    });

    it("should not throw NotFoundError when comment exists and valid", async () => {
      // Arrange
      const { user1, user2 } = await initializeTestData();
      const commentId = "comment-1";
      const threadId = "thread-2";

      await ThreadsTableTestHelper.addThread({ id: threadId, owner: user2.id });
      await CommentsTableTestHelper.addComment({ id: commentId, threadId, owner: user1.id });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.isCommentExist(commentId, threadId)).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe("isCommentOwner function", () => {
    it("should not throw AuthorizationError if the user is the owner", async () => {
      // Arrange
      const { user1 } = await initializeTestData();
      const commentId = "comment-123";
      const owner = "user-123";

      await CommentsTableTestHelper.addComment({
        id: commentId,
        content: "A comment",
        owner: user1.id,
      });

      const commentRepository = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepository.isCommentOwner(commentId, user1.id)).resolves.not.toThrow();
    });

    it("should throw AuthorizationError if the user is not the owner", async () => {
      // Arrange
      const { user1, user2 } = await initializeTestData();
      const commentId = "comment-123";

      await CommentsTableTestHelper.addComment({
        id: commentId,
        content: "A comment",
        owner: user1.id,
      });

      const commentRepository = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepository.isCommentOwner(commentId, user2.id)).rejects.toThrow(AuthorizationError);
    });
  });
});
