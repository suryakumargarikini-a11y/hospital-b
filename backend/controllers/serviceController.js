const { readDB } = require('../utils/fileUtils');

const getServices = (req, res) => {
  const db = readDB();
  res.json(db.services);
};

module.exports = { getServices };