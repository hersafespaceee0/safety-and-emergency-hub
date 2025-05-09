const express = require("express");
const path = require("path");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const session = require("express-session");
const bodyParser = require("body-parser");

//connection to the db
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "safety & emergency hub",
});
db.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL database!");
});

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "", // Replace with your password or use .env
  database: "safety & emergency hub",
  connectionLimit: 10,
});

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.use(
  session({
    secret: "process.env.SESSION_SECRET",
    resave: false,
    saveUninitialized: true,
  })
);

app.get("/", (req, res) => {
  // Fetch latest 3 alerts
  pool.query(
    "SELECT alert_id, title, description, severity FROM alerts WHERE status = 'active'LIMIT 3",
    ["active"], // Only show active alerts
    (err, alerts) => {
      if (err) {
        console.error("Error fetching alerts:", err);
        return res
          .status(500)
          .render("error", { message: "Failed to load alerts" });
      }
      // Fetch emergency contacts
      pool.query(
        "SELECT contact_id, service_name, phone_number FROM emergency_contacts",
        (err, contacts) => {
          if (err) {
            console.error("Error fetching contacts:", err);
            return res
              .status(500)
              .render("error", { message: "Failed to load contacts" });
          }
          // Fetch a random safety tip
          pool.query(
            "SELECT tip_id, title, description FROM safety_tips ORDER BY RAND() LIMIT 1",
            (err, tips) => {
              if (err) {
                console.error("Error fetching tips:", err);
                return res
                  .status(500)
                  .render("error", { message: "Failed to load tips" });
              }
              res.render("index", {
                session: req.session,
                alerts: alerts || [],
                contacts: contacts || [],
                tip: tips[0] || { title: "No tips available", description: "" },
              });
            }
          );
        }
      );
    }
  );
});

// Set EJS as the view engine
app.set("view engine", "ejs");
// routes

app.get("/", (req, res) => {
  res.render("index", { session: req.session });
});

//sign up route
app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const query =
    "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)";
  db.query(query, [username, email, hashedPassword], (err, result) => {
    if (err) {
      console.error("Signup error:", err);
      return res.send("Signup failed");
    }
    res.redirect("/");
  });
});

//login route
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) {
        console.error("Login error:", err);
        return res.send("Login failed");
      }

      if (results.length === 0) return res.send("No user found");

      const user = results[0];
      const match = await bcrypt.compare(password, user.password_hash);

      if (!match) return res.send("Incorrect password");

      req.session.user = {
        id: user.user_id,
        username: user.username,
        email: user.email,
      };

      res.redirect("/");
    }
  );
});
//logout route
app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
    }
    res.redirect("/");
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
