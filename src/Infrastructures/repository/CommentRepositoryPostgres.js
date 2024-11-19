const InvariantError = require("../../Commons/exceptions/InvariantError");
const AddedComment = require("../../Domains/comments/entities/AddedComment");
const CommentRepository = require("../../Domains/comments/CommentRepository");

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(userId, threadId, dataThread) {
    const { content } = dataThread;
    const id = `comment-${this._idGenerator()}`;
    const createdDate = new Date().toISOString();

    const query = {
      text: "INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner",
      values: [id, content, userId, threadId, createdDate, createdDate],
    };

    const result = await this._pool.query(query);

    return new AddedComment({ ...result.rows[0] });
  }

  async getThreadById(threadId) {
    const query = {
      text: "SELECT * FROM comments WHERE id = $1",
      values: [threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError("thread tidak ditemukan");
    }

    const { id } = result.rows[0];

    return id;
  }
}

module.exports = CommentRepositoryPostgres;
