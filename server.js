const express = require("express");
const cors = require("cors");
const puppeteer = require("puppeteer");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 10000;

// Home Route
app.get("/", (req, res) => {
  res.send("Cricket Live Backend Running");
});

// Live Matches Route
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

    await page.goto(
      "https://www.cricbuzz.com/cricket-match/live-scores",
      {
        waitUntil: "domcontentloaded",
        timeout: 60000
      }
    );

    await page.waitForSelector("body", {
      timeout: 15000
    });

    const matches = await page.evaluate(() => {

      const data = [];

      const elements = document.querySelectorAll("h3");

      elements.forEach((el, index) => {

        const text = el.innerText.trim();

        if (
          text.length > 5 &&
          text.includes("vs") &&
          index < 10
        ) {

          data.push({
            id: String(index + 1),
            name: text,
            status: "Live",
            score: "Live Score Available"
          });

        }

      });

      return data;

    });

    await browser.close();

    res.json({
      status: "success",
      matches: matches
    });

  } catch (error) {

    console.log(error);

    if (browser) {
      await browser.close();
    }

    res.json({
      status: "error",
      message: error.message
    });

  }

});

// Upcoming Matches
app.get("/upcoming", (req, res) => {
  res.json({
    status: "success",
    matches: [
      {
        id: "1",
        name: "India vs Australia",
        status: "Tomorrow",
        score: "7:30 PM"
      }
    ]
  });
});

// Series Route
app.get("/series", (req, res) => {
  res.json({
    status: "success",
    series: [
      {
        id: "1",
        name: "Indian Premier League"
      },
      {
        id: "2",
        name: "ICC Champions Trophy"
      }
    ]
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
