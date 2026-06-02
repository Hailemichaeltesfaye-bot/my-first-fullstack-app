// Import the express module
const express = require('express');

// Initialize the express application instance
const app = express();

// Define the network port
const PORT = 3000;

// Set up a basic route for HTTP GET requests
app.get('/', (req, res) => {
    res.send('Hello World! Your Express server is running.');
});

// Start the server and listen for connections
app.listen(PORT, () => {
    console.log(`Server is successfully running on http://localhost:${PORT}`);
});




