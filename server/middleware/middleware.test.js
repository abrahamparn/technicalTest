const request = require("supertest");
const errorHandler = require("./errorHandler");

describe("ErrorHandler Middleware", () => {
  let mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  let mockNext = jest.fn();

  afterAll(() => {
    jest.clearAllMocks();
  });

  test("should log error and return 500 status in development mode", () => {
    process.env.NODE_ENV = "development";

    const error = new Error("Test error");
    errorHandler(error, {}, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: error.message,
      stack: error.stack,
    });
  });

  test("should log error and return 500 status in production mode", () => {
    process.env.NODE_ENV = "production";

    const error = new Error("Test error");
    errorHandler(error, {}, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Internal Server Error",
    });
  });
});
