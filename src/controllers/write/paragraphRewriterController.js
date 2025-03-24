const OpenAI = require("openai");
require('dotenv').config(); // Load environment variables

// Initialize OpenAI with the API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.rewriteParagraph = async (req, res) => {
  const { content, tone } = req.body; // Expecting content and tone

  // Check if content is provided
  if (!content || !tone) {
    return res.status(400).json({ error: 'Content and tone are required.' });
  }

  try {
    // Generate a rewritten paragraph using OpenAI API
    const rewrittenParagraph = await generateRewrittenParagraph(content, tone);
    res.json({ paragraph: rewrittenParagraph });
  } catch (error) {
    console.error('Error rewriting paragraph:', error);
    res.status(500).json({ error: 'Failed to rewrite paragraph.' });
  }
};

// Function to generate a rewritten paragraph using OpenAI API
const generateRewrittenParagraph = async (content, tone) => {
  const prompt = `Rewrite the following paragraph in a ${tone.toLowerCase()} tone: "${content}". If the rewritten content contains multiple paragraphs, wrap each paragraph in separate <p> tags. If there is only one paragraph, wrap it in a single <p> tag.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "user", content: prompt },
    ],
    max_tokens: 150, // Adjust the token limit as needed
    temperature: 0.7, // Adjust the creativity level
  });

  const rewrittenContent = completion.choices[0].message.content.trim(); // Extract the rewritten paragraph
  return rewrittenContent;
};

/*
SOP for Paragraph Rewriter Controller
- Purpose: Rewrites the provided paragraph using OpenAI API based on the specified tone.
- Inputs: 
  - content: A string containing the paragraph to be rewritten.
  - tone: A string indicating the tone of voice (e.g., Professional, Creative).
- Outputs: 
  - A JSON response containing the rewritten paragraph.
- Instructions: 
  1. Send a POST request to /api/write/paragraph/rewrite with a JSON body containing the content and tone.
  2. The response will include the rewritten paragraph.
*/