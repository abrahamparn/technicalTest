const pool = require("../../utils/db");

async function createTask({ title, description, due_date }) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const sql = `
      INSERT INTO tasks (title, description, due_date, status, isDeleted)
      VALUES (?, ?, ?, 'Pending', false)
    `;

    const [result] = await connection.execute(sql, [title, description, due_date]);

    await connection.commit();
    return result.insertId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

//! Pagination is missing
async function getAllTasks() {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [rows] = await connection.execute("SELECT * FROM tasks where isDeleted=false");

    await connection.commit();
    return rows;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function updateTask(id, title, description, due_date) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const sql = `
        UPDATE tasks
        SET title = ?, description = ?, due_date = ?
        WHERE id = ? AND isDeleted = false
      `;

    const [result] = await connection.execute(sql, [title, description, due_date, id]);

    await connection.commit();
    return result.affectedRows;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function deleteTask(id) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const sql = `
            UPDATE tasks
            SET isDeleted = true
            where id=?
            AND isDeleted = false
          `;

    const [result] = await connection.execute(sql, [id]);

    await connection.commit();
    return result.affectedRows;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function patchTaskStatus(id, status) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const sql = `
        UPDATE tasks
        SET status = ?
        WHERE id = ?
      `;
    const [result] = await connection.execute(sql, [status, id]);

    await connection.commit();
    return result.affectedRows;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = {
  createTask,
  getAllTasks,
  updateTask,
  deleteTask,
  patchTaskStatus,
};
