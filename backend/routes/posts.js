const router = require('express').Router();
const Post = require('../models/Post');
const auth = require('../middleware/auth');
const User = require('../models/User')
const jwt = require("jsonwebtoken");

// Create Post
router.post('/', auth, async (req, res) => {
  const post = new Post({
    user: req.user.id,
    text: req.body.text
  });

  await post.save();
  res.json(post);
});




router.get("/", async (req, res) => {
  try {
    let currentUser = null;

    const authHeader = req.header("Authorization");

    if (authHeader) {
      try {
        const token = authHeader.startsWith("Bearer ")
          ? authHeader.split(" ")[1]
          : authHeader;

        const decoded = jwt.verify(token, "secret123");
        currentUser = await User.findById(decoded.id);
      } catch (err) {
        // ignore invalid token
      }
    }

    const posts = await Post.find()
      .populate("user", "name username")
      .sort({ createdAt: -1 });

    const updatedPosts = posts.map(post => ({
      ...post._doc,
      isFollowing: currentUser
        ? currentUser.following.includes(post.user._id.toString())
        : false
    }));

    res.json(updatedPosts);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// routes/posts.js
router.put("/like/:postId", auth, async (req, res) => {
  const post = await Post.findById(req.params.postId);

  const userId = req.user.id;

  const alreadyLiked = post.likes.includes(userId);

  if (alreadyLiked) {
    // ❌ Unlike
    post.likes = post.likes.filter(
      (id) => id.toString() !== userId
    );
  } else {
    // ❤️ Like
    post.likes.push(userId);
  }

  await post.save();

  res.json({
    likes: post.likes.length,
    liked: !alreadyLiked
  });
});

module.exports = router;