const DetailThread = require("../DetailThread");

describe("DetailThread Entities", () => {
  describe("Validation", () => {
    it("should throw an error when payload does not contain all required properties", () => {
      // Arrange
      const payload = {
        id: "thread-1",
        title: "dicoding",
        body: "password",
        comments: [],
      };

      // Action & Assert
      expect(() => new DetailThread(payload)).toThrowError("DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY");
    });

    it("should throw an error when payload has invalid data types", () => {
      // Arrange
      const payload = {
        id: "thread-1",
        title: "dicoding",
        body: "password",
        date: 123, // Invalid type
        username: "dicoding",
        comments: "not-an-array", // Invalid type
      };

      // Action & Assert
      expect(() => new DetailThread(payload)).toThrowError("DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION");
    });
  });

  describe("Object Creation", () => {
    it("should create a DetailThread object correctly", () => {
      // Arrange
      const payload = {
        id: "thread-1",
        title: "dicoding",
        body: "password",
        date: "2024-11-24T10:22:03.454Z",
        username: "dicoding",
        comments: [],
      };

      const expectedDetailThread = {
        id: "thread-1",
        title: "dicoding",
        body: "password",
        date: "2024-11-24T10:22:03.454Z",
        username: "dicoding",
        comments: [],
      };

      // Action
      const threadDetail = new DetailThread(payload);

      // Assert
      expect(threadDetail).toBeInstanceOf(DetailThread);
      expect(threadDetail).toEqual(expectedDetailThread);
    });
  });
});
