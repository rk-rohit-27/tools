const multer = require('multer');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 3
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

module.exports = {
  upload,
  singleUpload: upload.single('image'),
  backgroundUpload: upload.fields([
    { name: 'foreground', maxCount: 1 },
    { name: 'backgroundImage', maxCount: 1 }
  ])
};