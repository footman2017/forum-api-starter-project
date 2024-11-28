const DetailComment = require("../../Domains/comments/entities/DetailComment");
const DetailThread = require("../../Domains/threads/entities/DetailThread");

class GetDetailThreadUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(threadId) {
    const threadDetail = await this._threadRepository.getThreadById(threadId);
    const threadComments = await this._commentRepository.getCommentsByThreadId(threadId);
    const formatedComments = threadComments.map((threadComment) => new DetailComment(threadComment));

    threadDetail.comments = formatedComments;
    return new DetailThread(threadDetail);
  }
}

module.exports = GetDetailThreadUseCase;
