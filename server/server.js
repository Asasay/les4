//e.g server.js
const express = require("express");
const ViteExpress = require("vite-express");
const passport = require("passport");
const session = require("express-session");
const path = require("path");
const { User } = require("./db.js");
const { sessOptions, sessionStore } = require("./session.js");
const { passportInitStrat } = require("./passport.js");
require("dotenv").config();

const app = express();

app.use("/", express.static(path.join(__dirname, "dist")));

app.use(express.json());

if (app.get("env") === "production") {
  app.set("trust proxy", 1); // trust first proxy
  sessOptions.cookie.secure = true; // serve secure cookies
}

passportInitStrat();
app.use(session(sessOptions));
app.use(passport.session());

app.get("/", (req, res, next) => {
  console.log("PASSPORT " + req.session.passport);
  console.log("PASSPORT " + req.session.passport?.user.id);
  console.log("SESSION " + req.sessionID);

  if (!req.isAuthenticated()) res.status(401).redirect("/login");
  else next();
});

app.post("/signout", (req, res, next) => {
  console.log("PASSPORT " + req.session.passport);
  console.log("USER ID " + req.session.passport?.user.id);
  console.log("SESSIONID " + req.sessionID);
  if (req.isAuthenticated()) {
    req.logout((err) => {
      if (err) {
        console.log(err);
        return next(err);
      }
      res.redirect("/login");
    });
  } else res.send("You are already not logged in");
});

app.post("/login", (req, res, next) => {
  passport.authenticate("local", function (err, user, message) {
    if (err) {
      return next(err);
    }
    if (message) {
      return res.status(404).send(message);
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      return res.redirect("/");
    });
  })(req, res);
});

app.post("/register", (req, res) => {
  let data = req.body;
  User.findOne({ where: { User: data.username } }).then((user) => {
    if (!user) {
      const salt = crypto.randomBytes(16).toString("base64");
      const hashedPassword = crypto
        .pbkdf2Sync(data.password, salt, 1000, 32, "sha256")
        .toString("base64");

      User.create({
        User: data.username,
        hashedPassword: hashedPassword,
        salt: salt,
        status: "active",
      });
      res.status(201).redirect("/login");
    } else res.status(409).send("User already exists!");
  });
});

app.all("/users", (req, res, next) => {
  if (!req.isAuthenticated()) res.status(403).redirect("/login");
  else next();
});

app.get("/users", (req, res) => {
  User.findAll({ attributes: ["id", "User", "status", "createdAt"] }).then(
    (users) =>
      users.length !== 0
        ? res.json(users)
        : res.status(404).send("Unable to find any users")
  );
});

app.delete("/users", (req, res) => {
  User.destroy({ where: { id: req.body } }).then((count) => {
    sessionStore.clearByIDs(req.body);
    res.write(`Removed ${count} users`);
    res.send();
  });
});

app.put("/users", (req, res) => {
  console.log(req.body);
  if (!req.body.action || !req.body.id) res.sendStatus(405);
  switch (req.body.action) {
    case "block":
      User.update({ status: "blocked" }, { where: { id: req.body.id } }).then(
        () => res.sendStatus(200)
      );
      sessionStore.clearByIDs(req.body.id);
      break;
    case "unblock":
      User.update({ status: "active" }, { where: { id: req.body.id } }).then(
        () => res.sendStatus(200)
      );
      break;
    default:
      res.sendStatus(405);
      break;
  }
});

app.get("/*", (_req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Express: Server is listening on port ${PORT}`);
});
