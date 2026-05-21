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

    const response = await axios.get("https://www.cricbuzz.com/cricket-match/live-scores");

    const html = response.data;

    const matches = [];

    const regex = /[A-Z]{2,4} vs [A-Z]{2,4}/g;

    const found = html.match(regex);

    if (found) {

      found.forEach((match, index) => {

        matches.push({
          id: String(index + 1),
          name: match,
          status: "Live",
          score: "Updating..."
        });

      });

    }

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
