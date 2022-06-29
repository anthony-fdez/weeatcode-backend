import { server } from "../../index";
import supertest from "supertest";
// @ts-ignore This package does not support typescript
import randomEmail from "random-email";

jest.setTimeout(30000);
const request = supertest(server);

describe("User Integration", () => {
  const email = randomEmail();
  const password = "12345678";
  let userId: number;
  let loginToken: string;

  //Create user
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

  describe("Logout", () => {
    test("It should log out the user", async () => {
      const res = await request
        .post("/users/logout")
        .set({ Authorization: loginToken });

      const { statusCode, body } = res;

      expect(statusCode).toBe(200);
      expect(body.status).toBe("ok");

      loginToken = "";
    });
  });

  // Need to login again to be able to test the delete endpoint below
  // since the token was removed when log out

  describe("Login", () => {
    test("It should log in the user again", async () => {
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

  afterAll(() => {
    server.close();
  });
});
