require("dotenv").config();
const express = require("express");
const next = require("next");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const passport = require("passport");

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
require("./services/passport");

app.prepare().then(() => {
  const server = express();
  server.use(express.json());

  // server.get("/a", (req, res) => {
  //   return app.render(req, res, "/a", req.query);
  // });

  // server.get("/b", (req, res) => {
  //   return app.render(req, res, "/b", req.query);
  // });

  server.use(
    cookieSession({
      maxAge: 30 * 24 * 60 * 60 * 1000,
      keys: [process.env.COOKIE_KEY],
    })
  );

  server.use(passport.initialize());
  server.use(passport.session());

  server.use(authRouter);
  server.use(userRouter);

  server.all("*", (req, res) => {
    return handle(req, res);
  });

  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("connected to mongodb");
      server.listen(port, (err) => {
        if (err) throw err;
        console.log(`> Ready on http://localhost:${port}`);
      });
    });
});
