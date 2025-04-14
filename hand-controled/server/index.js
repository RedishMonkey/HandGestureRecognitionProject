// Import the express module
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// Initialize an Express application
const app = express();
app.use(cookieParser());

// Configure CORS
app.use(cors({
  origin: ['http://localhost:5173'],
  credentials: true,
}));

// Increase payload size limit for JSON data
app.use(express.json({ limit: '50mb' }));

const routes = require('./routes');

// Use the routes at root level
app.use('/', routes);

// Set a port for the server to listen on
const PORT = 3000;

// Define a simple route to respond to requests at the root URL
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
