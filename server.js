const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());

app.get("/", (req, res) => {
  res.send("Backend Running");
});

app.get("/live", (req, res) => {

  const matches = [

    {
      id: 1,
      team1: "RCB",
      team2: "CSK",
      status: "Live",
      score: "145/3 (15.2)"
    },

    {
      id: 2,
      team1: "India",
      team2: "Australia",
      status: "Upcoming",
      score: "Starts at 7:30 PM"
    }

  ];

  res.json({
    success: true,
    matches: matches
  });

});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("Server running");
});
