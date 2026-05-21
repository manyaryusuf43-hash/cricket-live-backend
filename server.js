const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");

const app = express();

app.use(cors());

app.get("/", (req, res) => {
  res.send("Cricket Live Backend Running");
});

app.get("/live", async (req, res) => {
  try {

    const url = "https://www.cricbuzz.com/cricket-match/live-scores";

    const response = await axios.get(url);

    const $ = cheerio.load(response.data);

    let matches = [];

    $(".cb-scr-wll-chvrn").each((i, el) => {

      const name = $(el)
        .find("h3")
        .text()
        .trim();

      const score = $(el)
        .find(".cb-scr-wll-chvrn")
        .first()
        .text()
        .trim();

      if (name) {
        matches.push({
          id: String(i + 1),
          name: name,
          status: "Live",
          score: score || "Updating..."
        });
      }

    });

    res.json({
      status: "success",
      matches: matches
    });

  } catch (error) {

    res.json({
      status: "error",
      message: error.message
    });

  }
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
