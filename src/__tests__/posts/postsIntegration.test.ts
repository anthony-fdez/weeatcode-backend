import app from "../../app";
import supertest from "supertest";
// @ts-ignore This package does not support typescript
import randomEmail from "random-email";

jest.setTimeout(30000);
const request = supertest(app);

/// Fidel

// I need your help to figure out this error

// Jest has detected the following 5 open handles potentially keeping Jest from exiting:

//   ●  bound-anonymous-fn

//       40 |     test("Should create a new post", async () => {
//       41 |       const res = await request
//     > 42 |         .post("/posts/create_post")
//          |          ^
//       43 |         .set({
//       44 |           Authorization: loginToken,
//       45 |         })

// This is what i get when i run the tests, i think it does this cause i'm not closing the server
// i don't know how to close it tho, since i'm not using the server variable but the app instance instead
// I had to separate the index.ts file into server.ts and app.ts, this is so we are able to only use the express app
// without having to create a server. I think we need to create the server in each tests file, instead of passing the app

// this shit has me fucked up man lol

describe("Posts Integration", () => {
  const email = randomEmail();
  const password = "12345678";

  let userId: number;
  let loginToken: string;
  let postId: number;

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
      loginToken = body.token;
    });
  });

  describe("Create Post", () => {
    test("Should create a new post", async () => {
      const res = await request
        .post("/posts/create_post")
        .set({
          Authorization: loginToken,
        })
        .send({
          title: "Test post",
          body: "Test post",
          createdByTest: true,
        });

      const { statusCode, body } = res;

      expect(statusCode).toBe(200);
      expect(body.status).toBe("ok");
      expect(body.post.createdByTest).toBe(true);

      postId = body.post.id;
    });
  });

  describe("Interact with post", () => {
    test("Should upvote post", async () => {
      const res = await request
        .post("/posts/upvote")
        .set({
          Authorization: loginToken,
        })
        .send({
          postId: postId,
          createdByTest: true,
        });

      const { statusCode, body } = res;

      expect(statusCode).toBe(200);
      expect(body.status).toBe("ok");
    });

    test("Should downvote post", async () => {
      const res = await request
        .post("/posts/downvote")
        .set({
          Authorization: loginToken,
        })
        .send({
          postId: postId,
          createdByTest: true,
        });

      const { statusCode, body } = res;

      expect(statusCode).toBe(200);
      expect(body.status).toBe("ok");
    });

    test("Should edit post", async () => {
      const res = await request
        .post("/posts/edit")
        .set({
          Authorization: loginToken,
        })
        .send({
          title: "New title",
          body: "New body",
          postId: postId,
        });

      const { statusCode, body } = res;

      expect(statusCode).toBe(200);
      expect(body.status).toBe("ok");
    });

    test("Should get post by id", async () => {
      const res = await request
        .post("/posts/get_by_id")
        .set({
          Authorization: loginToken,
        })
        .send({
          postId: postId,
        });

      const { statusCode, body } = res;

      expect(statusCode).toBe(200);
      expect(body.status).toBe("ok");
    });
  });

  describe("Test voting", () => {
    test("Should upvote a post", async () => {
      const res = await request
        .post("/posts/upvote")
        .set({
          Authorization: loginToken,
        })
        .send({
          postId: postId,
        });

      const { statusCode, body } = res;

      expect(statusCode).toBe(200);
      expect(body.status).toBe("ok");
    });

    test("Post should be upVoted", async () => {
      const res = await request
        .post("/posts/get_by_id")
        .set({
          Authorization: loginToken,
        })
        .send({
          postId: postId,
        });

      const { statusCode, body } = res;

      expect(statusCode).toBe(200);
      expect(body.status).toBe("ok");
      expect(body.upVoted).toBe(true);
    });

    test("Should remove upvote", async () => {
      const res = await request
        .post("/posts/upvote")
        .set({
          Authorization: loginToken,
        })
        .send({
          postId: postId,
        });

      const { statusCode, body } = res;

      expect(statusCode).toBe(200);
      expect(body.status).toBe("ok");
    });

    test("Post upvote should have been removed", async () => {
      const res = await request
        .post("/posts/get_by_id")
        .set({
          Authorization: loginToken,
        })
        .send({
          postId: postId,
        });

      const { statusCode, body } = res;

      expect(statusCode).toBe(200);
      expect(body.status).toBe("ok");
      expect(body.upVoted).toBe(false);
    });

    test("Should downvote a post", async () => {
      const res = await request
        .post("/posts/downvote")
        .set({
          Authorization: loginToken,
        })
        .send({
          postId: postId,
        });

      const { statusCode, body } = res;

      expect(statusCode).toBe(200);
      expect(body.status).toBe("ok");
    });

    test("Post should be downVoted", async () => {
      const res = await request
        .post("/posts/get_by_id")
        .set({
          Authorization: loginToken,
        })
        .send({
          postId: postId,
        });

      const { statusCode, body } = res;

      expect(statusCode).toBe(200);
      expect(body.status).toBe("ok");
      expect(body.downVoted).toBe(true);
    });

    test("Should remove downvote", async () => {
      const res = await request
        .post("/posts/downvote")
        .set({
          Authorization: loginToken,
        })
        .send({
          postId: postId,
        });

      const { statusCode, body } = res;

      expect(statusCode).toBe(200);
      expect(body.status).toBe("ok");
    });

    test("Post upvote should have been removed", async () => {
      const res = await request
        .post("/posts/get_by_id")
        .set({
          Authorization: loginToken,
        })
        .send({
          postId: postId,
        });

      const { statusCode, body } = res;

      expect(statusCode).toBe(200);
      expect(body.status).toBe("ok");
      expect(body.downVoted).toBe(false);
    });
  });

  describe("Delete created records", () => {
    test("Should delete the post", async () => {
      const res = await request
        .post("/posts/delete")
        .set({
          Authorization: loginToken,
        })
        .send({
          postId: postId,
        });

      const { statusCode, body } = res;

      expect(statusCode).toBe(200);
      expect(body.status).toBe("ok");
    });

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
