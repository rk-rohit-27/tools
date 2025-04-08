const express = require('express');
const essayController = require('../controllers/write/essayController');
const contentImproverController = require('../controllers/write/contentImproverController');
const paragraphWriterController = require('../controllers/write/paragraphWriterController');
const paragraphCompleterController = require('../controllers/write/paragraphCompleterController');
const storyGeneratorController = require('../controllers/write/storyGeneratorController');
const grammarFixerController = require('../controllers/write/grammarFixerController');
const contentSummarizerController = require('../controllers/write/contentSummarizerController');
const sentenceRewriterController = require('../controllers/write/sentenceRewriterController');
const articleWriterController = require('../controllers/write/articleWriterController');
const youtubeScriptWriterController = require('../controllers/write/youtubeScriptWriterController');
const emailWriterController = require('../controllers/write/emailWriterController')
const paragraphRewriterController = require('../controllers/write/paragraphRewriterController');

const router = express.Router();

router.get('/', (req, res) => {
    res.send("hello");
});
router.post('/essay', essayController.generateEssay);
router.post('/improver', contentImproverController.improveContent);
router.post('/paragraph', paragraphWriterController.generateParagraph);
router.post('/completer', paragraphCompleterController.completeParagraph);
router.post('/story', storyGeneratorController.generateStory);
router.post('/grammar', grammarFixerController.fixGrammar);
router.post('/summarizer', contentSummarizerController.summarizeContent);
router.post('/sentence', sentenceRewriterController.rewriteSentence);
router.post('/article', articleWriterController.writeArticle);
router.post('/youtube', youtubeScriptWriterController.writeYoutubeScript);
router.post('/email', emailWriterController.generateEmail);
router.post('/paragraph/rewrite', paragraphRewriterController.rewriteParagraph);

module.exports = router;
