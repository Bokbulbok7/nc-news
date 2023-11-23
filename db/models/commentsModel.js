const db = require("../connection");
const { checkArticleExists } = require("./articlesModel");
const { checkUserExists } = require("./usersModel");

exports.selectCommentsByArticleId = (articleId) => {
  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`,
      [articleId]
    )
    .then((result) => {
      return result.rows;
    });
};

exports.insertCommentByArticleId = (articleId, newComment) => {
  const { username, body } = newComment;
  if (!username || !body)
    return Promise.reject({
      status: 400,
      msg: "Input should have username and body.",
    });
  return checkArticleExists(articleId)
    .then(() => {
      return checkUserExists(username);
    })
    .then(() => {
      return db.query(
        `INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *;`,
        [articleId, username, body]
      );
    })
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.checkCommentExists = (comment_id) => {
  return db
    .query("SELECT * FROM comments WHERE comment_id = $1;", [comment_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Comment not found." });
      }
      return result.rows;
    });
};

exports.removeCommentById = (comment_id) => {
  return db.query("DELETE FROM comments WHERE comment_id = $1;", [comment_id]);
};
