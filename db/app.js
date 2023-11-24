const express = require("express");
const { getTopics } = require("./controllers/topicsController");
const { getEndpoints } = require("./controllers/endpointsController");
const { handleCustomErrors, handlePsqlErrors } = require("./error");
const {
  getArticleById,
  getArticles,
  getCommentsByArticleId,
  postCommentByArticleId,
  patchVotesByArticleId,
} = require("./controllers/articlesController");
const { deleteCommentById } = require("./controllers/commentsController");
const { getUsers } = require("./controllers/usersController");

const app = express();

app.use(express.json());

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles/:articleId", getArticleById);

app.get("/api/articles", getArticles);

app.get("/api/articles/:articleId/comments", getCommentsByArticleId);

app.post("/api/articles/:articleId/comments", postCommentByArticleId);

app.patch("/api/articles/:articleId", patchVotesByArticleId);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.get("/api/users", getUsers);

app.use(handleCustomErrors);

app.use(handlePsqlErrors);

module.exports = app;
