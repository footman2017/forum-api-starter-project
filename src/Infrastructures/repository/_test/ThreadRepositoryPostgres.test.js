const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const InvariantError = require("../../../Commons/exceptions/InvariantError");
const CreatedThread = require("../../../Domains/threads/entities/CreatedThread");
const CreateThread = require("../../../Domains/threads/entities/CreateThread");
// const RegisterUser = require('../../../Domains/users/entities/RegisterUser');
// const RegisteredUser = require('../../../Domains/users/entities/RegisteredUser');
const pool = require("../../database/postgres/pool");
const ThreadRepositoryPostgres = require("../ThreadRepositoryPostgres");
const UserRepositoryPostgres = require("../UserRepositoryPostgres");

describe("ThreadRepositoryPostgres", () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  // describe('verifyAvailableUsername function', () => {
  //   it('should throw InvariantError when username not available', async () => {
  //     // Arrange
  //     await UsersTableTestHelper.addUser({ username: 'dicoding' }); // memasukan user baru dengan username dicoding
  //     const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

  //     // Action & Assert
  //     await expect(userRepositoryPostgres.verifyAvailableUsername('dicoding')).rejects.toThrowError(InvariantError);
  //   });

  //   it('should not throw InvariantError when username available', async () => {
  //     // Arrange
  //     const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

  //     // Action & Assert
  //     await expect(userRepositoryPostgres.verifyAvailableUsername('dicoding')).resolves.not.toThrowError(InvariantError);
  //   });
  // });

  describe("createThread function", () => {
    it("should persist create thread and return created thread correctly", async () => {
      // Arrange
      const createThread = new CreateThread({
        title: "dicoding",
        body: "secret_password",
      });
      const fakeIdGenerator = () => "1"; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      // Action
      await threadRepositoryPostgres.createThread("user-123", createThread);

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadsById("thread-1");
      expect(threads).toHaveLength(1);
    });

    it("should return created thread correctly", async () => {
      // Arrange
      const createThread = new CreateThread({
        title: "dicoding",
        body: "secret_password",
      });
      const fakeIdGenerator = () => "1"; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      await UsersTableTestHelper.addUser({ username: 'dicoding' });

      // Action
      const creteadThread = await threadRepositoryPostgres.createThread("user-123", createThread);

      // Assert
      expect(creteadThread).toStrictEqual(
        new CreatedThread({
          id: "thread-1",
          title: "dicoding",
          owner: "user-123",
        })
      );
    });
  });

  // describe("getThreadById function", () => {
  //   it("should throw InvariantError when thread not found", async () => {
  //     // Arrange
  //     const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

  //     // Action & Assert
  //     await expect(threadRepositoryPostgres.getThreadById("thread-1")).rejects.toThrowError(InvariantError);
  //   });

  //   it("should return thread correctly", async () => {
  //     // Arrange
  //     await UsersTableTestHelper.addUser({ id: "user-321", username: "thread-1" });
  //     const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

  //     // Action
  //     const userId = await threadRepositoryPostgres.getThreadById("thread-1");

  //     // Assert
  //     expect(userId).toEqual("user-321");
  //   });
  // });

  // describe('getPasswordByUsername', () => {
  //   it('should throw InvariantError when user not found', () => {
  //     // Arrange
  //     const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

  //     // Action & Assert
  //     return expect(userRepositoryPostgres.getPasswordByUsername('dicoding'))
  //       .rejects
  //       .toThrowError(InvariantError);
  //   });

  //   it('should return username password when user is found', async () => {
  //     // Arrange
  //     const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});
  //     await UsersTableTestHelper.addUser({
  //       username: 'dicoding',
  //       password: 'secret_password',
  //     });

  //     // Action & Assert
  //     const password = await userRepositoryPostgres.getPasswordByUsername('dicoding');
  //     expect(password).toBe('secret_password');
  //   });
  // });

  // describe('getIdByUsername', () => {
  //   it('should throw InvariantError when user not found', async () => {
  //     // Arrange
  //     const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

  //     // Action & Assert
  //     await expect(userRepositoryPostgres.getIdByUsername('dicoding'))
  //       .rejects
  //       .toThrowError(InvariantError);
  //   });

  //   it('should return user id correctly', async () => {
  //     // Arrange
  //     await UsersTableTestHelper.addUser({ id: 'user-321', username: 'dicoding' });
  //     const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

  //     // Action
  //     const userId = await userRepositoryPostgres.getIdByUsername('dicoding');

  //     // Assert
  //     expect(userId).toEqual('user-321');
  //   });
  // });
});
