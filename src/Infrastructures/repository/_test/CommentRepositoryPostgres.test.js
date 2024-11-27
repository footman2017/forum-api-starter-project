const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const AddedComment = require("../../../Domains/comments/entities/AddedComment");
const AddComment = require("../../../Domains/comments/entities/AddComment");
const pool = require("../../database/postgres/pool");
const CommentRepositoryPostgres = require("../CommentRepositoryPostgres");

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
      });

      await CommentsTableTestHelper.addComment({
        id: "comment-2",
        content: "comment 2",
        createdDate: "2024-11-24",
        thread: thread.id,
        owner: user2.id,
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
      });

      expect(comments[1]).toMatchObject({
        id: "comment-2",
        username: user2.username,
        content: "comment 2",
        date: "2024-11-24",
      });
    });
  });
});
