const request = require("supertest");
const { apiRouter } = require("./routes");
const express = require("express");

const app = express();
app.use("/v1", apiRouter);

describe("Test GET requests", () => {
  test("requests respond with 200 success", async () => {
    const res = await request(app)
      .get("/v1/example")
      .set("Accept", "application/json");
    expect(res.status).toEqual(200);
    expect(res.headers["content-type"]).toMatch(/json/);
    expect(res.body.success).toEqual(true);
  });
});
