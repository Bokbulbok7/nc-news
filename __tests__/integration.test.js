const app = require("../db/app");
const request = require("supertest");
const db = require("../db/connection");
const testData = require("../db/data/test-data");
const seed = require("../db/seeds/seed");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET/api/topics", () => {
  it("GET 200 response with an array of all topic objects.", () => {
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
  it("GET 200 response with an object describing all available endpoints with description.", () => {
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
  it("GET:200 sends a single article to the client", () => {
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

  it("GET:404 sends an appropriate status and error message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article not found.");
      });
  });

  it("GET:400 sends an appropriate status and error message when given an invalid id", () => {
    return request(app)
      .get("/api/articles/not-an-article")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request.");
      });
  });
});

describe("GET/api/articles", () => {
  it("GET 200 response with an array of all articles objects.", () => {
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

  it("POST: 404 sends an appropriate status and error message when given a valid but non-existent id", () => {
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

  it("POST 404: should handle when user does not exist.", () => {
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

  it("should create a comment even if extra properties are passed", () => {
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
