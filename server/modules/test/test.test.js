const request = require("supertest");
const pool = require("../../utils/db");
const app = require("../../app");

describe("Test API Test", () => {
  test("should return 200", async () => {
    const response = await request(app).get("/api/test").expect(200);
    expect(response.text).toContain("<title>Test API</title>");
    expect(response.text).toContain("<h1>Successful Test API Call</h1>");
    expect(response.text).toContain("<p>Purpose: TEST API</p>");
  });
});
