const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const InvariantError = require("../../../Commons/exceptions/InvariantError");
const AddedComment = require("../../../Domains/comments/entities/AddedComment");
const AddComment = require("../../../Domains/comments/entities/AddComment");
const pool = require("../../database/postgres/pool");
const CommentRepositoryPostgres = require("../CommentRepositoryPostgres");

describe("CommentRepositoryPostgres", () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("addComment function", () => {
    it("should persist create comment and return added comment correctly", async () => {
      // Arrange
      const addComment = new AddComment({
        content: "dicoding",
      });
      const fakeIdGenerator = () => "1"; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      await UsersTableTestHelper.addUser({ username: "dicoding" });
      await ThreadsTableTestHelper.addThread({});
      // Action
      await commentRepositoryPostgres.addComment("user-123", "thread-1", addComment);

      // Assert
      const comments = await CommentsTableTestHelper.findCommentsById("comment-1");
      expect(comments).toHaveLength(1);
    });

    it("should return added comment correctly", async () => {
      // Arrange
      const addComment = new AddComment({
        content: "dicoding",
      });
      const fakeIdGenerator = () => "1"; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      await UsersTableTestHelper.addUser({ username: "dicoding" });
      await ThreadsTableTestHelper.addThread({});

      // Action
      const addedComment = await commentRepositoryPostgres.addComment("user-123", "thread-1", addComment);

      // Assert
      expect(addedComment).toStrictEqual(
        new AddedComment({
          id: "comment-1",
          content: "dicoding",
          owner: "user-123",
        })
      );
    });
  });

  describe("deleteComment function", () => {
    it("should persist delete comment correctly", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: "dicoding" });
      await ThreadsTableTestHelper.addThread({ id: "thread-1", owner: "dicoding" });
      await CommentsTableTestHelper.addComment({ id: "comment-1", threadId: "thread-1", owner: "dicoding" });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      await commentRepositoryPostgres.deleteComment("comment-1");

      // Assert
      const comments = await CommentsTableTestHelper.findCommentsById("comment-1");
      expect(comments).toHaveLength(1);
      expect(comments[0].deleted_at).toBeTruthy();
    });
  });
});
