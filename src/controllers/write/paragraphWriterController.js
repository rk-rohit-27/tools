// controllers/paragraphWriterController.js
const OpenAI = require("openai"); // Use require instead of import
require('dotenv').config(); // Load environment variables

// Initialize OpenAI with the API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.generateParagraph = async (req, res) => {
  const { topic } = req.body;

  // Check if topic is provided
  if (!topic) {
    return res.status(400).json({ error: 'Topic is required.' });
  }

  try {
    // Call OpenAI API to generate a paragraph
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", 
      messages: [
        { role: "user", content: `Write a paragraph about ${topic}.` },
      ],
      max_tokens: 150, 
      temperature: 0.8, 
    });

    const paragraph = completion.choices[0].message.content.trim(); // Extract the generated paragraph
    res.json({ paragraph }); // Send the paragraph in the response
  } catch (error) {
    console.error('Error generating paragraph:', error);
    res.status(500).json({ error: 'Failed to generate paragraph.' });
  }
};

/*
SOP for Paragraph Writer Controller
- Purpose: Generates a paragraph based on the provided topic using OpenAI API.
- Inputs: 
  - topic: A string containing the topic for the paragraph.
- Outputs: 
  - A JSON response containing the generated paragraph.
- Instructions: 
  1. Send a POST request to /api/write/paragraph with a JSON body containing the topic.
  2. The response will include the generated paragraph.
  3. Ensure that the OPENAI_API_KEY is set in your environment variables.
*/