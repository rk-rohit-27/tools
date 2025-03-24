const OpenAI = require("openai");
require('dotenv').config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

exports.improveContent = async (req, res) => {
    const { content } = req.body;

    if (!content) {
        return res.status(400).json({ error: 'Content is required.' });
    }

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini", 
            messages: [
                { role: "user", content: `Improve the following content: "${content}"` },
            ],
            max_tokens: 500,
            temperature: 0.7,
        });

        const improvedContent = completion.choices[0].message.content.trim();
        res.json({ improvedContent });
    } catch (error) {
        console.error('Error improving content:', error);
        res.status(500).json({ error: 'Failed to improve content.', details: error.message }); 
    }
};