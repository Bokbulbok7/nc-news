const {
  selectArticleById,
  selectArticles,
} = require("../models/articlesModel");

exports.getArticleById = (req, res, next) => {
  const { articleId } = req.params;
  selectArticleById(articleId)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  const { sort_by } = req.query;
  selectArticles(sort_by)
    .then((articles) => {
      res.status(200).send({ articles: articles });
    })
    .catch(next);
};
