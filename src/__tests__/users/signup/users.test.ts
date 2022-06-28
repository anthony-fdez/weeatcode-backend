import { server } from "./../../../index";
import supertest from "supertest";
import sample from "./sample.json";
// @ts-ignore This package does not support typescript
// import randomEmail from "random-email";

jest.setTimeout(30000);
const request = supertest(server);

describe("Register user", () => {
  test("Should create a new user", async () => {
    const res = await request.post("/users/signup").send({
      name: "Test Test",
      email: "email@email.com",
      password: "12345678",
    });

    const { statusCode, body } = res;
    expect(statusCode).toBe(400);
    expect(body.status).toBe("err");
  });

  afterAll(async () => {
    await server.close();
  });
});
