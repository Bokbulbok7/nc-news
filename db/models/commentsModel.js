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
