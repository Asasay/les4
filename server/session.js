const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);

const options = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
};

MySQLStore.prototype.clearByIDs = async function (id) {
  this.all().then((sessions) => {
    for (const sid in sessions) {
      if (Object.hasOwnProperty.call(sessions, sid)) {
        const sessionObj = sessions[sid];
        if (id.includes(sessionObj.passport.user.id))
          sessOptions.store.destroy(sid);
      }
    }
  });
};

const sessionStore = new MySQLStore(options);

// Optionally use onReady() to get a promise that resolves when store is ready.
sessionStore
  .onReady()
  .then(() => {
    // MySQL session store ready for use.
    console.log("MySQLStore ready");
  })
  .catch((error) => {
    // Something went wrong.
    console.error(error);
  });

var sessOptions = {
  secret: "i live in your basement",
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {},
};

module.exports = { sessOptions, sessionStore };
