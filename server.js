const express = require("express");
const cors = require("cors");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 10000;

// Test route
app.get("/", (req, res) => {
  res.send("Cricket Live Backend Running");
});

// Live route
app.get("/live", async (req, res) => {
  try {
    const url = "https://www.espncricinfo.com/live-cricket-score";
    const { data } = await axios.get(url);

    const $ = cheerio.load(data);
    const matches = [];

    $(".ds-p-4").each((i, el) => {
      const name = $(el).find("h3").first().text().trim();
      const status = $(el).find(".ds-text-tight-m").first().text().trim();
      const score = $(el).find(".ds-text-compact-m").first().text().trim();

      if (name) {
        matches.push({
          id: String(i + 1),
          name: name || "Match",
          status: status || "Live",
          score: score || "Score not available"
        });
      }
    });

    // Agar ESPN se data na mile to fallback
    if (matches.length === 0) {
      matches.push({
        id: "1",
        name: "No Live Match Found",
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
          name: "Live data unavailable",
          status: "Using fallback data",
          score: "-"
        }
      ]
    });
  }
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
