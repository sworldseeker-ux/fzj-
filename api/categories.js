const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');

module.exports = function handler(req, res) {
  try {
    const categoriesPath = path.join(DATA_DIR, 'categories.json');
    if (fs.existsSync(categoriesPath)) {
      const data = fs.readFileSync(categoriesPath, 'utf-8');
      res.status(200).json({ success: true, data: JSON.parse(data) });
    } else {
      res.status(404).json({ success: false, message: 'Categories not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
