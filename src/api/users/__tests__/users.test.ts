import app from "../../../app";
import supertest from "supertest";
// @ts-ignore This package does not support typescript
import randomEmail from "random-email";

jest.setTimeout(30000);
const request = supertest(app);

describe("User Integration", () => {
  const email = randomEmail();
  const password = "12345678";
  let userId: number;
  let userToFollowId: number;
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

    test("Should create the user to follow", async () => {
      const res = await request.post("/users/signup").send({
        name: "Test Test",
        email: "2" + email,
        password: password,
        createdByTest: true,
      });

      const { statusCode, body } = res;

      expect(statusCode).toBe(200);
      expect(body.status).toBe("ok");

      expect(body.user.userId).toEqual(expect.any(Number));

      userToFollowId = body.user.userId;
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

  describe("Get user data", () => {
    test("Should get the data from the user created", async () => {
      const res = await request.post("/users/user_data").send({
        userId: userId,
      });

      const { statusCode, body } = res;

      expect(statusCode).toBe(200);
      expect(body.status).toBe("ok");
    });
  });

  describe("Follow users", () => {
    test("Should follow user", async () => {
      const res = await request
        .post("/users/follow")
        .send({
          userId: userToFollowId,
          userName: "test",
          followingUserName: "test",
        })
        .set({ Authorization: loginToken });

      const { statusCode, body } = res;

      expect(statusCode).toBe(200);
      expect(body.status).toBe("ok");
    });

    test("Should unfollow user", async () => {
      const res = await request
        .post("/users/follow")
        .send({
          userId: userToFollowId,
          userName: "test",
          followingUserName: "test",
        })
        .set({ Authorization: loginToken });

      const { statusCode, body } = res;

      console.log(res);

      expect(statusCode).toBe(200);
      expect(body.status).toBe("ok");
    });

    test("Should try to follow itself", async () => {
      const res = await request
        .post("/users/follow")
        .send({
          userId: userId,
          userName: "test",
        })
        .set({ Authorization: loginToken });

      const { statusCode, body } = res;

      console.log(res);

      expect(statusCode).toBe(400);
      expect(body.status).toBe("err");
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
    await new Promise((resolve: any) => setTimeout(() => resolve(), 500)); // avoid jest open handle error
  });
});
