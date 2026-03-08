const User = require('../models/User');
const { OAuth2Client } = require('google-auth-library');

// We configure the client ID from the environment.
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc    Register a new user
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: 'Email already registered' });

  const newUser = await User.create({ name, email, password, role: 'patient' });

  res.status(201).json({
    _id: newUser._id,
    id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
  });
};

// @desc    Login user
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }

  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  res.json({
    _id: user._id,
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
};
// @desc    Google Sign-In / Register
// @route   POST /api/auth/google
const googleAuth = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: 'Google Token is required' });
  }

  try {
    // Verify the token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name } = payload;

    // Check if user already exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create a new user if they don't exist
      user = await User.create({
        name,
        email,
        authProvider: 'google',
        role: 'patient'
      });
    }

    res.status(200).json({
      _id: user._id,
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      authProvider: user.authProvider
    });

  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(401).json({ message: 'Invalid Google Token' });
  }
};

module.exports = { registerUser, loginUser, googleAuth };