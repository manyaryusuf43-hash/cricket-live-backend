const express = require("express");
const cors = require("cors");
const puppeteer = require("puppeteer");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 10000;

// Home route
app.get("/", (req, res) => {
  res.send("Cricket Live Backend Running");
});

// Live matches route
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

    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36"
    );

    await page.setViewport({
      width: 1366,
      height: 768
    });

    await page.goto("https://www.cricket.com/live-score", {
      waitUntil: "domcontentloaded",
      timeout: 60000
    });

    // Page ko load hone ka time
    await new Promise(resolve => setTimeout(resolve, 5000));

    const matches = await page.evaluate(() => {
      const items = [];
      const links = document.querySelectorAll("a");

      links.forEach((link) => {
        const text = (link.innerText || "")
          .replace(/\s+/g, " ")
          .trim();

        if (
          text.length > 20 &&
          items.length < 10 &&
          !items.some(item => item.name === text.substring(0, 80))
        ) {
          items.push({
            id: String(items.length + 1),
            name: text.substring(0, 80),
            status: "Live",
            score: "Tap to view"
          });
        }
      });

      return items;
    });

    await browser.close();

    if (matches.length === 0) {
      return res.json({
        status: "success",
        matches: [
          {
            id: "1",
            name: "No Live Match Found",
            status: "Please check later",
            score: "-"
          }
        ]
      });
    }

    res.json({
      status: "success",
      matches: matches
    });

  } catch (error) {
    console.error(error);

    if (browser) {
      await browser.close();
    }

    // Fallback data
    res.json({
      status: "success",
      matches: [
        {
          id: "1",
          name: "RCB vs CSK",
          status: "Live",
          score: "Tap to view"
        },
        {
          id: "2",
          name: "MI vs GT",
          status: "Live",
          score: "Tap to view"
        },
        {
          id: "3",
          name: "KKR vs SRH",
          status: "Live",
          score: "Tap to view"
        }
      ]
    });
  }
});

// Upcoming matches route
app.get("/upcoming", (req, res) => {
  res.json({
    status: "success",
    matches: [
      {
        id: "1",
        name: "India vs Australia",
        status: "Tomorrow",
        score: "7:30 PM"
      },
      {
        id: "2",
        name: "England vs South Africa",
        status: "Tomorrow",
        score: "3:30 PM"
      }
    ]
  });
});

// Series route
app.get("/series", (req, res) => {
  res.json({
    status: "success",
    series: [
      { id: "1", name: "Indian Premier League 2026" },
      { id: "2", name: "ICC T20 World Cup 2026" },
      { id: "3", name: "Asia Cup 2026" },
      { id: "4", name: "Big Bash League" },
      { id: "5", name: "Pakistan Super League" }
    ]
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
