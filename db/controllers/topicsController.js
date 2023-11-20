const { selectTopics } = require("../models/topics");

exports.getHealthcheck = (req, res) => {
  res.status(200).send({ msg: "All okay." });
};

exports.getTopics = (req, res, next) => {
  selectTopics()
    .then((topics) => {
      if (!topics || topics.length === 0) {
        return Promise.reject({ status: 404, message: "Topics not found" });
      }
      res.status(200).send({ topics: topics });
    })
    .catch(next);
};
