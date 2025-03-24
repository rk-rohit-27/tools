// controllers/seo/metaController.js
const OpenAI = require('openai');

const generateMetaTagsController = async (req, res) => {
  const { article, tone } = req.body;

  if (!article) {
    return res.status(400).json({ error: 'Article text is required.' });
  }

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const prompt = `Generate meta title, description (120-158 characters), and keywords (comma-separated) for the following article with a ${tone || 'neutral'} tone. Return the results in JSON format with keys "title", "description", and "keywords".\n\n${article}\n\nJSON:`;

   

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 300,
    });



    if (!response.choices || response.choices.length === 0 || !response.choices[0].message || !response.choices[0].message.content) {
      return res.status(500).json({ error: 'Failed to generate meta tags from OpenAI. No valid response.' });
    }

    let generatedText = response.choices[0].message.content.trim();
   

    // Remove backticks
    generatedText = generatedText.replace(/```(json)?/g, '');
    generatedText = generatedText.trim();

    try {
      const jsonData = JSON.parse(generatedText);
      const { title, description, keywords } = jsonData;

      

      // Ensure description length is within the desired range
      if (description.length < 120 || description.length > 158) {
        return res.status(500).json({ error: 'Generated description is not within the 120-158 character range. Description length: ' + description.length });
      }

      const metaTags = `<title>${title}</title>\n<meta name="description" content="${description}">\n<meta name="keywords" content="${keywords}">`;

      console.log('Generated meta tags:', metaTags);

      res.json({ metaTags });
    } catch (jsonError) {
      console.error('Error parsing JSON:', jsonError);
      return res.status(500).json({ error: 'Failed to parse JSON from OpenAI.' });
    }
  } catch (error) {
    console.error('Error generating meta tags:', error);
    res.status(500).json({ error: 'Failed to generate meta tags. ' + error.message });
  }
};

module.exports = {
  generateMetaTagsController,
};