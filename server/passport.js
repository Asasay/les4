const passport = require("passport");
const LocalStrategy = require("passport-local");
var crypto = require("crypto");
const { User } = require("./db.js");

const passportInitStrat = () => {
  passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
      cb(null, { id: user.id, username: user.User });
    });
  });

  passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
      return cb(null, user);
    });
  });

  passport.use(
    new LocalStrategy((username, password, cb) => {
      User.findOne({ where: { User: username } }).then((user) => {
        if (!user) return cb(null, false, "User doesnt exist");

        if (user.status == "blocked") return cb(null, false, "User is blocked");

        crypto.pbkdf2(
          password,
          user.salt,
          1000,
          32,
          "sha256",
          function (err, hashedPassword) {
            if (err) {
              return cb(err);
            }
            if (
              !crypto.timingSafeEqual(
                Buffer.from(user.hashedPassword, "base64"),
                hashedPassword
              )
            ) {
              return cb(null, false, "Incorrect username or password.");
            }
            return cb(null, user);
          }
        );
      });
    })
  );
};

module.exports = { passportInitStrat };
