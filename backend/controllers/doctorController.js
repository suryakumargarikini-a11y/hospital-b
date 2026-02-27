const { readDB } = require('../utils/fileUtils');

const getDoctors = (req, res) => {
  try {
    const db = readDB();
    console.log('Doctors from DB:', db.doctors); // Debug log
    res.json(db.doctors); // Make sure this returns an array directly
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ message: 'Failed to fetch doctors' });
  }
};

module.exports = { getDoctors };