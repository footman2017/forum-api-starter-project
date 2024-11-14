const CreatedThread = require("../CreatedThread");

describe("a CreatedThread entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload = {
      id: "thread-h_W1Plfpj0TY7wyT2PUPX",
      title: "sebuah thread",
    };

    // Action and Assert
    expect(() => new CreatedThread(payload)).toThrow("ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY");
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      id: "thread-h_W1Plfpj0TY7wyT2PUPX",
      title: "sebuah thread",
      owner: 123,
    };

    // Action and Assert
    expect(() => new CreatedThread(payload)).toThrow("ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION");
  });

  it("should create CreatedThread object correctly", () => {
    // Arrange
    const payload = {
      id: "thread-h_W1Plfpj0TY7wyT2PUPX",
      title: "sebuah thread",
      owner: "user-DWrT3pXe1hccYkV1eIAxS",
    };

    // Action
    const createdThreadInstance = new CreatedThread(payload);

    // Assert
    expect(createdThreadInstance.id).toEqual(payload.id);
    expect(createdThreadInstance.title).toEqual(payload.title);
    expect(createdThreadInstance.owner).toEqual(payload.owner);
  });
});
