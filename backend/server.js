const express = require('express');
const axios = require('axios');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors());

// TEMP: your developer access token — replace later
const ACCESS_TOKEN = "YOUR_INSTAGRAM_ACCESS_TOKEN";

// Load clubs.json
const clubs = JSON.parse(fs.readFileSync('../clubs.json', 'utf8'));

app.get('/clubs', (req, res) => {
    res.json(clubs); // just return your JSON
});


app.listen(3000, () => console.log("Backend running on http://localhost:3000"));