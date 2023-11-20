const { selectArticleById } = require("../models/articlesModel");

exports.getArticleById = (req, res, next) => {
  const { articleId } = req.params;
  selectArticleById(articleId)
    .then((article) => {
      res.status(200).json({ article });
    })
    .catch(next);
};
