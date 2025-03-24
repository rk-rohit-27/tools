const OpenAI = require("openai");
require('dotenv').config(); // Load environment variables

// Initialize OpenAI with the API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.writeYoutubeScript = async (req, res) => {
  const { topic, tone, length } = req.body; // Expecting tone and length as well

  // Check if videoTopic is provided
  if (!topic || !tone || !length) {
    return res.status(400).json({ error: 'Video topic, tone, and length are required.' });
  }

  try {
    // Generate a YouTube script using OpenAI API
    const script = await generateYoutubeScript(topic, tone, length);
    res.json({ script });
  } catch (error) {
    console.error('Error writing YouTube script:', error);
    res.status(500).json({ error: 'Failed to generate YouTube script.' });
  }
};

// Function to generate a YouTube script using OpenAI API
const generateYoutubeScript = async (videoTopic, tone, length) => {
  const prompt = `
    Write a ${length} YouTube script about "${videoTopic}" in a "${tone}" tone.

The script should be structured with an title, introduction,scene segments, and a closing statement.

Format the entire script using <p> tags.

For the segment titles (e.g., "Segment 1: ChatGPT"), use <strong> tags to make them stand out.

Make the script engaging and informative.

Avoid any surrounding HTML document structure (<html>, <head>, <body>).`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "user", content: prompt },
    ],
    max_tokens: 1000, // Adjust the token limit as needed
    temperature: 0.7, // Adjust the creativity level
  });

  const scriptContent = completion.choices[0].message.content.trim(); // Extract the generated script content
  return scriptContent;
};

/*
SOP for YouTube Script Writer Controller
- Purpose: Writes a script for a YouTube video based on the provided topic, tone, and length.
- Inputs: 
  - videoTopic: A string containing the topic for the YouTube video.
  - tone: A string indicating the tone of the script (e.g., casual, informative).
  - length: A string indicating the desired length of the script (e.g., short, medium, long).
- Outputs: 
  - A JSON response containing the written script.
- Instructions: 
  1. Send a POST request to /api/write/youtube with a JSON body containing the video topic, tone, and length.
  2. The response will include the written script.
*/