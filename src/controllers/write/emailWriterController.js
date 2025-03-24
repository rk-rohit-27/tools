const OpenAI = require("openai");
require('dotenv').config(); // Load environment variables

// Initialize OpenAI with the API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Controller function to generate email
exports.generateEmail = async (req, res) => {
  const { topic, from } = req.body; // Expecting topic and optional from

  // Check if topic is provided
  if (!topic) {
    return res.status(400).json({ error: 'Email topic is required.' });
  }

  try {
    // Create a prompt for the OpenAI API
    const prompt = `rite a professional email about "${topic}".

The entire email content, including the subject, greeting, body, and closing, should be formatted using only <p> tags.

Use <strong> tags to highlight the subject line within the first <p> tag.

The email should be clear, concise, and suitable for a general audience.

Include a greeting, body, and closing.

Avoid any surrounding HTML document structure (<html>, <head>, <body>).`;

    // Call OpenAI API to generate the email content
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Use the appropriate model
      messages: [
        { role: "user", content: prompt },
      ],
      max_tokens: 300, // Adjust the token limit as needed
      temperature: 0.7, // Adjust the creativity level
    });

    const generatedEmail = completion.choices[0].message.content.trim(); // Extract the generated email content

    // Return the generated email
    res.json({ email: generatedEmail });
  } catch (error) {
    console.error('Error generating email:', error);
    res.status(500).json({ error: 'Failed to generate email.' });
  }
};

/*
SOP for Email Writer Controller
- Purpose: Generates an email based on the provided topic and optional sender's email.
- Inputs: 
  - topic: A string containing the topic of the email.
  - from: (optional) A string containing the sender's email address.
- Outputs: 
  - A JSON response containing the generated email.
- Instructions: 
  1. Send a POST request to /api/generate-email with a JSON body containing the topic and optional from.
  2. The response will include the generated email.
*/