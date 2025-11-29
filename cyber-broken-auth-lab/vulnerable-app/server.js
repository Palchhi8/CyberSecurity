const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");
const db = require("./db");

const app = express();
const PORT = 5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "views")));


app.get("/", (req, res) => res.sendFile(path.join(__dirname, "views", "index.html")));
app.get("/login", (req, res) => res.sendFile(path.join(__dirname, "views", "login.html")));
app.get("/dashboard", (req, res) => {
 
  const token = req.cookies.session;
  if (!token) return res.status(401).send("Not authenticated. No session token.");

  const q = "SELECT s.id, s.user_id, u.username FROM sessions s JOIN users u ON s.user_id = u.id WHERE s.token = ?";
  db.query(q, [token], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Server error.");
    }
    if (results.length === 0) {
      return res.status(401).send("Invalid session token.");
    }
    
    const username = results[0].username;
    return res.sendFile(path.join(__dirname, "views", "dashboard.html"));
  });
});


app.get('/health', (req, res) => {
  
  db.getConnection((err, conn) => {
    if (err) {
      return res.status(500).json({ status: 'error', db: 'unreachable', error: err.message || err });
    }
    conn.ping((pingErr) => {
      conn.release();
      if (pingErr) return res.status(500).json({ status: 'error', db: 'ping_failed', error: pingErr.message || pingErr });
      return res.status(200).json({ status: 'ok', db: 'ok' });
    });
  });
});
app.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).send("Missing fields.");

  const q = "INSERT INTO users (username, password) VALUES (?, ?)";
  db.query(q, [username, password], (err) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") return res.status(409).send("Username exists.");
      console.error(err);
      return res.status(500).send("Server error.");
    }
    return res.redirect("/login");
  });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).send("Missing fields.");

  const q = "SELECT id FROM users WHERE username = ? AND password = ?";
  db.query(q, [username, password], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Server error.");
    }

    if (results.length === 0) return res.status(401).send("Invalid credentials.");

    const userId = results[0].id;

    const insert = "INSERT INTO sessions (user_id, token) VALUES (?, ?)";
    db.query(insert, [userId, "TEMP_TOKEN"], (insErr, insRes) => {
      if (insErr) {
        console.error(insErr);
        return res.status(500).send("Server error.");
      }
      const insertedId = insRes.insertId;
      const predictableToken = `session-${insertedId}`; 
      const update = "UPDATE sessions SET token = ? WHERE id = ?";
      db.query(update, [predictableToken, insertedId], (updErr) => {
        if (updErr) {
          console.error(updErr);
          return res.status(500).send("Server error.");
        }
      
        res.cookie("session", predictableToken, { httpOnly: false }); 
        return res.redirect("/dashboard");
      });
    });
  });
});


app.post("/logout", (req, res) => {
  const token = req.cookies.session;
  if (token) {
    db.query("DELETE FROM sessions WHERE token = ?", [token], () => {
      res.clearCookie("session");
      res.redirect("/login");
    });
  } else {
    res.redirect("/login");
  }
});

const PUBLIC_URL = process.env.PUBLIC_URL || null;
app.listen(PORT, '0.0.0.0', () => {
  if (PUBLIC_URL) {
    console.log(`Vulnerable app running (host): ${PUBLIC_URL}  — inside container: http://0.0.0.0:${PORT}`);
  } else {
    console.log(`Vulnerable app running at http://0.0.0.0:${PORT}`);
  }
});
