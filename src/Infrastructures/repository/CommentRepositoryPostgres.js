const InvariantError = require("../../Commons/exceptions/InvariantError");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const AuthorizationError = require("../../Commons/exceptions/AuthorizationError");
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

  async getCommentsByThreadId(threadId) {
    const query = {
      text: `
        SELECT
          c.id,
          u.username,
          c.created_at::text as "date",
          c.deleted_at,
          c.content 
        FROM comments as c
        LEFT JOIN users as u ON u.id = c.owner
        WHERE c."threadId" = $1
        ORDER BY c.created_at ASC
      `,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async isCommentExist(commentId, threadId) {
    const query = {
      text: "SELECT * FROM comments WHERE id = $1",
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount || result.rows[0].deleted_at || result.rows[0].threadId !== threadId) {
      throw new NotFoundError("comment not found");
    }
  }

  async isCommentOwner(id, owner) {
    const query = {
      text: "SELECT owner FROM comments WHERE id = $1",
      values: [id],
    };

    const result = await this._pool.query(query);
    const comment = result.rows[0];

    if (comment.owner !== owner) {
      throw new AuthorizationError("not authorized");
    }
  }

  async deleteComment(id) {
    const query = {
      text: "UPDATE comments SET deleted_at = $1 WHERE id = $2 RETURNING id",
      values: [new Date().toISOString(), id],
    };

    await this._pool.query(query);
  }
}

module.exports = CommentRepositoryPostgres;
