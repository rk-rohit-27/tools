const express = require('express');
const cors = require('cors');
const textRoutes = require('./routes/textRoutes.js');
const imageRoutes = require('./routes/imageRoutes.js')
const seoRoutes = require('./routes/seoRoutes.js')

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/write', textRoutes); 
app.use('/api/image', imageRoutes)
app.use('/api/seo', seoRoutes)

module.exports = app;
