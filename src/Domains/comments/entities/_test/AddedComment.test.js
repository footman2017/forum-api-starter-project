const AddedComment = require("../AddedComment");

describe("a AddedComment entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload = {
      id: "comment-h_W1Plfpj0TY7wyT2PUPX",
      content: "sebuah comment",
    };

    // Action and Assert
    expect(() => new AddedComment(payload)).toThrow("ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY");
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      id: "comment-h_W1Plfpj0TY7wyT2PUPX",
      content: "sebuah comment",
      owner: 123,
    };

    // Action and Assert
    expect(() => new AddedComment(payload)).toThrow("ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION");
  });

  it("should create AddedComment object correctly", () => {
    // Arrange
    const payload = {
      id: "comment-h_W1Plfpj0TY7wyT2PUPX",
      content: "sebuah comment",
      owner: "user-DWrT3pXe1hccYkV1eIAxS",
    };

    // Action
    const createdThreadInstance = new AddedComment(payload);

    // Assert
    expect(createdThreadInstance.id).toEqual(payload.id);
    expect(createdThreadInstance.content).toEqual(payload.content);
    expect(createdThreadInstance.owner).toEqual(payload.owner);
  });
});
