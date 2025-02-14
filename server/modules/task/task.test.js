const request = require("supertest");
const pool = require("../../utils/db");
const app = require("../../app");

describe("Task API Tests", () => {
  // For global use
  let createdTaskId;

  beforeAll(async () => {
    await pool.query("DELETE FROM tasks");
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("POST /api/tasks", () => {
    test("should create a new task", async () => {
      const response = await request(app)
        .post("/api/tasks")
        .send({
          title: "my Test Task",
          description: "this is a test task for testing",
          due_date: "25/12/2025",
        })
        .expect(201)
        .expect("Content-Type", /application\/json/);

      expect(response.body.message).toBe("Task created");
      expect(response.body.id).toBeDefined();

      createdTaskId = response.body.id;
    });

    test("should return 400 When data is missing", async () => {
      const response = await request(app)
        .post("/api/tasks")
        .send({
          // missing title
          description: "This is a test task for testing",
          due_date: "25/12/2025",
        })
        .expect(400);

      expect(response.body.errors[0].msg).toBe("Title is required");
    });

    test("should return 400 if due_date has wrong format", async () => {
      const response = await request(app)
        .post("/api/tasks")
        .send({
          title: "Invalid Date Task",
          description: "Testing invalid date format",
          due_date: "2025-25-12", // should be dd/mm/yyyy
        })
        .expect(400);

      expect(response.body.errors[0].msg).toBe(
        "Due date must be in dd/mm/yyyy format and a valid date"
      );
    });
  });

  describe("GET /api/tasks", () => {
    test("should retrieve all tasks (excluding soft-deleted ones)", async () => {
      const response = await request(app).get("/api/tasks").expect(200);

      const createdTask = response.body.find((t) => t.id === createdTaskId);
      expect(createdTask).toBeDefined();
      expect(createdTask.title).toBe("my Test Task");
    });
  });

  describe("PUT /api/tasks/:id", () => {
    test("should update an existing task", async () => {
      const response = await request(app)
        .put(`/api/tasks/${createdTaskId}`)
        .send({
          title: "Updated Test Task",
          description: "Updated description",
          due_date: "01/01/2026",
        })
        .expect(200);

      expect(response.body.message).toBe("Task updated");
    });

    test("should return 400 if required fields are missing on update", async () => {
      const response = await request(app)
        .put(`/api/tasks/${createdTaskId}`)
        .send({
          title: "Incomplete Task Data",
          // description is missing
          due_date: "20/02/2025",
        })
        .expect(400);

      expect(response.body.errors[0].msg).toBe("Description is required");
    });

    test("should return 404 if task doesn't exist", async () => {
      const response = await request(app)
        .put("/api/tasks/99999999")
        .send({
          title: "Non-existent",
          description: "Nope",
          due_date: "02/02/2026",
        })
        .expect(404);

      expect(response.body.error).toBe("No task found or no changes made");
    });
  });

  describe("PATCH /api/tasks/:id", () => {
    test("should mark task as completed", async () => {
      const response = await request(app)
        .patch(`/api/tasks/${createdTaskId}`)
        .send({ status: "Completed" })
        .expect(200);

      expect(response.body.message).toBe("Task status updated to Completed");
    });

    test("should return 400 if status is invalid", async () => {
      const response = await request(app)
        .patch(`/api/tasks/${createdTaskId}`)
        .send({ status: "done" })
        .expect(400);

      expect(response.body.errors[0].msg).toBe("status must be either 'Completed' or 'Pending'");
    });

    test("should return 404 if task does not exist", async () => {
      const response = await request(app)
        .patch("/api/tasks/99999999")
        .send({ status: "Completed" })
        .expect(404);

      expect(response.body.error).toBe("Task not found");
    });
  });

  describe("DELETE /api/tasks/:id", () => {
    test("should soft-delete an existing task", async () => {
      const response = await request(app).delete(`/api/tasks/${createdTaskId}`).expect(200);

      expect(response.body.message).toBe("Task deleted");
    });

    test("should return 404 if trying to delete a non-existing task", async () => {
      const response = await request(app).delete("/api/tasks/99999999").expect(404);

      expect(response.body.error).toBe("Task not found");
    });
  });

  describe("POST /randomurl", () => {
    test("shoul return 404 if url is not defined", async () => {
      const response = await request(app).post("/api/randomurl");
      expect(response.body.error).toBe("unknown endpoint");
    });
  });
});
