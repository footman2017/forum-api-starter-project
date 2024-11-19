const AddedComment = require("../../../Domains/comments/entities/AddedComment");
const AddComment = require("../../../Domains/comments/entities/AddComment");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const AddCommentUseCase = require("../AddCommentUseCase");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");

describe("AddCommentUseCase", () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it("should orchestrating the add comment action correctly", async () => {
    // Arrange
    const useCasePayload = {
      content: "dicoding",
    };

    const mockAddedComment = new AddedComment({
      id: "comment-123",
      content: useCasePayload.content,
      owner: "owner-1",
    });

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.isThreadExist = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.addComment = jest.fn().mockImplementation(() => Promise.resolve(mockAddedComment));

    /** creating use case instance */
    const getCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedComment = await getCommentUseCase.execute("owner-1", "thread-1", useCasePayload);

    // Assert
    expect(addedComment).toStrictEqual(
      new AddedComment({
        id: "comment-123",
        content: useCasePayload.content,
        owner: "owner-1",
      })
    );

    expect(mockThreadRepository.isThreadExist).toBeCalledWith("thread-1");
    expect(mockCommentRepository.addComment).toBeCalledWith(
      "owner-1",
      "thread-1",
      new AddComment({
        content: useCasePayload.content,
      })
    );
  });
});
