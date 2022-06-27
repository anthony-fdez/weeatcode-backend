import supertest from "supertest";
import sample from "../sample.json";

jest.setTimeout(30000);
const port = 3001;
const url = `http://localhost:${port}`;
const request = supertest(url);

describe("Register user", () => {
  test("should create a new user", async () => {
    const res = await request.post("/users/signup").send(sample);
    const { statusCode, body } = res;
    expect(statusCode).toBe(200);
    expect(body.status).toBe("ok");
  });
});
