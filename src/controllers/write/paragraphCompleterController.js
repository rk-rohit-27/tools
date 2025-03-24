// controllers/paragraphCompleterController.js
const OpenAI = require("openai"); // Use require instead of import
require('dotenv').config(); // Load environment variables

// Initialize OpenAI with the API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.completeParagraph = async (req, res) => {
  const { incompleteParagraph } = req.body;

  // Check if incomplete paragraph is provided
  if (!incompleteParagraph) {
    return res.status(400).json({ error: 'Incomplete paragraph is required.' });
  }

  try {
    // Call OpenAI API to complete the paragraph
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", 
      messages: [
        { role: "user", content: `Complete the following paragraph: "${incompleteParagraph}"` },
      ],
      max_tokens: 150, 
      temperature: 0.7, 
    });

    const completedParagraph = completion.choices[0].message.content.trim();
    const completedParagraphWithoutQuotes = completedParagraph.replace(/^"|"$/g, '');
    res.json({ completedParagraph: completedParagraphWithoutQuotes });
  } catch (error) {
    console.error('Error completing paragraph:', error);
    res.status(500).json({ error: 'Failed to complete paragraph.' });
  }
};

/*
SOP for Paragraph Completer Controller
- Purpose: Completes the provided paragraph using OpenAI API.
- Inputs: 
  - incompleteParagraph: A string containing the incomplete paragraph.
- Outputs: 
  - A JSON response containing the completed paragraph.
- Instructions: 
  1. Send a POST request to /api/write/completer with a JSON body containing the incomplete paragraph.
  2. The response will include the completed paragraph.
  3. Ensure that the OPENAI_API_KEY is set in your environment variables.
*/