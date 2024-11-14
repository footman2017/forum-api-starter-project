const CreateThread = require("../../Domains/threads/entities/CreateThread");

class CreateThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(userId, useCasePayload) {
    const createThreadInstance = new CreateThread(useCasePayload);
    return this._threadRepository.createThread(userId, createThreadInstance);
  }
}

module.exports = CreateThreadUseCase;
