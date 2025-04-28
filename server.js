const express = require("express");
const path = require("path");

const app = express();

// Serve static files if you have any (optional)
app.use(express.static(path.join(__dirname, "public")));

// Set EJS as the view engine
app.set("view engine", "ejs");
// routes

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
