# ✅ Task Management System

A fullstack web application for managing tasks efficiently. Built with **React (Vite)** on the frontend, **Node.js + Express** on the backend, and **MySQL** as the relational database. It features CRUD operations, filtering, sorting, and production-ready deployment.

> 💼 Originally developed for a technical assessment, this project now stands as a modular, scalable, and testable productivity application.

---

## Table of Contents

1. [Overview](#overview)
   - [Quick Start](#quick-start)
   - [Notes](#notes)
2. [Database Documentation](#database-documentation)
   - [Database Schema](#database-schema)
   - [Database Configuration](#database-configuration)
3. [Backend Documentation](#backend-documentation)
   - [Tech Stack](#tech-stack)
   - [API Endpoints](#api-endpoints)
   - [How to Run Backend](#how-to-run-backend)
4. [Testing](#testing)
   - [Testing Framework Used](#testing-framework-used)
   - [Running Tests](#running-tests)
   - [Validation Scenarios](#validation-scenarios)
5. [Frontend Documentation](#front-end-documentation)
   - [Tech Stack](#tech-stack-1)
   - [Running Frontend in Development](#run-frontend-in-development-mode)
6. [Running in Production](#running-in-production)
   - [Setting Up Production](#important)
   - [Deployment Steps](#deploy-project)
   - [Accessing the Application](#access-your-application)
7. [Using the Application](#using-the-application)
   - [Adding a New Task](#add-new-task)
   - [Editing a Task](#edit-task)
   - [Marking a Task as Complete](#mark-complete)
   - [Deleting a Task](#delete-task)
   - [Sorting Tasks](#sort-by-desk)
   - [Filtering Completed or Pending Tasks](#completed-or-pending)

## Overview

This Task Management System allows users to:

- Create, edit, and delete tasks
- Assign due dates and track completion status
- Filter between completed/pending tasks
- Sort tasks by title or date
- Deploy the full system locally or to production

### Quick Start

1. Clone repo
2. Create `.env` in `server/` with MySQL credentials
3. `npm install` in root
4. `npm run install-both`
5. `npm run deploy`
6. Go to `http://localhost:3000`

### Notes

This project is a Task Management System built with:

- Backend: Node.js with Express
- Database: MySQL
- Frontend: React (with Vite)
- Styling: Bootstrap
- Build Tools: Vite
- Deployment: Served via Express as a static build in production.

this application was created using windows operating system. This application was also developed usind NODE Version 20.12.2

## Database Documentation

### Important

Make sure you have mysql installed in your device.

### Database Used

- Database Engine: MySQL
- Version: 8.0.41
- Table Name: tasks

### Database Schema

```sql
-- 1. Create database
CREATE DATABASE IF NOT EXISTS technical_test_pointstar;

-- 2. Use the created database
USE technical_test_pointstar;

-- 3. Create the 'tasks' table
CREATE TABLE `tasks` (
   `id` int NOT NULL AUTO_INCREMENT,
   `title` varchar(255) NOT NULL,
   `description` text NOT NULL,
   `due_date` date NOT NULL,
   `status` enum('Pending','Completed') NOT NULL DEFAULT 'Pending',
   `isDeleted` tinyint(1) DEFAULT NULL,
   PRIMARY KEY (`id`)
 ) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
```

### Database Configuration

Ensure you create a .env file inside the server/ folder and update the credentials to match your MySQL setup.

#### .env File Example

```env
PORT=3000
NODE_ENV=production

MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=technical_test_pointstar
```

## Backend Documentation

### Tech Stack

- Node.js (Express)
- MySQL2
- Axios (For API calls)
- Winston & Morgan (Logging)
- Express Validator (Input validation)

### API Endpoints

| HTTP Method | Endpoint       | Description                      |
| :---------- | :------------- | :------------------------------- |
| GET         | /api/tasks     | Fetch all tasks                  |
| POST        | /api/tasks     | Create a new task                |
| PUT         | /api/tasks/:id | Update an existing task          |
| DELETE      | /api/tasks/:id | Soft Delete an existing task     |
| PATCH       | /api/tasks/:id | Mark a task as completed/pending |

### How to Run Backend

- Install Dependencies
  ```cmd
  cd server
  npm install
  ```
- Run Server Locally
  ```cmd
  npm run dev
  ```
  - The backend runs on port 3000 (http://localhost:3000).
- To run backend in production mode

  - This Github page already have a front end built file in server/public. But if you want to build the production version everything from scartch, go to <a href="#running-in-production">running in production</a> chapter

  ```
  npm run start
  ```

## Testing

### overview

#### Testing Framework Used

- Jest
- Supertest (supertest) for API testing
- MySQL for database interactions

After installing the server. If you want to run the test script.

```
npm run test
```

### What is Being Tested?

Within this project i have three tests

1. middleware.test.js (to test errorHandler.js)
   - Testing error 500
2. test.test.js (to test test router)

   | HTTP Method | Endpoint    | Description      | Status |
   | ----------- | ----------- | ---------------- | ------ |
   | GET         | `/api/test` | Testing endpoint | ✅     |

3. task.test.js (main test, to test task router)

   | HTTP Method | Endpoint         | Description        | Status |
   | ----------- | ---------------- | ------------------ | ------ |
   | POST        | `/api/tasks`     | Create a new task  | ✅     |
   | GET         | `/api/tasks`     | Retrieve all tasks | ✅     |
   | PUT         | `/api/tasks/:id` | Update a task      | ✅     |
   | PATCH       | `/api/tasks/:id` | Update task status | ✅     |
   | DELETE      | `/api/tasks/:id` | Soft delete a task | ✅     |
   | POST        | `/randomurl`     | Test random Url    | ✅     |

### Validation Scenarios:

- Missing required fields (title, description, due_date)
- Invalid due_date format
- Invalid status values (must be "Completed" or "Pending")
- Handling non-existing tasks (404)
- Error 500 server
- Ensuring tasks are not deleted permanently (soft delete)

## Front-End Documentation

### Tech Stack

- React 19
- Vite (Build tool)
- Axios (API Calls)
- Bootstrap (UI Styling)
- Gsap (Animation)

#### Install Depedencies

```bash
cd client
npm install
```

#### Run Frontend in Development Mode

```bash
npm run dev
```

- The frontend runs on port 5173 (http://localhost:5173).

## Running In Production

In production, the same server hosts both the backend and the built React front end under http://localhost:3000.

### Important

To hasten the production I have <b>set a package.json</b> in root folder (technicaltest). Thus to run production you just need to

1. install everything

   ```bash
   npm install
   npm run install-both
   ```

2. deploy project
   ```bash
   npm run deploy
   ```
3. Access Your Application
   Open http://localhost:3000/ → Your React frontend should now load from the backend!

## Using the application

### Notes

I expect you already have a production site ready. to do it, go to <a href="#running-in-production">running in production chapter</a>

1. Add new task

   to add new image you need to fill out the title, description, and due date (higligted with red box). After filling the necessary detail, then you can click create task (blue button).
   ![Add New Task](./documentation/Create%20Task.png)

2. Edit task

   To edit task, there will be a button within the list 'EDIT'
   ![Edit Button](./documentation/Edit%20Button.png)
   After you clik, there will be a popup for you to edit the task
   ![Edit Popup](./documentation//Edit%20PopUp.png)
   Then you can edit it (please click save so that the changes saved to the database).

3. Mark Complete

   To mark complete or mark pending, you need to click the blue button.
   ![Mark Completed](./documentation//Mark%20Completed.png)

4. Delete Task

   To delete Task, all you need is to click the delete button
   ![Delete Task](./documentation/Delete%20Task.png)

5. Sort by desk
   To sort the task, all you need is click the 'sort by date' button
   ![Sort Task](./documentation/Sort%20Task.png)

6. Completed or Pending
   To sort by completed or pending, click the 'pending' or 'completed' button
   ![Complete or Pending](./documentation/Pending%20And%20Completed.png)
