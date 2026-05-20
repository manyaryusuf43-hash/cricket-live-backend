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
    const { data } = await axios.get(
      "https://www.cricbuzz.com/cricket-match/live-scores",
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        }
      }
    );

    const $ = cheerio.load(data);
    const matches = [];

    $(".cb-mtch-lst").each((i, el) => {
      const name =
        $(el).find(".cb-lv-scr-mtch-hdr").first().text().trim() ||
        $(el).find("h3").first().text().trim();

      const status =
        $(el).find(".cb-text-live").first().text().trim() ||
        $(el).find(".cb-text-complete").first().text().trim() ||
        "Live";

      const score =
        $(el).find(".cb-lv-scrs-col").first().text().trim() ||
        $(el).find(".cb-min-bat-rw").first().text().trim() ||
        "-";

      if (name) {
        matches.push({
          id: String(i + 1),
          name: name,
          status: status,
          score: score
        });
      }
    });

    // Fallback if no matches found
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
          status: "Try again later",
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
