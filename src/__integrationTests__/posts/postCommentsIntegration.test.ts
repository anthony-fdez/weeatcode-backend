import app from "../../app";
import supertest from "supertest";
// @ts-ignore This package does not support typescript
import randomEmail from "random-email";

jest.setTimeout(30000);
const request = supertest(app);

describe("Comments Integration", () => {
  const email = randomEmail();
  const password = "12345678";

  let userId: number;
  let loginToken: string;
  let postId: number;
  let commentId: number;

  let replyUserName: string;
  let replyUserId: number;

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

  describe("Test comments", () => {
    test("Should create a comment", async () => {
      const res = await request
        .post("/posts/comment/create")
        .set({
          Authorization: loginToken,
        })
        .send({
          postId,
          comment: "Test comment",
          createdByTest: true,
        });

      const { statusCode, body } = res;

      commentId = body.comment.id;
      replyUserName = body.comment.userName;
      replyUserId = body.comment.userId;

      expect(statusCode).toBe(200);
      expect(body.status).toBe("ok");
      expect(body.comment.edited).toBe(false);
      expect(body.comment.deleted).toBe(false);
      expect(body.comment.userId).toBe(userId);
      expect(body.comment.postId).toBe(postId);
    });

    test("Should edit the created comment", async () => {
      const res = await request
        .post("/posts/comment/edit")
        .set({
          Authorization: loginToken,
        })
        .send({
          commentId,
          newComment: "New Edited test comment",
          createdByTest: true,
        });

      const { statusCode, body } = res;

      expect(statusCode).toBe(200);
      expect(body.status).toBe("ok");
      expect(body.updatedComment.edited).toBe(true);
      expect(body.updatedComment.deleted).toBe(false);
      expect(body.updatedComment.userId).toBe(userId);
      expect(body.updatedComment.postId).toBe(postId);
    });

    test("Should reply to own comment", async () => {
      const res = await request
        .post("/posts/comment/create")
        .set({
          Authorization: loginToken,
        })
        .send({
          postId,
          replyCommentId: commentId,
          replyUserId,
          replyUserName,
          comment: "Reply to comment",
          createdByTest: true,
        });

      const { statusCode, body } = res;

      expect(statusCode).toBe(200);
      expect(body.status).toBe("ok");
      expect(body.comment.edited).toBe(false);
      expect(body.comment.deleted).toBe(false);
      expect(body.comment.userId).toBe(userId);
      expect(body.comment.postId).toBe(postId);
    });

    test("Should delete original comment", async () => {
      const res = await request
        .post("/posts/comment/delete")
        .set({
          Authorization: loginToken,
        })
        .send({
          commentId,
        });

      const { statusCode, body } = res;

      expect(statusCode).toBe(200);
      expect(body.status).toBe("ok");
    });
  });

  describe("Test comment votes", () => {
    test("Should upvote a post", async () => {
      const res = await request
        .post("/posts/comment/upvote")
        .set({
          Authorization: loginToken,
        })
        .send({
          commentId,
        });
      const { statusCode, body } = res;

      expect(statusCode).toBe(200);
      expect(body.status).toBe("ok");
      expect(body.message).toBe("Comment upVoted");
    });

    test("Should remove upvote", async () => {
      const res = await request
        .post("/posts/comment/upvote")
        .set({
          Authorization: loginToken,
        })
        .send({
          commentId,
        });

      const { statusCode, body } = res;

      expect(statusCode).toBe(200);
      expect(body.status).toBe("ok");
      expect(body.message).toBe("Comment upvote removed");
    });

    test("Should downvote a post", async () => {
      const res = await request
        .post("/posts/comment/downvote")
        .set({
          Authorization: loginToken,
        })
        .send({
          commentId,
        });

      const { statusCode, body } = res;

      expect(statusCode).toBe(200);
      expect(body.status).toBe("ok");
      expect(body.message).toBe("Comment downVoted");
    });

    test("Should remove downvote", async () => {
      const res = await request
        .post("/posts/comment/downvote")
        .set({
          Authorization: loginToken,
        })
        .send({
          commentId,
        });

      const { statusCode, body } = res;

      expect(statusCode).toBe(200);
      expect(body.status).toBe("ok");
      expect(body.message).toBe("Comment downvote removed");
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
