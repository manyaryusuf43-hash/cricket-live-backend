const express = require("express");
const cors = require("cors");
const axios = require("axios");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");
const app = express();
app.use(cors());

const PORT = process.env.PORT || 10000;

// Test route
app.get("/", (req, res) => {
  res.send("Cricket Live Backend Running");
});
// Live match route
app.get("/live", async (req, res) => {
  let browser;

  try {
    browser = await puppeteer.launch({
  headless: true,
  args: [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-dev-shm-usage",
    "--disable-gpu"
  ]
});

    const page = await browser.newPage();

    await page.goto(
      "https://www.cricket.com/live-score",
      {
        waitUntil: "domcontentloaded",
        timeout: 60000
      }
    );

    const matches = await page.evaluate(() => {
      const items = [];
      const links = document.querySelectorAll(
        'a[href*="/live-cricket-score"]'
      );

      links.forEach((link, index) => {
        const text = link.innerText.replace(/\s+/g, " ").trim();

        if (text.length > 20 && index < 10) {
          items.push({
            id: String(index + 1),
            name: text.substring(0, 80),
            status: "Live",
            score: "Tap to view"
          });
        }
      });

      return items;
    });

    const unique = [];
    const seen = new Set();

    matches.forEach(match => {
      if (!seen.has(match.name)) {
        seen.add(match.name);
        unique.push(match);
      }
    });

    if (unique.length === 0) {
      unique.push({
        id: "1",
        name: "No Live Match Found",
        status: "Please check later",
        score: "-"
      });
    }

    res.json({
      status: "success",
      matches: unique
    });

  } catch (error) {
    res.json({
      status: "success",
      matches: [
        {
          id: "1",
          name: "Live data unavailable",
          status: "Please try again later",
          score: "-"
        }
      ]
    });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
});
// Upcoming matches route
app.get("/upcoming", async (req, res) => {
  try {
    const url = "https://www.cricbuzz.com/cricket-match/live-scores";
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
      }
    });

    const $ = cheerio.load(data);
    const matches = [];

    $(".cb-mtch-lst").each((i, el) => {
      const name = $(el).find(".cb-lv-scr-mtch-hdr").text().trim();

      if (name) {
        matches.push({
          id: String(i + 1),
          name: name,
          status: "Upcoming Match",
          score: "Not Started"
        });
      }
    });

    if (matches.length === 0) {
      matches.push({
        id: "1",
        name: "No Upcoming Match Found",
        status: "Please check later",
        score: "-"
      });
    }

    res.json({
      status: "success",
      matches: matches
    });

  } catch (error) {
    res.json({
      status: "success",
      matches: [
        {
          id: "1",
          name: "Upcoming data unavailable",
          status: "Please try again later",
          score: "-"
        }
      ]
    });
  }
});
// Series route
app.get("/series", (req, res) => {
  res.json({
    status: "success",
    series: [
      {
        id: "1",
        name: "Indian Premier League 2026"
      },
      {
        id: "2",
        name: "ICC T20 World Cup 2026"
      },
      {
        id: "3",
        name: "Asia Cup 2026"
      },
      {
        id: "4",
        name: "Big Bash League"
      },
      {
        id: "5",
        name: "Pakistan Super League"
      }
    ]
  });
});
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
