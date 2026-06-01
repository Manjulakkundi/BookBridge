# BookBridge 📚

A full-stack e-commerce bookstore built with the MERN stack.

---

## Features

- **Sign-up with OTP** — Email verification using a secure random OTP
- **JWT Authentication** — Stateless auth with role-based access control
- **Browse & Search** — Paginated book listing with genre and language filters
- **Cart** — Add/remove books, place orders in one click
- **Favourites** — Save books to a personal wishlist
- **Reviews** — Star ratings and comments on each book
- **Order History** — Track your past orders with live status
- **Admin Panel** — Add, edit, delete books; update order statuses
- **CI/CD** — GitHub Actions pipeline that tests and builds on every push

---

## Tech Stack

| Layer     | Technology                                     |
|-----------|------------------------------------------------|
| Frontend  | React 19, Redux Toolkit, Tailwind CSS, Framer Motion, Vite |
| Backend   | Node.js, Express.js                            |
| Database  | MongoDB (local via Compass or Atlas)           |
| Auth      | JWT, bcrypt, OTP via Nodemailer                |
| Testing   | Jest, Supertest                                |
| DevOps    | GitHub Actions, Render                         |

---

## Project Structure

```
BookBridge/
├── backend/
│   ├── __tests__/          # Jest test files
│   ├── connection/         # MongoDB connection
│   ├── controllers/        # Business logic (MVC controllers)
│   ├── middleware/         # auth, adminOnly, errorHandler, validate
│   ├── models/             # Mongoose schemas
│   ├── routes/             # Express route definitions
│   ├── utils/              # AppError, sendEmail
│   ├── app.js              # Express app (no listen — for testability)
│   └── server.js           # Starts the HTTP server
│
├── frontend/
│   └── src/
│       ├── components/     # Reusable UI (Navbar, Footer, BookCard, Loader)
│       ├── pages/          # Route-level page components
│       ├── stores/         # Redux store and slices
│       └── utils/          # Axios API instance (no hardcoded localhost)
│
├── .github/workflows/      # CI/CD pipeline
└── .gitignore
```

---

## Local Setup (Windows)

### Prerequisites
- Node.js 18+ — https://nodejs.org
- MongoDB Community — https://www.mongodb.com/try/download/community
- Open MongoDB Compass and connect to `mongodb://localhost:27017`

---

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/BookBridge.git
cd BookBridge
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Copy the env template and fill in your values:

```bash
copy .env.example .env
```

Open `.env` and set:
- `URI` — keep as `mongodb://localhost:27017/BookBridge` for local
- `JWT_SECRET` — generate one by running:
  ```bash
  node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
  ```
- `EMAIL_USER` — your Gmail address
- `EMAIL_PASS` — your Gmail App Password (not your real password)
  - Go to: Google Account → Security → 2-Step Verification → App Passwords → Create

Start the backend:
```bash
npm run dev
# Server running at http://localhost:5000
```

### 3. Set up the frontend

```bash
cd ../frontend
npm install
npm run dev
# App running at http://localhost:5173
```

### 4. Create your first admin user

After signing up normally, open MongoDB Compass:
1. Connect to `mongodb://localhost:27017`
2. Open the `BookBridge` database → `users` collection
3. Find your user document
4. Edit the `role` field from `"user"` to `"admin"`
5. Save — you now have admin access

---

## Running Tests

```bash
cd backend
npm test
```

---

## Environment Variables

See `backend/.env.example` for all required variables and setup instructions.

---

## GitHub Actions Secrets

Add these in: GitHub repo → Settings → Secrets and variables → Actions → New repository secret

| Secret          | Value                                   |
|-----------------|-----------------------------------------|
| `JWT_SECRET`    | Same long random string as your .env   |
| `VITE_API_URL`  | Your deployed Render backend URL        |
