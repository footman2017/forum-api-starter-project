const DetailComment = require("../DetailComment");

describe("a DetailComment entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload = {
      id: "comment-_pby2_tmXV6bcvcdev8xk",
      username: "johndoe",
      date: "2024-11-28T07:22:33.555Z",
      deleted_at: "2024-11-29T07:22:33.555Z",
    };

    // Action and Assert
    expect(() => new DetailComment(payload)).toThrow("DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY");
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      id: "comment-_pby2_tmXV6bcvcdev8xk",
      username: "johndoe",
      date: 123,
      content: "sebuah comment",
      deleted_at: "2024-11-29T07:22:33.555Z",
    };
    // Action and Assert
    expect(() => new DetailComment(payload)).toThrow("DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION");
  });

  it("should create DetailComment object correctly when deleted_at is not null", () => {
    // Arrange
    const payload = {
      id: "comment-_pby2_tmXV6bcvcdev8xk",
      username: "johndoe",
      date: "2024-11-28T07:22:33.555Z",
      content: "sebuah comment",
      deleted_at: "2024-11-29T07:22:33.555Z",
    };
    // Action
    const detailComment = new DetailComment(payload);

    // Assert
    expect(detailComment).toEqual({
      id: "comment-_pby2_tmXV6bcvcdev8xk",
      username: "johndoe",
      date: "2024-11-28T07:22:33.555Z",
      content: "**komentar telah dihapus**",
      deleted_at: "2024-11-29T07:22:33.555Z",
    });
  });

  it("should create DetailComment object correctly when deleted_at is null", () => {
    // Arrange
    const payload = {
      id: "comment-_pby2_tmXV6bcvcdev8xk",
      username: "johndoe",
      date: "2024-11-28T07:22:33.555Z",
      content: "sebuah comment",
      deleted_at: null,
    };
    // Action
    const detailComment = new DetailComment(payload);

    // Assert
    expect(detailComment).toEqual({
      id: "comment-_pby2_tmXV6bcvcdev8xk",
      username: "johndoe",
      date: "2024-11-28T07:22:33.555Z",
      content: "sebuah comment",
      deleted_at: null,
    });
  });
});
