const express = require("express");
const { getTopics } = require("./controllers/topicsController");
const { getEndpoints } = require("./controllers/endpointsController");
const { handleCustomErrors } = require("./error");

const app = express();

app.use(express.json());

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.use(handleCustomErrors);

module.exports = app;
