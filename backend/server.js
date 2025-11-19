const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());

// Serve profile images
app.use('/profileimgs', express.static(path.join(__dirname, 'profileimgs')));

// Load clubs.json
const clubs = JSON.parse(fs.readFileSync(path.join(__dirname, 'clubs.json'), 'utf8'));

// Return clubs JSON
app.get('/clubs', (req, res) => res.json(clubs));

app.listen(3000, () => console.log("Backend running on http://localhost:3000"));