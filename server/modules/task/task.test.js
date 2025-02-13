const supertest = require("supertest");
const pool = require("../../utils/db");
const { test, after, describe, beforeEach, before, afterEach } = require("node:test");
const assert = require("node:assert");

const app = require("../../app");
const api = supertest(app);

describe("Task API Tests", () => {
  let createdTaskId;

  before(async () => {
    await pool.query("DELETE FROM tasks");
  });

  describe("POST /api/tasks", () => {
    test("should create a new task when valid data is provided", async () => {
      const response = await api
        .post("/api/tasks")
        .send({
          title: "My Test Task",
          description: "This is a test task for testing",
          due_date: "25/12/2025",
        })
        .expect(201)
        .expect("Content-Type", /application\/json/);

      assert.strictEqual(response.body.message, "Task created");

      createdTaskId = response.body.id;
    });

    //! pagination is missing
    test("should return 400 if required fields are missing", async () => {
      const response = await api
        .post("/api/tasks")
        .send({
          // title is missing
          description: "This is a test task for testing",
          due_date: "25/12/2025",
        })
        .expect(400)
        .expect("Content-Type", /application\/json/);

      assert.strictEqual(response.body.errors[0].msg, "Title is required");
    });

    test("should return 400 if due_date has invalid format", async () => {
      const response = await api
        .post("/api/tasks")
        .send({
          title: "Invalid Date Task",
          description: "Testing invalid date format",
          due_date: "2025-25-12", // Wrong format (YYYY-DD-MM)
        })
        .expect(400)
        .expect("Content-Type", /application\/json/);

      assert.strictEqual(
        response.body.errors[0].msg,
        "Due date must be in dd/mm/yyyy format and a valid date"
      );
    });
  });

  describe(`GET /api/tasks`, () => {
    test("should retrieve all tasks (excluding soft-deleted ones)", async () => {
      const response = await api.get("/api/tasks").expect(200);

      const createdTask = response.body.find((t) => t.id === createdTaskId);

      assert.strictEqual(createdTask.title, "My Test Task");
    });
  });

  describe("PUT /api/tasks/:id", () => {
    test("should update an existing task when valid data is provided", async () => {
      const response = await api
        .put(`/api/tasks/${createdTaskId}`)
        .send({
          title: "Updated Test Task",
          description: "Updated description",
          due_date: "01/01/2026",
        })
        .expect(200)
        .expect("Content-Type", /application\/json/);

      assert.strictEqual(response.body.message, "Task updated");
    });

    test("should return 400 if required fields are missing on update", async () => {
      const response = await api
        .put(`/api/tasks/${createdTaskId}`)
        .send({
          // Missing description
          title: "Incomplete Task Data",
          due_date: "20/02/2025",
        })
        .expect(400)
        .expect("Content-Type", /application\/json/);

      assert.strictEqual(response.body.errors[0].msg, "Description is required");
    });

    test("should return 404 if task doesn't exist", async () => {
      const response = await api
        .put("/api/tasks/99999999")
        .send({
          title: "Non-existent",
          description: "Nope",
          due_date: "02/02/2026",
        })
        .expect(404)
        .expect("Content-Type", /application\/json/);

      assert.strictEqual(response.body.error, "No task found or no changes made");
    });
  });

  describe("PATCH /api/tasks/:id", () => {
    test("should mark task as completed", async () => {
      const response = await api
        .patch(`/api/tasks/${createdTaskId}`)
        .send({ status: "Completed" })
        .expect(200)
        .expect("Content-Type", /application\/json/);

      assert.strictEqual(response.body.message, "Task status updated to Completed");
    });

    test("should return 400 if status is invalid", async () => {
      const response = await api
        .patch(`/api/tasks/${createdTaskId}`)
        .send({ status: "done" })
        .expect(400)
        .expect("Content-Type", /application\/json/);

      assert.strictEqual(
        response.body.errors[0].msg,
        "status must be either 'Completed' or 'Pending'"
      );
    });

    test("should return 404 if task does not exist", async () => {
      const response = await api
        .patch("/api/tasks/99999999")
        .send({ status: "Completed" })
        .expect(404)
        .expect("Content-Type", /application\/json/);

      assert.strictEqual(response.body.error, "Task not found");
    });
  });

  describe("DELETE /api/tasks/:id", () => {
    test("should soft-delete an existing task", async () => {
      const response = await api
        .delete(`/api/tasks/${createdTaskId}`)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      assert.strictEqual(response.body.message, "Task deleted");
    });

    test("should return 404 if trying to delete a non-existing task", async () => {
      const response = await api
        .delete("/api/tasks/99999999")
        .expect(404)
        .expect("Content-Type", /application\/json/);

      assert.strictEqual(response.body.error, "Task not found");
    });
  });
});
