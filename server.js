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

// Live match route
app.get("/live", async (req, res) => {
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
      const status = $(el).find(".cb-text-live").text().trim() ||
                     $(el).find(".cb-text-complete").text().trim();
      const score = $(el).find(".cb-lv-scrs-col").first().text().trim();

      if (name) {
        matches.push({
          id: String(i + 1),
          name: name,
          status: status || "Live",
          score: score || "-"
        });
      }
    });

    // Agar kuch nahi mila
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
          status: "Cricbuzz blocked request",
          score: "-"
        }
      ]
    });
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
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
