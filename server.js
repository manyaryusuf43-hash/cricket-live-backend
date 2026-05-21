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
  "https://site.api.espn.com/apis/site/v2/sports/cricket/scoreboard",
  {
    headers: {
      "User-Agent": "Mozilla/5.0"
    }
  }
);

    const matches = response.data.events.map((match, index) => ({
      id: index + 1,
      name: match.name,
      status: match.status?.type?.detail
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
