const db = require("../connection");

exports.selectArticleById = (articleId) => {
  return db
    .query(
      `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.body, articles.created_at, 
      articles.votes, articles.article_img_url, CAST(COUNT (comments.comment_id)AS INT) AS comment_count FROM articles 
      LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1
      GROUP BY articles.article_id;`,
      [articleId]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found." });
      }
      return result.rows[0];
    });
};

exports.selectArticles = (topic) => {
  const param = [];
  let queryString = `SELECT articles.author, articles.title, articles.article_id, articles.topic, 
  articles.created_at, articles.votes, articles.article_img_url, COUNT (comments.comment_id):: int AS comment_count
  FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id `;
  if (topic) {
    queryString += `WHERE articles.topic = $1 `;
    param.push(topic);
  }
  queryString += `GROUP BY articles.author, articles.title, articles.article_id, articles.topic, 
  articles.created_at, articles.votes, articles.article_img_url
  ORDER BY articles.created_at DESC;`;
  return db.query(queryString, param).then((data) => {
    return data.rows;
  });
};

exports.checkArticleExists = (articleId) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [articleId])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found." });
      }
      return result.rows;
    });
};

exports.updateVotesByArticleId = (articleId, inc_votes) => {
  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`,
      [inc_votes, articleId]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
