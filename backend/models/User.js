const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  username: {
    type: String,
    unique: true
  },
  // models/User.js
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  followers: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
]
});

module.exports = mongoose.model('User', UserSchema);