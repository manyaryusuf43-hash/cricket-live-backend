const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

app.use(cors());

app.get("/", (req, res) => {
  res.send("Cricket Live Backend Running");
});

app.get("/live", async (req, res) => {
  try {

    const url =
      "https://site.web.api.espn.com/apis/v2/sports/cricket/scoreboard";

    const response = await axios.get(url);

    const data = response.data;

    let matches = [];

    data.events.forEach((match, i) => {

      matches.push({
        id: String(i + 1),

        name: match.name || "Unknown Match",

        status:
          match.status?.type?.detail || "Live",

        score: "Live Match"
      });

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
