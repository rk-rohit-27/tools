const express = require('express');
const { bgRemoveController, applyBackgroundController } = require('../controllers/image/bgRemoverController');
const { singleUpload, backgroundUpload } = require('../middleware/multer');
const router = express.Router();
const { pdfToJpgController, uploadPdf } = require('../controllers/image/pdftojpgController'); // Import uploadPdf

// Background removal route
router.post('/bgremover',
  singleUpload,
  (req, res, next) => {
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload an image.' });
    }
    next();
  },
  bgRemoveController
);

// Apply background route
router.post('/applyBackground',
  backgroundUpload,
  (req, res, next) => {
    if (!req.files?.foreground) {
      return res.status(400).json({ error: 'Foreground image is required' });
    }
    next();
  },
  applyBackgroundController
);

// PDF to JPG route
router.post('/pdftojpg',
  uploadPdf, // Add the uploadPdf middleware here
  pdfToJpgController
);

module.exports = router;