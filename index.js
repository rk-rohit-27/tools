const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables from .env file

// Import your application (assuming it's where your routes and other middleware are set up)
const app = require('./src/app');

const PORT = process.env.PORT || 5000;

// MongoDB connection string
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/your-database-name'; // Replace with your actual URI

mongoose.connect(mongoURI)
  .then(() => {
    console.log('Connected to MongoDB');
    // Start the server only after successful database connection
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
    // Handle the error appropriately, e.g., exit the application or retry connection
    process.exit(1); // Exit the application if database connection fails
  });
