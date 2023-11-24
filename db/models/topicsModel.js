const db = require("../connection");

exports.selectTopics = () => {
  return db.query("SELECT * FROM topics;").then((result) => {
    return result.rows;
  });
};

exports.checkTopicExists = (topic) => {
  return db
    .query("SELECT slug FROM topics WHERE slug = $1;", [topic])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Topic not found." });
      }
      return result.rows;
    });
};
