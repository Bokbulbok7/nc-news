const express = require("express");
const { getTopics } = require("./controllers/topicsController.js");
const { handleCustomErrors } = require("./error");

const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.use(handleCustomErrors);

module.exports = app;
