const path = require('path');
const express = require('express');
const app = express();

const rateLimit = require('express-rate-limit');

/*
 * 250 requests every 5 minutes, you may want to 
 * change this if you're using this in production 
 * for some reason..
 */
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 250
});

app.use(limiter);

// Setup static directories for React app
app.use(express.static(path.join(__dirname, 'app', 'build')));
app.use(express.static(path.join(__dirname, 'app', 'public')));

// Send our React app on root
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'app', 'build', 'index.html')));

// Start the server to make our React app live to localhost!
app.listen(3000, () => {
  console.log(`Client live at http://localhost:3000`);
});