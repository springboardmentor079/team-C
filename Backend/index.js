const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Demo backend running");
});

app.listen(5000, () => {
  console.log("Demo backend running on port 5000");
});
