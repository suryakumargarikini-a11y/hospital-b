const { readDB, writeDB } = require('../utils/fileUtils');

const registerUser = (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const db = readDB();
  const existing = db.users.find(u => u.email === email);
  if (existing) return res.status(400).json({ message: 'Email already registered' });

  const newUser = {
    id: Date.now(),
    name,
    email,
    password, // In production, hash the password!
    role: 'patient',
  };

  db.users.push(newUser);
  writeDB(db);
  const { password: _, ...userWithoutPassword } = newUser;
  res.status(201).json(userWithoutPassword);
};

const loginUser = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }

  const db = readDB();
  const user = db.users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const { password: _, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
};

module.exports = { registerUser, loginUser };