const {
  removeCommentById,
  checkCommentExists,
} = require("../models/commentsModel");

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  return checkCommentExists(comment_id)
    .then(() => {
      return removeCommentById(comment_id);
    })
    .then(() => {
      return res.status(204).send();
    })
    .catch(next);
};
