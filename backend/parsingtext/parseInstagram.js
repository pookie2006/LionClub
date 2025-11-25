const fs = require("fs");
const puppeteer = require("puppeteer");
const Tesseract = require("tesseract.js");
const clubs = require("../clubscp.json");

// Ensure screenshots folder exists
const screenshotDir = "./screenshots";
if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
}

// Regex for months, weekdays, times, dates, numbers
const monthRegex = /\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t)?(?:ember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\b/i;
const weekdayRegex = /\b(?:Mon(?:day)?|Tue(?:sday)?|Wed(?:nesday)?|Thu(?:rsday)?|Fri(?:day)?|Sat(?:urday)?|Sun(?:day)?)\b/i;
const timeRegex = /\b\d{1,2}:\d{2}\s?(?:am|pm|AM|PM)?\b/;
const dateRegex = /\b\d{1,2}[\/\-\.,]\d{1,2}(?:[\/\-\.,]\d{2,4})?\b/; // e.g., 11/9 or 11-9-2025
const numberRegex = /\b\d+\b/;

// Simple location heuristic: words starting with a capital letter (not at start of sentence)
const locationRegex = /\b[A-Z][a-z]{2,}\b/g;

(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.setViewport({
        width: 1200,
        height: 1600,
        deviceScaleFactor: 2
    });

    for (let club of clubs) {
        console.log(`Parsing ${club.instagram}...`);
        try {
            await page.goto(`https://www.instagram.com/${club.instagram}/embed`, { waitUntil: 'networkidle2' });
            
            await page.goto(`https://www.instagram.com/${club.instagram}/embed`, { waitUntil: 'networkidle2' });

            // Replace waitForTimeout with this
            await new Promise(resolve => setTimeout(resolve, 5000));


            const screenshotPath = `${screenshotDir}/${club.instagram}.png`;
            await page.screenshot({ path: screenshotPath, fullPage: true });

            const { data: { text } } = await Tesseract.recognize(screenshotPath, 'eng', { logger: m => console.log(m) });
            
            // Split OCR text into words
            const words = text.split(/\s+/);

            // Filter words for months, weekdays, dates, times, numbers, locations
            const filtered = words.filter(word => 
                monthRegex.test(word) ||
                weekdayRegex.test(word) ||
                timeRegex.test(word) ||
                dateRegex.test(word) ||
                numberRegex.test(word) ||
                locationRegex.test(word)
            );

            club.parsed_text = filtered.join(" ");
            console.log(`✔ Parsed ${club.instagram}`);

            // ⚠️ Keep screenshot for debugging
            // fs.unlinkSync(screenshotPath);

        } catch (err) {
            console.log(`Failed for ${club.instagram}:`, err.message);
            club.parsed_text = "";
        }
    }

    await browser.close();

    fs.writeFileSync("clubs_parsed.json", JSON.stringify(clubs, null, 4));
    console.log("DONE — Parsed text saved to clubs_parsed.json");
})();
