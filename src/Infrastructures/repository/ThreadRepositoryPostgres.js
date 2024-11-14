const InvariantError = require("../../Commons/exceptions/InvariantError");
const CreatedThread = require("../../Domains/threads/entities/CreatedThread");
const RegisteredUser = require("../../Domains/users/entities/RegisteredUser");
const UserRepository = require("../../Domains/users/UserRepository");

class ThreadRepositoryPostgres extends UserRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  // async verifyAvailableUsername(username) {
  //   const query = {
  //     text: "SELECT username FROM users WHERE username = $1",
  //     values: [username],
  //   };

  //   const result = await this._pool.query(query);

  //   if (result.rowCount) {
  //     throw new InvariantError("username tidak tersedia");
  //   }
  // }

  async createThread(userId, dataThread) {
    const { title, body } = dataThread;
    const id = `thread-${this._idGenerator()}`;
    const createdDate = new Date().toISOString();

    const query = {
      text: "INSERT INTO threads VALUES($1, $2, $3, $4, $5, $6) RETURNING id, title, owner",
      values: [id, title, body, userId, createdDate, createdDate],
    };

    const result = await this._pool.query(query);

    return new CreatedThread({ ...result.rows[0] });
  }

  async getThreadById(threadId) {
    const query = {
      text: "SELECT * FROM threads WHERE id = $1",
      values: [threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError("thread tidak ditemukan");
    }

    const { id } = result.rows[0];

    return id;
  }

  // async getPasswordByUsername(username) {
  //   const query = {
  //     text: "SELECT password FROM users WHERE username = $1",
  //     values: [username],
  //   };

  //   const result = await this._pool.query(query);

  //   if (!result.rowCount) {
  //     throw new InvariantError("username tidak ditemukan");
  //   }

  //   return result.rows[0].password;
  // }

  // async getIdByUsername(username) {
  //   const query = {
  //     text: "SELECT id FROM users WHERE username = $1",
  //     values: [username],
  //   };

  //   const result = await this._pool.query(query);

  //   if (!result.rowCount) {
  //     throw new InvariantError("user tidak ditemukan");
  //   }

  //   const { id } = result.rows[0];

  //   return id;
  // }
}

module.exports = ThreadRepositoryPostgres;
