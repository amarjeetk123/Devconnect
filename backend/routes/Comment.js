// routes/comments.js
const router = require('express').Router();
const auth = require("../middleware/auth");
const Comment = require("../models/Comment");

router.post("/:postId", auth, async (req, res) => {
  const comment = new Comment({
    post: req.params.postId,
    user: req.user.id,
    text: req.body.text
  });

  await comment.save();

  const populated = await comment.populate("user", "name username");

  res.json(populated);
});

router.get("/:postId", async (req, res) => {
  const comments = await Comment.find({ post: req.params.postId })
    .populate("user", "name username")
    .sort({ createdAt: -1 });

  res.json(comments);
});

module.exports = router;