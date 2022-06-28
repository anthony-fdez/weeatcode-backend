import { app } from "./../../../index";
import supertest from "supertest";
import sample from "./sample.json";

jest.setTimeout(30000);
const request = supertest(app);

describe("Register user", () => {
  test("Should create a new user", async () => {
    const res = await request.post("/users/signup").send(sample);
    const { statusCode, body } = res;
    expect(statusCode).toBe(200);
    expect(body.status).toBe("ok");
  });
});
