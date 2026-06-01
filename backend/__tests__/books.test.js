// backend/__tests__/books.test.js
// Tests for book routes — pagination, 404 handling, admin protection.

const request  = require("supertest");
const mongoose = require("mongoose");
const jwt      = require("jsonwebtoken");

process.env.JWT_SECRET = "test_secret_for_jest_only";
process.env.NODE_ENV   = "test";
process.env.URI        = "mongodb://localhost:27017/bookbridge_test";

const app  = require("../app");
const Book = require("../models/book.model");

// Create a fake admin token for protected route tests
const adminToken = jwt.sign(
  { userId: new mongoose.Types.ObjectId(), email: "admin@test.com", role: "admin" },
  process.env.JWT_SECRET,
  { expiresIn: "1h" }
);

// Create a fake user token (non-admin)
const userToken = jwt.sign(
  { userId: new mongoose.Types.ObjectId(), email: "user@test.com", role: "user" },
  process.env.JWT_SECRET,
  { expiresIn: "1h" }
);

beforeAll(async () => {
  await mongoose.connect(process.env.URI);
});

afterEach(async () => {
  await Book.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

// ─── Get all books ────────────────────────────────────────────────────────────
describe("GET /api/v1/get-all-books", () => {
  it("returns empty list when no books exist", async () => {
    const res = await request(app).get("/api/v1/get-all-books");
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveLength(0);
    expect(res.body.pagination.totalBooks).toBe(0);
  });

  it("returns books with pagination metadata", async () => {
    // Seed 3 books
    await Book.insertMany([
      { url: "http://a.com/1.jpg", title: "Book 1", author: "Author", price: 10, desc: "Description here", genre: "Fiction", language: "English" },
      { url: "http://a.com/2.jpg", title: "Book 2", author: "Author", price: 20, desc: "Description here", genre: "Fiction", language: "English" },
      { url: "http://a.com/3.jpg", title: "Book 3", author: "Author", price: 30, desc: "Description here", genre: "Fiction", language: "English" },
    ]);

    const res = await request(app).get("/api/v1/get-all-books?page=1&limit=2");
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.pagination.totalBooks).toBe(3);
    expect(res.body.pagination.totalPages).toBe(2);
    expect(res.body.pagination.hasNextPage).toBe(true);
  });
});

// ─── Add book ─────────────────────────────────────────────────────────────────
describe("POST /api/v1/add-book", () => {
  it("returns 401 when not authenticated", async () => {
    const res = await request(app).post("/api/v1/add-book").send({});
    expect(res.statusCode).toBe(401);
  });

  it("returns 403 when authenticated but not admin", async () => {
    const res = await request(app)
      .post("/api/v1/add-book")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ title: "Test", author: "Author", price: 10, url: "http://a.com/img.jpg", desc: "Long description here", language: "English", genre: "Fiction" });
    expect(res.statusCode).toBe(403);
  });

  it("returns 400 when required fields are missing", async () => {
    const res = await request(app)
      .post("/api/v1/add-book")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ title: "Only title" });
    expect(res.statusCode).toBe(400);
  });
});
