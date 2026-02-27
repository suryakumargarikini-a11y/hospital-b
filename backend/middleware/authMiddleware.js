const { readDB } = require('../utils/fileUtils');

const protect = (req, res, next) => {
  // Log all headers for debugging
  console.log('📨 Request Headers:', req.headers);
  
  const userId = req.headers['x-user-id'];
  console.log('🔑 User ID from header:', userId, 'Type:', typeof userId);
  
  if (!userId) {
    console.log('❌ No user ID in headers');
    return res.status(401).json({ message: 'Not authorized, no user ID' });
  }

  const db = readDB();
  const userIdNum = parseInt(userId);
  console.log('🔍 Looking for user with ID:', userIdNum);
  
  const user = db.users.find(u => u.id === userIdNum);
  
  if (!user) {
    console.log('❌ User not found for ID:', userIdNum);
    return res.status(401).json({ message: 'Not authorized, user not found' });
  }

  console.log('✅ User authenticated:', user.name);
  req.user = user;
  next();
};

module.exports = { protect };