// controllers/essayController.js
const OpenAI = require("openai"); // Use require instead of import
require('dotenv').config(); // Load environment variables

// Initialize OpenAI with the API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.generateEssay = async (req, res) => {
  const { prompt } = req.body;

  // Check if prompt is provided
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required.' });
  }

  try {
    // Call OpenAI API to generate an essay
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", 
      messages: [
        { role: "user", content: `Write an essay about ${prompt}.` },
      ],
      max_tokens: 500, // Adjust the token limit as needed
      temperature: 0.7, // Adjust the creativity level
    });

    const essay = completion.choices[0].message.content.trim(); // Extract the generated essay
    res.json({ essay }); // Send the essay in the response
  } catch (error) {
    console.error('Error generating essay:', error);
    res.status(500).json({ error: 'Failed to generate essay.' });
  }
};

/*
SOP for Essay Generation Controller
- Purpose: Generates an essay based on the provided prompt using OpenAI API.
- Inputs: 
  - prompt: A string containing the topic for the essay.
- Outputs: 
  - A JSON response containing the generated essay.
- Instructions: 
  1. Send a POST request to /api/write/essay with a JSON body containing the prompt.
  2. The response will include the generated essay.
  3. Ensure that the OPENAI_API_KEY is set in your environment variables.
*/