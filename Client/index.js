const path = require('path');
const express = require('express');
const app = express();

// Setup static directories for React app
app.use(express.static(path.join(__dirname, 'app', 'build')));
app.use(express.static(path.join(__dirname, 'app', 'public')));

// Send our React app on root
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'app', 'build', 'index.html')));

// Start the server to make our React app live to localhost!
app.listen(3000, () => {
  console.log(`Client live at http://localhost:3000`);
});