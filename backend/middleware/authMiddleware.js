const User = require('../models/User');

const protect = async (req, res, next) => {
  const userId = req.headers['x-user-id'];

  if (!userId) {
    return res.status(401).json({ message: 'Not authorized, no user ID' });
  }

  const user = await User.findById(userId).select('-password');

  if (!user) {
    return res.status(401).json({ message: 'Not authorized, user not found' });
  }

  req.user = user;
  next();
};

module.exports = { protect };