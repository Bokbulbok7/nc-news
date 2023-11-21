const db = require("../connection");

exports.selectArticleById = (articleId) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [articleId])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found." });
      }
      return result.rows[0];
    });
};

exports.selectArticles = (sort_by = "created_at") => {
  let queryString = `SELECT articles.author, articles.title, articles.article_id, articles.topic, 
  articles.created_at, articles.votes, articles.article_img_url, COUNT (comments.comment_id):: int AS comment_count
  FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id 
  GROUP BY  articles.author, articles.title, articles.article_id, articles.topic, 
  articles.created_at, articles.votes, articles.article_img_url
  ORDER BY articles.${sort_by} DESC;`;
  return db.query(queryString).then((data) => {
    return data.rows;
  });
};
