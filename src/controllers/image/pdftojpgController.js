const { PDFDocument } = require('pdf-lib');
const sharp = require('sharp');
const multer = require('multer');

// Multer setup for handling file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Helper function to convert PDF to images
async function convertPdfToImages(pdfBuffer) {
  const images = [];
  const pdfDoc = await PDFDocument.load(pdfBuffer);
  const numPages = pdfDoc.getPageCount();

  for (let i = 0; i < numPages; i++) {
    const page = pdfDoc.getPage(i);
    const { width, height } = page.getSize();

    // Render the page to an image
    const pngImage = await page.renderToPng({ width, height });
    const processedImageBuffer = await sharp(pngImage).png().toBuffer();
    const base64Image = `data:image/png;base64,${processedImageBuffer.toString('base64')}`;
    images.push(base64Image);
  }

  return images;
}

// Controller function for PDF to JPG conversion
exports.pdfToJpgController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded.' });
    }

    const images = await convertPdfToImages(req.file.buffer);
    res.json({ images });
  } catch (error) {
    console.error('Error converting PDF to JPG:', error);
    res.status(500).json({ error: 'Failed to convert PDF to JPG.' });
  }
};

// Middleware for handling PDF uploads
exports.uploadPdf = upload.single('pdf');