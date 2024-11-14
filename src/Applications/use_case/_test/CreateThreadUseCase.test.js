const CreatedThread = require("../../../Domains/threads/entities/CreatedThread");
const CreateThread = require("../../../Domains/threads/entities/CreateThread");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const CreateThreadUseCase = require("../CreateThreadUseCase");

describe("CreateThreadUseCase", () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it("should orchestrating the add thread action correctly", async () => {
    // Arrange
    const useCasePayload = {
      title: "dicoding",
      body: "secret",
    };

    const mockCreatedThread = new CreatedThread({
      id: "thread-123",
      title: useCasePayload.title,
      owner: "owner-1",
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.createThread = jest.fn().mockImplementation(() => Promise.resolve(mockCreatedThread));

    /** creating use case instance */
    const createThreadUseCase = new CreateThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const createdThread = await createThreadUseCase.execute("owner-1", useCasePayload);

    // Assert
    expect(createdThread).toStrictEqual(
      new CreatedThread({
        id: "thread-123",
        title: useCasePayload.title,
        owner: "owner-1",
      })
    );

    expect(mockThreadRepository.createThread).toBeCalledWith(
      "owner-1",
      new CreateThread({
        title: useCasePayload.title,
        body: useCasePayload.body,
      })
    );
  });
});
