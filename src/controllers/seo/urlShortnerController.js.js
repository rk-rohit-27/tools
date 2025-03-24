const { v4: uuidv4 } = require('uuid');
const Url = require('../../models/url'); // Assuming you have a Url model
const config = require('config'); // To access configuration

const shortenURL = async (req, res) => {
    const { longUrl } = req.body;

    // Basic URL validation (you should use a library for robust validation)
    if (!longUrl || !/^(https?:\/\/)/.test(longUrl)) {
        return res.status(400).json({ error: 'Invalid URL' });
    }

    try {
        // Check if the long URL already exists in the database
        const existingUrl = await Url.findOne({ longUrl });  // Changed urlRecord to existingUrl

        if (existingUrl) {
            // If it exists, return the existing short URL
            return res.json({ shortUrl: existingUrl.shortUrl }); // Changed urlRecord to existingUrl
        } else {
            // Generate a unique short URL
            const shortUrl = uuidv4().substring(0, 8);
            // Create a new URL record in the database
            const newUrl = new Url({  // Changed urlRecord to newUrl
                longUrl,
                shortUrl,
            });
            await newUrl.save();  // Changed urlRecord to newUrl

            const shortenedUrl = `${config.get('baseShortUrl')}/${shortUrl}`;  // Use base URL from config
            res.json({ shortUrl: shortenedUrl });
        }
    } catch (error) {
        console.error("Error shortening URL:", error);
        res.status(500).json({ error: 'Failed to shorten URL' });
    }
};

const getLongURL = async (req, res) => {
    const { shortUrl } = req.params;

    try {
        const urlRecord = await Url.findOne({ shortUrl });
        if (urlRecord) {
            // Redirect using a 301 (Permanent) or 302 (Temporary) redirect
            res.redirect(301, urlRecord.longUrl);
        } else {
            res.status(404).send('Short URL not found');
        }
    } catch (error) {
        console.error("Error retrieving long URL:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    shortenURL,
    getLongURL,
};
