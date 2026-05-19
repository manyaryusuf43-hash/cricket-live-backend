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
    const url = "https://www.espncricinfo.com/live-cricket-score";
    const { data } = await axios.get(url);

    const $ = cheerio.load(data);

    const title = $("h1").first().text().trim() || "Live Match";
    const status =
      $('span[class*="ds-text-tight-m"]').first().text().trim() || "Live";

    res.json({
      success: true,
      title,
      status
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
