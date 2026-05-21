const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());

app.get("/", (req, res) => {
  res.send("Backend Running");
});

app.get("/live", async (req, res) => {
  try {

    const response = await axios.get(
      "https://site.api.espn.com/apis/site/v2/sports/cricket/scoreboard"
    );

    const matches = response.data.events.map((match, index) => ({
      id: index + 1,
      team1: match.competitions[0].competitors[0].team.displayName,
      team2: match.competitions[0].competitors[1].team.displayName,
      status: match.status.type.detail,
      score:
        match.competitions[0].competitors[0].score +
        "/" +
        match.competitions[0].competitors[1].score
    }));

    res.json({
      success: true,
      matches
    });

  } catch (err) {

    res.json({
      success: false,
      error: err.message
    });

  }
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("Server running");
});
