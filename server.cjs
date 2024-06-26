require('dotenv').config()
const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3005;

// Serve static files from the 'build' folder
app.use(express.static(path.join(__dirname, 'dist')));

// Define a catch-all route to serve your React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});