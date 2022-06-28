import { server } from "../../index";
import supertest from "supertest";
// @ts-ignore This package does not support typescript
import randomEmail from "random-email";

jest.setTimeout(30000);
const request = supertest(server);

describe("Integration", () => {
  const email = randomEmail();
  const password = "12345678";
  let userId: number;
  let loginToken: string;

  describe("Signup", () => {
    test("Should create new user", async () => {
      const res = await request.post("/users/signup").send({
        name: "Test Test",
        email: email,
        password: password,
        createdByTest: true,
      });

      const { statusCode, body } = res;

      expect(statusCode).toBe(200);
      expect(body.status).toBe("ok");

      expect(body.user.userId).toEqual(expect.any(Number));

      userId = body.user.userId;
    });
  });

  describe("Login", () => {
    test("It should log in the user", async () => {
      const res = await request.post("/users/login").send({
        email: email,
        password: password,
        createdByTest: true,
      });

      const { statusCode, body } = res;

      expect(statusCode).toBe(200);
      expect(body.status).toBe("ok");

      loginToken = body.token;
    });
  });

  describe("Delete", () => {
    test("It should delete the user", async () => {
      const res = await request
        .post("/users/delete")
        .set({ Authorization: loginToken });

      const { statusCode, body } = res;

      expect(statusCode).toBe(200);
      expect(body.status).toBe("ok");
    });
  });

  afterAll(async () => {
    await server.close();
  });
});
