const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

app.use(cors());

// Saved cache
let savedMatches = [];

// Home
app.get("/", (req, res) => {
  res.send("Unlimited Cricket Backend Running");
});

// LIVE API
app.get("/live", (req, res) => {

  res.json({
    status: "success",
    matches: savedMatches
  });

});

// AUTO UPDATE FUNCTION
async function updateMatches() {

  try {

    console.log("Updating matches...");

    const response = await axios.get(
      "https://site.web.api.espn.com/apis/v2/sports/cricket/scoreboard"
    );

    const events = response.data.events || [];

    let newMatches = [];

    events.forEach((match, index) => {

      const team1 =
        match.competitions?.[0]?.competitors?.[0]?.team?.shortDisplayName || "Team 1";

      const team2 =
        match.competitions?.[0]?.competitors?.[1]?.team?.shortDisplayName || "Team 2";

      const score1 =
        match.competitions?.[0]?.competitors?.[0]?.score || "0";

      const score2 =
        match.competitions?.[0]?.competitors?.[1]?.score || "0";

      const status =
        match.status?.type?.description || "Live";

      newMatches.push({
        id: String(index + 1),
        name: `${team1} vs ${team2}`,
        score: `${score1} - ${score2}`,
        status: status
      });

    });

    savedMatches = newMatches;

    console.log("Matches updated");

  } catch (error) {

    console.log(error.message);

  }

}

// FIRST TIME LOAD
updateMatches();

// AUTO REFRESH EVERY 15 SECONDS
setInterval(updateMatches, 15000);

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
