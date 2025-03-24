const OpenAI = require("openai");
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.writeArticle = async (req, res) => {
  const { topic, tone } = req.body; // Only topic and tone are expected

  if (!topic || !tone) {
    return res.status(400).json({ error: 'Topic and tone are required.' }); // Updated error message
  }

  try {
    const seoFriendlyArticle = await generateSEOArticle(topic, tone); // Content removed from function call
    res.json({ message: 'Article generated successfully!', article: seoFriendlyArticle });
  } catch (error) {
    console.error('Error writing article:', error);
    res.status(500).json({ error: 'Failed to generate article.' });
  }
};

const generateSEOArticle = async (topic, tone) => { // Content removed from function parameters
  const prompt = `
   Write an SEO-optimized and valued article about "${topic}" in a "${tone}" tone. 
    Include a (H1), headings (H2, H3, H4), paragraphs (P), and lists (UL, LI) where appropriate.
    Format the response as plain HTML elements without any surrounding HTML document structure.
  `; 
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "user", content: prompt },
    ],
    max_tokens: 1000,
    temperature: 0.7,
  });

  const articleContent = completion.choices[0].message.content.trim();
  return articleContent;
};

/*
SOP for Article Writer Controller
- Purpose: Handles article generation requests and generates an SEO-friendly article using OpenAI API.
- Inputs: 
  - topic: A string containing the article topic.
  - tone: A string indicating the tone of the article.
- Outputs: 
  - A JSON response indicating success or failure, along with the generated article.
- Instructions: 
  1. Send a POST request to /api/write/article with a JSON body containing the topic and tone.
  2. The response will include a success message and the generated article.
*/