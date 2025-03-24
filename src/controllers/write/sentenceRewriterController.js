const OpenAI = require("openai");
require('dotenv').config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

exports.rewriteSentence = async (req, res) => {
    const { sentence } = req.body;

    if (!sentence) {
        return res.status(400).json({ error: 'Sentence is required.' });
    }

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini", // Or your preferred model
            messages: [
                { role: "user", content: `Rewrite the following sentence in a different way: "${sentence}". Wrap the rewritten sentence in <p> tags.` },
            ],
            max_tokens: 100, // Adjust as needed
            temperature: 0.7,
        });

        const rewrittenSentence = completion.choices[0].message.content.trim();
        res.json({ rewrittenSentence });
    } catch (error) {
        console.error('Error rewriting sentence:', error);
        res.status(500).json({ error: 'Failed to rewrite sentence.' });
    }
};

/*
SOP for Sentence Rewriter Controller
- Purpose: Rewrites the provided sentence using OpenAI API.
- Inputs: 
    - sentence: A string containing the sentence to be rewritten.
- Outputs: 
    - A JSON response containing the rewritten sentence.
- Instructions: 
    1. Send a POST request to /api/write/sentence with a JSON body containing the sentence.
    2. The response will include the rewritten sentence.
    3. Ensure that the OPENAI_API_KEY is set in your environment variables.
*/