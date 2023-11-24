const app = require("../db/app");
const request = require("supertest");
const db = require("../db/connection");
const testData = require("../db/data/test-data");
const seed = require("../db/seeds/seed");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET/api/topics", () => {
  it("GET: 200 response with an array of all topic objects.", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});

describe("GET/api", () => {
  it("GET: 200 response with an object describing all available endpoints with description.", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveProperty("endpoints");
        const { endpoints } = body;
        const endpointsArr = Object.keys(endpoints);
        endpointsArr.forEach((endpoint) => {
          expect(endpoints[endpoint]).toMatchObject({
            description: expect.any(String),
            queries: expect.any(Array),
            exampleResponse: expect.any(Object),
          });
        });
      });
  });
});

describe("GET/api/articles/:articleId", () => {
  it("GET: 200 sends a single article to the client", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article.article_id).toBe(1);
        expect(article).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          body: expect.any(String),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
        });
      });
  });

  it("GET: 404 sends an appropriate status and error message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article not found.");
      });
  });

  it("GET: 400 sends an appropriate status and error message when given an invalid id", () => {
    return request(app)
      .get("/api/articles/not-an-article")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request.");
      });
  });
});

describe("GET/api/articles", () => {
  it("GET: 200 response with an array of all articles objects.", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(13);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
      });
  });

  it("GET: 200 response with an array of all objects sorted by date in descending order as default sort values.", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(13);
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
});

describe("GET/api/articles/:articleId/comments", () => {
  it("GET: 200 sends an array of comments belonging to a single article.", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toHaveLength(11);
        comments.forEach((comment) => {
          expect(comment.article_id).toBe(1);
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
          });
        });
      });
  });

  it("GET: 200 response with an array of all comments sorted by date in descending order as default sort values.", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toHaveLength(11);
        expect(comments).toBeSortedBy("created_at", { descending: true });
      });
  });

  it("GET: 404 sends an appropriate status and error message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/999/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article not found.");
      });
  });

  it("GET: 400 responds with an appropriate error message when given an invalid id", () => {
    return request(app)
      .get("/api/articles/not-an-id/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request.");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  it("POST: 201 should add a comment successfully.", () => {
    const newComment = {
      username: "lurker",
      body: "Great article!",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment.article_id).toBe(1);
        expect(comment.author).toBe("lurker");
        expect(comment.body).toBe("Great article!");
      });
  });

  it("POST: 400 should handle missing properties in the request body.", () => {
    const incompleteComment = {
      username: "lurker",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(incompleteComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Input should have username and body.");
      });
  });

  it("POST: 404 sends an appropriate status and error message when given a valid but non-existent id.", () => {
    const newComment = {
      username: "lurker",
      body: "Great article!",
    };
    return request(app)
      .post("/api/articles/569/comments")
      .send(newComment)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article not found.");
      });
  });

  it("POST: 400 should handle invalid article ID.", () => {
    const newComment = {
      username: "lurker",
      body: "Great article!",
    };
    return request(app)
      .post("/api/articles/invalid_article_id/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request.");
      });
  });

  it("POST: 404 should handle when user does not exist.", () => {
    const newComment = {
      username: "user1",
      body: "wrong user.",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("User not found.");
      });
  });

  it("POST: 200 should create a comment even if extra properties are passed.", () => {
    const newComment = {
      username: "lurker",
      body: "Great article!",
      extraProperty: "Extra info.",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment.article_id).toBe(1);
        expect(comment.author).toBe("lurker");
        expect(comment.body).toBe("Great article!");
        expect(comment).not.toHaveProperty("extraProperty");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  it("PATCH: 200 returns the updated article with the incremented votes by the given amount.", () => {
    const votes = { inc_votes: 5 };
    const expectedArticle = {
      article_id: 1,
      title: "Living in the shadow of a great man",
      topic: "mitch",
      author: "butter_bridge",
      body: "I find this existence challenging",
      created_at: "2020-07-09T21:11:00.000Z",
      votes: 105,
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    };

    return request(app)
      .patch("/api/articles/1")
      .send(votes)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual(expectedArticle);
      });
  });

  it("PATCH: 200 returns the updated article with the decremented votes by the given amount.", () => {
    const votes = { inc_votes: -7 };
    const expectedArticle = {
      article_id: 1,
      title: "Living in the shadow of a great man",
      topic: "mitch",
      author: "butter_bridge",
      body: "I find this existence challenging",
      created_at: "2020-07-09T21:11:00.000Z",
      votes: 93,
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    };
    return request(app)
      .patch("/api/articles/1")
      .send(votes)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual(expectedArticle);
      });
  });

  it("PATCH: 404 sends an appropriate status and error message when given a valid but non-existent id.", () => {
    const votes = { inc_votes: 10 };
    return request(app)
      .patch("/api/articles/999")
      .send(votes)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article not found.");
      });
  });

  it("PATCH: 400 should handle invalid article ID.", () => {
    const votes = { inc_votes: 10 };
    return request(app)
      .patch("/api/articles/not-an-article")
      .send(votes)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request.");
      });
  });

  it("PATCH: 400 should respond with 400 if inc_votes is empty.", () => {
    const votes = {};
    return request(app)
      .patch("/api/articles/1")
      .send(votes)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request.");
      });
  });

  it("PATCH: 400 should respond with 400 if inc_votes value is not a number.", () => {
    const votes = { inc_votes: "notANumber" };
    return request(app)
      .patch("/api/articles/1")
      .send(votes)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request.");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  it("DELETE: 204 deletes the comment by given comment ID.", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });

  it("DELETE: 400 should handle invalid comment ID.", () => {
    return request(app)
      .delete("/api/comments/not")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request.");
      });
  });

  it("DELETE: 404 sends an appropriate status and error message when given a valid but non-existent id.", () => {
    return request(app)
      .delete("/api/comments/1000")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Comment not found.");
      });
  });
});

describe("GET/api/users", () => {
  it("GET: 200 response with an array of all user objects.", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});

describe("GET/api/articles?topic", () => {
  it("GET: 200 responds with an article of a specific topic query.", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(12);
        articles.forEach((article) => {
          expect(article.topic).toBe("mitch");
          expect(article).toMatchObject({
            title: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            article_img_url: expect.any(String),
          });
        });
      });
  });

  it("GET: 200 responds with an empty array when there are no articles for the given topic.", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(0);
        expect(articles).toEqual([]);
      });
  });

  it("GET: 404 responds with an error message when topic doesn't exist.", () => {
    return request(app)
      .get("/api/articles?topic=abcd")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Topic not found.");
      });
  });
});

// describe("GET/api/articles/:article_id(comment_count)", () => {
//   it("GET: 200 sends an article for specific ID with added comment_count.", () => {
//     const expectedArticle = {
//       article_id: 1,
//       title: "Living in the shadow of a great man",
//       topic: "mitch",
//       author: "butter_bridge",
//       body: "I find this existence challenging",
//       created_at: "2020-07-09T21:11:00.000Z",
//       votes: 100,
//       article_img_url:
//         "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
//       comment_count: 11,
//     };
//     return request(app)
//       .get("/api/articles/1")
//       .expect(200)
//       .then(({ body }) => {
//         const { article } = body;
//         console.log(article);
//         expect(article).toEqual(expectedArticle);
//       });
//   });
// });
