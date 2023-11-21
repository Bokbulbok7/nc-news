const db = require("../connection");

exports.selectCommentsByArticleId = (articleId) => {
  return db
    .query("SELECT * FROM comments WHERE article_id = $1;", [articleId])
    .then((result) => {
      return result.rows;
    });
};
