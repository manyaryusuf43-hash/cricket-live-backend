const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

app.get("/", (req, res) => {
  res.send("Backend Running");
});

app.get("/live", (req, res) => {

  res.json({
    success: true,

    matches: [
      {
        id: 1,
        name: "RCB vs CSK",
        status: "Live"
      },
      {
        id: 2,
        name: "India vs Australia",
        status: "Upcoming"
      }
    ]
  });

});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("Server running");
});
