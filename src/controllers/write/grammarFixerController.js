const OpenAI = require("openai"); // Use require instead of import
require('dotenv').config(); // Load environment variables

// Initialize OpenAI with the API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.fixGrammar = async (req, res) => {
  const { text } = req.body;

  // Check if text is provided
  if (!text) {
    return res.status(400).json({ error: 'Text is required.' });
  }

  try {
    // Call OpenAI API to fix grammar
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", 
      messages: [
        { role: "user", content: `Fix the grammar in the following text: "${text}". Wrap the corrected text in <p> tags.`},
      ],
      max_tokens: 500, // Adjust the token limit as needed
      temperature: 0.5, // Adjust the creativity level
    });

    // Check if the response contains choices
    if (completion.choices && completion.choices.length > 0) {
      let correctedText = completion.choices[0].message.content.trim(); 

    // Remove double quotes from the beginning and end of the string
    correctedText = correctedText.replace(/^"|"$/g, '');
      return res.json({ correctedText }); // Send the corrected text in the response
    } else {
      return res.status(500).json({ error: 'No response from OpenAI.' });
    }
  } catch (error) {
    console.error('Error fixing grammar:', error);
    return res.status(500).json({ error: 'Failed to fix grammar.' });
  }
};

/*
SOP for Grammar Fixer Controller
- Purpose: Fixes grammar issues in the provided text using OpenAI API.
- Inputs: 
  - text: A string containing the text to be corrected.
- Outputs: 
  - A JSON response containing the corrected text.
- Instructions: 
  1. Send a POST request to /api/fix/grammar with a JSON body containing the text.
  2. The response will include the corrected text.
  3. Ensure that the OPENAI_API_KEY is set in your environment variables.
*/