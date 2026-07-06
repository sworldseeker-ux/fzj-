const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');

module.exports = function handler(req, res) {
  try {
    const galleriesPath = path.join(DATA_DIR, 'galleries.json');
    if (fs.existsSync(galleriesPath)) {
      const data = fs.readFileSync(galleriesPath, 'utf-8');
      const galleries = JSON.parse(data);
      const categoryId = req.query.categoryId;
      if (categoryId && categoryId !== 'all') {
        const filtered = galleries.filter((g) => g.categoryId === categoryId);
        res.status(200).json({ success: true, data: filtered });
      } else {
        res.status(200).json({ success: true, data: galleries });
      }
    } else {
      res.status(404).json({ success: false, message: 'Galleries not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
