const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 10000;

app.get("/", (req, res) => {
  res.send("Cricket Live Backend Running");
});

app.get("/live", (req, res) => {
  res.json({
    status: "success",
    matches: [
      {
        id: "1",
        name: "RCB vs CSK",
        status: "RCB need 24 runs in 12 balls",
        score: "RCB 176/5 (18.0)"
      },
      {
        id: "2",
        name: "IND vs AUS",
        status: "India won by 6 wickets",
        score: "IND 245/4"
      }
    ]
  });
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
