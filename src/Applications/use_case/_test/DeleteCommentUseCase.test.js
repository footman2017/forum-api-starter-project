const AddedComment = require("../../../Domains/comments/entities/AddedComment");
const AddComment = require("../../../Domains/comments/entities/AddComment");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const DeleteCommentUseCase = require("../DeleteCommentUseCase");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");

describe("DeleteCommentUseCase", () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it("should orchestrating the delete comment action correctly", async () => {
    // Arrange

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.isThreadExist = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.isCommentExist = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.isCommentOwner = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteComment = jest.fn().mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await deleteCommentUseCase.execute("user-2", "thread-1", "comment-1");

    // Assert
    expect(mockThreadRepository.isThreadExist).toBeCalledWith("thread-1");
    expect(mockCommentRepository.isCommentExist).toBeCalledWith("comment-1", "thread-1");
    expect(mockCommentRepository.isCommentOwner).toBeCalledWith("comment-1", "user-2");
    expect(mockCommentRepository.deleteComment).toBeCalledWith("comment-1");
  });
});
