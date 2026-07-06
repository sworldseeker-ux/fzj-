const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../../data');

module.exports = function handler(req, res) {
  try {
    const galleriesPath = path.join(DATA_DIR, 'galleries.json');
    if (fs.existsSync(galleriesPath)) {
      const data = fs.readFileSync(galleriesPath, 'utf-8');
      const galleries = JSON.parse(data);
      const gallery = galleries.find((g) => g.id === req.query.id);
      if (gallery) {
        res.status(200).json({ success: true, data: gallery });
      } else {
        res.status(404).json({ success: false, message: 'Gallery not found' });
      }
    } else {
      res.status(404).json({ success: false, message: 'Galleries not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
