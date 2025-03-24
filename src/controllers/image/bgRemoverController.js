const axios = require('axios');
const sharp = require('sharp');
const path = require('path');

// Configure Remove.bg API (Get your key from https://www.remove.bg/api)
const REMOVE_BG_API_KEY = process.env.REMOVE_BG_API_KEY;


const REMOVE_BG_API_URL = 'https://api.remove.bg/v1.0/removebg';

exports.bgRemoveController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const form = new FormData();
    form.append("image_file", req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });
    form.append("size", "auto");
    form.append("format", "png");

    const response = await axios.post(REMOVE_BG_API_URL, form, {
      headers: {
        "X-Api-Key": REMOVE_BG_API_KEY,
        ...form.getHeaders()
      },
      responseType: "arraybuffer"
    });

    const resultImage = `data:image/png;base64,${Buffer.from(response.data).toString('base64')}`;
    res.json({ resultImage });

  } catch (error) {
    console.error("Remove.bg API Error:", error.message);
    const errorMessage = error.response?.data?.errors?.[0]?.title || "Background removal failed";
    res.status(error.response?.status || 500).json({ error: errorMessage });
  }
};
// Background Application Controller
exports.applyBackgroundController = async (req, res) => {
  try {
    const foregroundBuffer = req.files.foreground[0].buffer;
    let finalImage;

    if (req.files.backgroundImage) {
      finalImage = await applyImageBackground(
        foregroundBuffer,
        req.files.backgroundImage[0].buffer
      );
    } else if (req.body.backgroundColor) {
      finalImage = await applySolidColorBackground(
        foregroundBuffer,
        req.body.backgroundColor
      );
    } else {
      return res.status(400).json({ error: 'No background provided' });
    }

    res.json({ finalImage });

  } catch (error) {
    console.error('Background application error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to apply background' 
    });
  }
};

// Helper Functions
async function applyImageBackground(foregroundBuffer, backgroundBuffer) {
  const foreground = sharp(foregroundBuffer);
  const { width, height } = await foreground.metadata();

  return sharp(backgroundBuffer)
    .resize(width, height, { fit: 'cover' })
    .composite([{ input: await foreground.toBuffer() }])
    .png()
    .toBuffer()
    .then(buffer => `data:image/png;base64,${buffer.toString('base64')}`);
}

async function applySolidColorBackground(foregroundBuffer, color) {
  const foreground = sharp(foregroundBuffer);
  const { width, height } = await foreground.metadata();

  return sharp({
    create: {
      width,
      height,
      channels: 4,
      background: color
    }
  })
  .composite([{ input: await foreground.toBuffer() }])
  .png()
  .toBuffer()
  .then(buffer => `data:image/png;base64,${buffer.toString('base64')}`);
}