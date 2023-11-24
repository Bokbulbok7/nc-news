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
const { checkTopicExists } = require("../models/topicsModel");

exports.getArticleById = (req, res, next) => {
  const { articleId } = req.params;
  selectArticleById(articleId)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  const { topic } = req.query;
  if (topic) {
    Promise.all([checkTopicExists(topic), selectArticles(topic)])
      .then(([topicResult, articles]) => {
        res.status(200).send({ articles });
      })
      .catch(next);
  } else {
    selectArticles(topic)
      .then((articles) => {
        res.status(200).send({ articles: articles });
      })
      .catch(next);
  }
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
  const { inc_votes } = req.body;
  if (!inc_votes && inc_votes !== 0) {
    return res.status(400).json({ msg: "Bad request." });
  }
  Promise.all([
    checkArticleExists(articleId),
    updateVotesByArticleId(articleId, inc_votes),
  ])
    .then((resolvedPromises) => {
      res.status(200).send({ article: resolvedPromises[1] });
    })
    .catch(next);
};
