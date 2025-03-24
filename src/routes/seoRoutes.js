const express = require('express');
const { generateMetaTagsController } = require('../controllers/seo/metaController');
const { shortenURL, getLongURL } = require('../controllers/seo/urlShortnerController.js'); // Import URL shortener functions

const router = express.Router();

// ===============================
// Meta Tag Generation Routes
// ===============================

// Middleware to validate the article text for meta tag generation
const validateArticleText = (req, res, next) => {
  if (!req.body.article) {
    return res.status(400).json({ error: 'Article text is required.' });
  }
  next();
};

// Route to generate meta tags
router.post('/generate-meta-tags', validateArticleText, generateMetaTagsController);

// ===============================
// URL Shortener Routes
// ===============================

// Route to shorten a URL
router.post('/shorten', shortenURL);

// Route to redirect from a short URL to the original URL
router.get('/:shortUrl', getLongURL);

module.exports = router;
