const CommentRepository = require("../CommentRepository");

describe("CommentRepository interface", () => {
  it("should throw error when invoke abstract behavior", async () => {
    // Arrange
    const commentRepository = new CommentRepository();

    // Action and Assert
    await expect(commentRepository.addComment({})).rejects.toThrow("COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    await expect(commentRepository.deleteComment("")).rejects.toThrowError("COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    await expect(commentRepository.isCommentExist("", "")).rejects.toThrowError("COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    await expect(commentRepository.isCommentOwner("", "")).rejects.toThrowError("COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    await expect(commentRepository.getCommentsByThreadId("")).rejects.toThrowError("COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  });
});
