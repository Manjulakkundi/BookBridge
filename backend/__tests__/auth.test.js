// backend/__tests__/auth.test.js
// Tests for sign-up and sign-in routes.
// supertest lets us fire real HTTP requests against our Express app
// without starting a live server.

const request  = require("supertest");
const mongoose = require("mongoose");

// Load env before importing app
process.env.JWT_SECRET  = "test_secret_for_jest_only";
process.env.NODE_ENV    = "test";
process.env.URI         = "mongodb://localhost:27017/bookbridge_test";

const app = require("../app");

beforeAll(async () => {
  await mongoose.connect(process.env.URI);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

// ─── Sign-Up tests ────────────────────────────────────────────────────────────
describe("POST /api/v1/sign-up", () => {
  it("returns 400 when username is too short", async () => {
    const res = await request(app).post("/api/v1/sign-up").send({
      username: "ab",
      email: "test@example.com",
      password: "password123",
      address: "123 Test St",
      phoneNumber: "9876543210",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("errors");
  });

  it("returns 400 when phone number is not 10 digits", async () => {
    const res = await request(app).post("/api/v1/sign-up").send({
      username: "validuser",
      email: "test2@example.com",
      password: "password123",
      address: "123 Test St",
      phoneNumber: "12345",
    });
    expect(res.statusCode).toBe(400);
  });

  it("returns 400 when email is invalid", async () => {
    const res = await request(app).post("/api/v1/sign-up").send({
      username: "validuser",
      email: "not-an-email",
      password: "password123",
      address: "123 Test St",
      phoneNumber: "9876543210",
    });
    expect(res.statusCode).toBe(400);
  });
});

// ─── Sign-In tests ────────────────────────────────────────────────────────────
describe("POST /api/v1/sign-in", () => {
  it("returns 400 when user does not exist", async () => {
    const res = await request(app).post("/api/v1/sign-in").send({
      email: "nobody@example.com",
      password: "wrongpassword",
    });
    expect(res.statusCode).toBe(400);
  });

  it("returns 400 when email field is missing", async () => {
    const res = await request(app).post("/api/v1/sign-in").send({
      password: "password123",
    });
    expect(res.statusCode).toBe(400);
  });
});

// ─── Protected route tests ────────────────────────────────────────────────────
describe("GET /api/v1/get-user-information", () => {
  it("returns 401 when no token is provided", async () => {
    const res = await request(app).get("/api/v1/get-user-information");
    expect(res.statusCode).toBe(401);
  });

  it("returns 403 when token is invalid", async () => {
    const res = await request(app)
      .get("/api/v1/get-user-information")
      .set("Authorization", "Bearer fake.invalid.token");
    expect(res.statusCode).toBe(403);
  });
});
