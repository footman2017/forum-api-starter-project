const GetDetailThreadUseCase = require("../GetDetailThreadUseCase");
const DetailThread = require("../../../Domains/threads/entities/DetailThread");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const DetailComment = require("../../../Domains/comments/entities/DetailComment");

describe("GetDetailThreadUseCase", () => {
  // Mock Data
  const mockDetailThread = {
    id: "thread-1",
    title: "dicoding",
    body: "password",
    date: "2024-11-24T10:22:03.454Z",
    username: "sadddddd",
    owner: "user-1",
  };

  const mockComments = [
    {
      id: "comment-1",
      username: "sssdada",
      date: "2024-11-24T10:22:03.454Z",
      content: "a comment",
      deleted_at: null,
    },
    {
      id: "comment-2",
      username: "qweqwe",
      date: "2024-11-24T10:22:03.454Z",
      content: "**komentar telah dihapus**",
      deleted_at: "2024-11-24T10:22:03.454Z",
    },
  ];

  let mockThreadRepository, mockCommentRepository, getDetailThreadUseCase;

  beforeEach(() => {
    // Mock Repositories
    mockThreadRepository = new ThreadRepository();
    mockCommentRepository = new CommentRepository();

    // Mock Functions
    mockThreadRepository.isThreadExist = jest.fn(() => Promise.resolve());
    mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve(mockDetailThread));
    mockCommentRepository.getCommentsByThreadId = jest.fn(() => Promise.resolve(mockComments));

    // Use Case
    getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });
  });

  it("should orchestrate the get detail thread action correctly", async () => {
    // Action
    const threadDetail = await getDetailThreadUseCase.execute("thread-1");

    // Expected Data
    const expectedDetailThread = new DetailThread({
      id: "thread-1",
      title: "dicoding",
      body: "password",
      date: "2024-11-24T10:22:03.454Z",
      username: "sadddddd",
      owner: "user-1",
      comments: [
        new DetailComment({
          id: "comment-1",
          username: "sssdada",
          date: "2024-11-24T10:22:03.454Z",
          content: "a comment",
          deleted_at: null,
        }),
        new DetailComment({
          id: "comment-2",
          username: "qweqwe",
          date: "2024-11-24T10:22:03.454Z",
          content: "**komentar telah dihapus**",
          deleted_at: "2024-11-24T10:22:03.454Z",
        }),
      ],
    });

    // Assertions
    expect(threadDetail).toStrictEqual(expectedDetailThread);
    expect(mockThreadRepository.isThreadExist).toBeCalledWith("thread-1");
    expect(mockThreadRepository.getThreadById).toBeCalledWith("thread-1");
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith("thread-1");
  });
});
