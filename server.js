const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());

app.get("/", (req, res) => {
  res.send("Cricket Live Backend Running");
});

app.get("/live", async (req, res) => {

  try {

    const response = await axios.get(
      "https://site.api.espn.com/apis/site/v2/sports/cricket/scoreboard"
    );

    const events = response.data.events || [];

    let matches = [];

    events.forEach((match, index) => {

      matches.push({
        id: index + 1,
        name: match.name,
        status: match.status?.type?.detail || "Live"
      });

    });

    res.json({
      success: true,
      matches: matches
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
  console.log(`Server running on port ${PORT}`);
});
