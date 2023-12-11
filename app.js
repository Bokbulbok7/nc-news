const express = require("express");
const { getTopics } = require("./db/controllers/topicsController");
const { getEndpoints } = require("./db/controllers/endpointsController");
const { handleCustomErrors, handlePsqlErrors } = require("./db/error");
const {
  getArticleById,
  getArticles,
  getCommentsByArticleId,
  postCommentByArticleId,
  patchVotesByArticleId,
} = require("./db/controllers/articlesController");
const { deleteCommentById } = require("./db/controllers/commentsController");
const { getUsers } = require("./db/controllers/usersController");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

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
