const jwt  = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists) return res.status(400).json({ message: 'Email or username already in use' });

    const user = await User.create({ username, email, password });
    res.status(201).json({
      _id:      user._id,
      username: user.username,
      email:    user.email,
      token:    generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id:      user._id,
        username: user.username,
        email:    user.email,
        phone:    user.phone,
        avatar:   user.avatar,
        token:    generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (req.body.username && req.body.username !== user.username) {
      const taken = await User.findOne({ username: req.body.username });
      if (taken) return res.status(400).json({ message: 'Username already taken' });
      user.username = req.body.username;
    }
    user.phone  = req.body.phone  ?? user.phone;
    user.avatar = req.body.avatar ?? user.avatar;

    const updated = await user.save();
    res.json({
      _id:      updated._id,
      username: updated.username,
      email:    updated.email,
      phone:    updated.phone,
      avatar:   updated.avatar,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!(await user.matchPassword(oldPassword)))
      return res.status(400).json({ message: 'Old password is incorrect' });

    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { registerUser, loginUser, updateProfile, changePassword };
