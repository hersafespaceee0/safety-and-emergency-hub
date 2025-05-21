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

// Routes
app.get("/", (req, res) => {
  pool.query(
    "SELECT alert_id, title, description, severity, created_at FROM alerts WHERE status = ? ORDER BY created_at DESC LIMIT 3",
    ["active"],
    (err, alerts) => {
      if (err) {
        console.error("Error fetching alerts:", err);
        return res
          .status(500)
          .render("error", { message: "Failed to load alerts" });
      }
      pool.query(
        "SELECT contact_id, service_name, phone_number FROM emergency_contacts",
        (err, contacts) => {
          if (err) {
            console.error("Error fetching contacts:", err);
            return res
              .status(500)
              .render("error", { message: "Failed to load contacts" });
          }
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

app.get("/alerts", (req, res) => {
  const { severity, region_id } = req.query;
  const error = req.session.alertError || null;
  req.session.alertError = null; // Clear error after displaying
  let query =
    "SELECT alert_id, title, description, severity, created_at FROM alerts WHERE status = ?";
  let params = ["active"];

  if (severity) {
    query += " AND severity = ?";
    params.push(severity);
  }
  if (region_id) {
    query += " AND region_id = ?";
    params.push(region_id);
  }
  query += " ORDER BY created_at DESC";

  pool.query(query, params, (err, alerts) => {
    if (err) {
      console.error("Error fetching alerts:", err);
      return res
        .status(500)
        .render("error", { message: "Failed to load alerts" });
    }
    pool.query("SELECT region_id, region_name FROM regions", (err, regions) => {
      if (err) {
        console.error("Error fetching regions:", err);
        return res
          .status(500)
          .render("error", { message: "Failed to load regions" });
      }
      res.render("alerts", {
        session: req.session,
        alerts: alerts || [],
        regions: regions || [],
        severity: severity || "",
        region_id: region_id || "",
        error: error,
      });
    });
  });
});

app.post("/alerts/add", (req, res) => {
  if (!req.session.user || !req.session.user.user_id) {
    req.session.alertError = "Please log in to add an alert";
    return res.redirect("/alerts");
  }
  const { title, description, severity, region_id } = req.body;

  // Validation
  if (!title || !description || !severity || !region_id) {
    req.session.alertError = "All fields are required";
    return res.redirect("/alerts");
  }
  if (title.length > 100) {
    req.session.alertError = "Title must be 100 characters or less";
    return res.redirect("/alerts");
  }
  if (description.length > 1000) {
    req.session.alertError = "Description must be 1000 characters or less";
    return res.redirect("/alerts");
  }
  if (!["high", "medium", "low"].includes(severity)) {
    req.session.alertError = "Invalid severity value";
    return res.redirect("/alerts");
  }
  if (isNaN(region_id)) {
    req.session.alertError = "Invalid region";
    return res.redirect("/alerts");
  }

  // Verify region_id exists
  pool.query(
    "SELECT region_id FROM regions WHERE region_id = ?",
    [region_id],
    (err, regions) => {
      if (err || regions.length === 0) {
        console.error("Error verifying region:", err);
        req.session.alertError = "Invalid region";
        return res.redirect("/alerts");
      }
      pool.query(
        "INSERT INTO alerts (title, description, severity, status, user_id, region_id, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())",
        [
          title,
          description,
          severity,
          "active",
          req.session.user.user_id,
          region_id,
        ],
        (err) => {
          if (err) {
            console.error("Error adding alert:", err);
            req.session.alertError = "Failed to add alert";
            return res.redirect("/alerts");
          }
          res.redirect("/alerts");
        }
      );
    }
  );
});

app.get("/contacts", (req, res) => {
  const { region_id } = req.query;
  let query =
    "SELECT contact_id, service_name, phone_number FROM emergency_contacts";
  let params = [];

  if (region_id) {
    query += " WHERE region_id = ?";
    params.push(region_id);
  }

  pool.query(query, params, (err, contacts) => {
    if (err) {
      console.error("Error fetching contacts:", err);
      return res
        .status(500)
        .render("error", { message: "Failed to load contacts" });
    }
    pool.query("SELECT region_id, region_name FROM regions", (err, regions) => {
      if (err) {
        console.error("Error fetching regions:", err);
        return res
          .status(500)
          .render("error", { message: "Failed to load regions" });
      }
      res.render("contacts", {
        session: req.session,
        contacts: contacts || [],
        regions: regions || [],
        region_id: region_id || "",
      });
    });
  });
});

app.get("/tips", (req, res) => {
  const { category } = req.query;
  let query = "SELECT tip_id, title, description, category FROM safety_tips";
  let params = [];

  if (category) {
    query += " WHERE category = ?";
    params.push(category);
  }

  pool.query(query, params, (err, tips) => {
    if (err) {
      console.error("Error fetching tips:", err);
      return res
        .status(500)
        .render("error", { message: "Failed to load tips" });
    }
    pool.query(
      "SELECT DISTINCT category FROM safety_tips WHERE category IS NOT NULL",
      (err, categories) => {
        if (err) {
          console.error("Error fetching categories:", err);
          return res
            .status(500)
            .render("error", { message: "Failed to load categories" });
        }
        res.render("tips", {
          session: req.session,
          tips: tips || [],
          categories: categories.map((c) => c.category) || [],
          category: category || "",
        });
      }
    );
  });
});

app.get("/volunteer", (req, res) => {
  const error = req.session.volunteerError || null;
  req.session.volunteerError = null; // Clear error after displaying
  pool.query("SELECT region_id, region_name FROM regions", (err, regions) => {
    if (err) {
      console.error("Error fetching regions:", err);
      return res
        .status(500)
        .render("error", { message: "Failed to load regions" });
    }
    pool.query(
      "SELECT volunteer_id, region_id, status, created_at FROM volunteers",
      (err, volunteers) => {
        if (err) {
          console.error("Error fetching volunteers:", err);
          return res
            .status(500)
            .render("error", { message: "Failed to load volunteers" });
        }
        res.render("volunteer", {
          session: req.session,
          regions: regions || [],
          volunteers: volunteers || [],
          error: error,
        });
      }
    );
  });
});

app.post("/volunteer/apply", (req, res) => {
  if (!req.session.user || !req.session.user.user_id) {
    req.session.volunteerError = "Please log in to apply";
    return res.redirect("/volunteer");
  }
  const { region_id } = req.body;

  // Validation
  if (!region_id || isNaN(region_id)) {
    req.session.volunteerError = "Invalid region";
    return res.redirect("/volunteer");
  }

  // Check if region exists
  pool.query(
    "SELECT region_id FROM regions WHERE region_id = ?",
    [region_id],
    (err, regions) => {
      if (err || regions.length === 0) {
        console.error("Error verifying region:", err);
        req.session.volunteerError = "Invalid region";
        return res.redirect("/volunteer");
      }

      // Check for duplicate application
      pool.query(
        "SELECT volunteer_id FROM volunteers WHERE user_id = ? AND region_id = ?",
        [req.session.user.user_id, region_id],
        (err, existing) => {
          if (err) {
            console.error("Error checking duplicate:", err);
            req.session.volunteerError = "Failed to process application";
            return res.redirect("/volunteer");
          }
          if (existing.length > 0) {
            req.session.volunteerError =
              "You have already applied for this region";
            return res.redirect("/volunteer");
          }
          pool.query(
            "INSERT INTO volunteers (user_id, region_id, status, created_at) VALUES (?, ?, ?, NOW())",
            [req.session.user.user_id, region_id, "pending"],
            (err) => {
              if (err) {
                console.error("Error applying as volunteer:", err);
                req.session.volunteerError = "Failed to apply as volunteer";
                return res.redirect("/volunteer");
              }
              res.redirect("/volunteer");
            }
          );
        }
      );
    }
  );
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
