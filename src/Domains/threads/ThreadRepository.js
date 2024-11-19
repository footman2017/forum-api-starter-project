class ThreadRepository {
  async createThread(userId, newThread) {
    throw new Error("THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async getThreadById(id) {
    throw new Error("THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async isThreadExist(id) {
    throw new Error("THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }
}

module.exports = ThreadRepository;
