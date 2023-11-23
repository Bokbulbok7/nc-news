const {
  selectArticleById,
  selectArticles,
  checkArticleExists,
  updateVotesByArticleId,
} = require("../models/articlesModel");
const {
  selectCommentsByArticleId,
  insertCommentByArticleId,
} = require("../models/commentsModel");

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

exports.getCommentsByArticleId = (req, res, next) => {
  const { articleId } = req.params;
  const commentPromises = [selectCommentsByArticleId(articleId)];
  if (articleId) {
    commentPromises.push(checkArticleExists(articleId));
  }
  Promise.all(commentPromises)
    .then((resolvedPromises) => {
      const comments = resolvedPromises[0];
      res.status(200).send({ comments: comments });
    })
    .catch(next);
};

exports.postCommentByArticleId = (req, res, next) => {
  const { articleId } = req.params;
  const newComment = req.body;
  return insertCommentByArticleId(articleId, newComment)
    .then((comment) => {
      return res.status(201).send({ comment });
    })
    .catch(next);
};

exports.patchVotesByArticleId = (req, res, next) => {
  const { articleId } = req.params;
  const { incVotes } = req.body;
  if (!incVotes && incVotes !== 0) {
    return res.status(400).json({ msg: "Bad request." });
  }
  Promise.all([
    checkArticleExists(articleId),
    updateVotesByArticleId(articleId, incVotes),
  ])
    .then((resolvedPromises) => {
      res.status(200).send({ article: resolvedPromises[1] });
    })
    .catch(next);
};
