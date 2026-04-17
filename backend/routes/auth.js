const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const Post = require('../models/Post')

// Register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  let user = await User.findOne({ email });
  if (user) return res.status(400).json({ msg: "User exists" });

  const hashed = await bcrypt.hash(password, 10);

  // ✅ Generate unique username
  const username = await generateUsername(name);

  user = new User({ name, email, password: hashed, username });
  await user.save();

  const token = jwt.sign({ id: user._id }, "secret123");

  res.json({ token, username });
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

  const token = jwt.sign({ id: user._id }, "secret123");

  res.json({ token: token, userId: user._id });
});


const generateUsername = async (name) => {
  let base = name.toLowerCase().replace(/\s+/g, "");
  let username;
  let exists = true;

  while (exists) {
    const random = Math.floor(1000 + Math.random() * 9000);
    username = `${base}${random}`;

    const user = await User.findOne({ username });
    if (!user) exists = false;
  }

  return username;
};

// routes/users.js
router.put("/follow/:userId", auth, async (req, res) => {
  const currentUser = await User.findById(req.user.id);

  const targetId = req.params.userId;

  const alreadyFollowing = currentUser.following.includes(targetId);

  if (alreadyFollowing) {
    // ❌ Unfollow
    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== targetId
    );
  } else {
    // ➕ Follow
    currentUser.following.push(targetId);
  }

  await currentUser.save();

  res.json({
    following: currentUser.following,
    isFollowing: !alreadyFollowing
  });
});


// get user info
router.get("/me", auth, async (req, res) => {
  try {
    // ✅ user data
    const user = await User.findById(req.user.id).select("-password");
    console.log(user, "user info")
    // ✅ post count
    const postCount = await Post.countDocuments({
      user: req.user.id
    });

    res.json({
      name: user.name,
      email: user.email,
      username: user.username,
      followersCount: user.followers.length,
      followingCount: user.following.length,
      postCount
    });

  } catch (err) {
    console.log(err , "erreon in me")
    res.status(500).json(err.message);
  }
});


module.exports = router;