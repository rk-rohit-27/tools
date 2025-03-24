// controllers/contentSummarizerController.js
const OpenAI = require("openai");
require('dotenv').config(); // Load environment variables

// Initialize OpenAI with the API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.summarizeContent = async (req, res) => {
  const { text } = req.body; // Only destructure text from the request body

  // Check if text is provided
  if (!text) {
    return res.status(400).json({ error: 'Text is required.' });
  }

  try {
    // Prepare the prompt based on the input
    const prompt = `Summarize the following text: "${text}". If the summary contains multiple paragraphs, wrap each paragraph in separate <p> tags. If there is only one paragraph, wrap it in a single <p> tag.`;

    // Call OpenAI API to summarize content
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", 
      messages: [
        { role: "user", content: prompt },
      ],
      max_tokens: 300, // Adjust the token limit as needed
      temperature: 0.5, // Adjust the creativity level
    });

    // Check if the response contains choices
    if (completion.choices && completion.choices.length > 0) {
      const summary = completion.choices[0].message.content.trim(); // Extract the summarized content
      return res.json({ summary }); // Send the summarized content in the response
    } else {
      return res.status(500).json({ error: 'No response from OpenAI.' });
    }
  } catch (error) {
    console.error('Error summarizing content:', error);
    return res.status(500).json({ error: 'Failed to summarize content.' });
  }
};

/*
SOP for Content Summarizer Controller
- Purpose: Summarizes the provided content using OpenAI API.
- Inputs: 
  - text: A string containing the content to be summarized.
- Outputs: 
  - A JSON response containing the summarized content.
- Instructions: 
  1. Send a POST request to /api/summarize/content with a JSON body containing the text.
  2. The response will include the summarized content.
  3. Ensure that the OPENAI_API_KEY is set in your environment variables.
*/