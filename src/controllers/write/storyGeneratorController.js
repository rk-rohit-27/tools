// controllers/storyGeneratorController.js
const OpenAI = require("openai"); // Use require instead of import
require('dotenv').config(); // Load environment variables

// Initialize OpenAI with the API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.generateStory = async (req, res) => {
  const { theme, numParagraphs, language } = req.body; // Include language in the destructured body

  // Check if theme is provided
  if (!theme) {
    return res.status(400).json({ error: 'Theme is required.' });
  }

  try {
    // Call OpenAI API to generate a story
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", 
      messages: [
        { role: "user", content: `Write a story about "${theme}" in ${language} with ${numParagraphs} paragraphs. Wrap each paragraph in separate <p> tags.`}, // Include language in the prompt
      ],
      max_tokens: 500, // Adjust the token limit as needed
      temperature: 0.7, // Adjust the creativity level
    });

    const story = completion.choices[0].message.content.trim(); // Extract the generated story
    res.json({ story }); // Send the story in the response
  } catch (error) {
    console.error('Error generating story:', error);
    res.status(500).json({ error: 'Failed to generate story.' });
  }
};

/*
SOP for Story Generator Controller
- Purpose: Generates a story based on the provided theme using OpenAI API.
- Inputs: 
  - theme: A string containing the theme for the story.
  - numParagraphs: A number indicating how many paragraphs the story should have.
  - language: A string indicating the language for the story.
- Outputs: 
  - A JSON response containing the generated story.
- Instructions: 
  1. Send a POST request to /api/write/story with a JSON body containing the theme, number of paragraphs, and language.
  2. The response will include the generated story.
  3. Ensure that the OPENAI_API_KEY is set in your environment variables.
*/