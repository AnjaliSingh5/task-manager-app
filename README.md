# Task Manager (MERN + JWT Auth)

A full-stack task manager app: React frontend, Node.js/Express backend, MongoDB for storage, and JWT-based authentication so each user only sees their own tasks.

## Stack
- **Frontend:** React 18 (Vite), React Router, Axios
- **Backend:** Node.js, Express
- **Database:** MongoDB (Mongoose)
- **Auth:** JSON Web Tokens (JWT), bcrypt password hashing

## Project Structure
```
task-manager-app/
├── backend/
│   ├── models/        # User.js, Task.js (Mongoose schemas)
│   ├── routes/        # auth.js, tasks.js
│   ├── middleware/     # auth.js (JWT verification)
│   ├── server.js
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── components/ # Login, Register, TaskList, TaskForm
    │   ├── context/    # AuthContext.jsx
    │   ├── App.jsx
    │   └── main.jsx
    └── vite.config.js
```

## Prerequisites
- Node.js (v18+) installed
- A MongoDB database — easiest option is a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register), or a local MongoDB install

## 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
```
Open `.env` and fill in:
- `MONGO_URI` — your MongoDB connection string
- `JWT_SECRET` — any long random string (e.g. generate one with `openssl rand -hex 32`)

Run the backend:
```bash
npm run dev      # uses nodemon, auto-restarts on changes
# or
npm start
```
The API will run on `http://localhost:5000`.

## 2. Frontend Setup
In a new terminal:
```bash
cd frontend
npm install
npm run dev
```
The app will run on `http://localhost:5173` and proxy `/api` requests to the backend automatically (configured in `vite.config.js`).

## 3. Using the App
1. Open `http://localhost:5173`
2. Register a new account (name, email, password)
3. You'll be logged in automatically and redirected to your task list
4. Add, complete, and delete tasks — each task is tied to your account via JWT

## API Endpoints

| Method | Endpoint             | Auth required | Description                  |
|--------|-----------------------|:--------------:|-------------------------------|
| POST   | /api/auth/register     | No             | Create a new user account     |
| POST   | /api/auth/login        | No             | Log in, returns a JWT         |
| GET    | /api/tasks             | Yes            | Get all tasks for the user    |
| POST   | /api/tasks             | Yes            | Create a new task             |
| PUT    | /api/tasks/:id         | Yes            | Update a task                 |
| DELETE | /api/tasks/:id         | Yes            | Delete a task                 |

Protected routes expect a header: `Authorization: Bearer <token>`

## How Auth Works (for your interview/report notes)
1. On register/login, the backend hashes/checks the password with **bcrypt** and, if valid, signs a **JWT** containing the user's ID using `JWT_SECRET`.
2. The frontend stores this token in `localStorage` and attaches it to every API request via an Axios interceptor.
3. The backend's `auth` middleware verifies the token on every protected route and attaches `req.user.id`, which is used to filter tasks so users can only see/edit their own data.

## Possible Extensions
- Task categories/tags and due-date sorting
- Pagination or infinite scroll for large task lists
- Password reset via email
- Deploy backend (Render/Railway) + frontend (Vercel/Netlify) and connect to MongoDB Atlas
