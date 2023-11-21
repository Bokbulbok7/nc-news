const express = require("express");
const { getTopics } = require("./controllers/topicsController");
const { getEndpoints } = require("./controllers/endpointsController");
const { handleCustomErrors, handlePsqlErrors } = require("./error");
const {
  getArticleById,
  getArticles,
} = require("./controllers/articlesController");

const app = express();

app.use(express.json());

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles/:articleId", getArticleById);

app.get("/api/articles", getArticles);

app.use(handleCustomErrors);

app.use(handlePsqlErrors);

module.exports = app;
