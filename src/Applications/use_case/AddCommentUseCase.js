const AddComment = require("../../Domains/comments/entities/AddComment");

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(userId, threadId, useCasePayload) {
    await this._threadRepository.isThreadExist(threadId);
    const addComment = new AddComment(useCasePayload);
    return this._commentRepository.addComment(userId, threadId, addComment);
  }
}

module.exports = AddCommentUseCase;
