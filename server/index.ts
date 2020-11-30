import dotenv from "dotenv";
dotenv.config();
import express from "express";
import next from "next";
import mongoose from "mongoose";
import cookieSession from "cookie-session";
import passport from "passport";

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

import authRouter from "./routes/auth";
import userRouter from "./routes/user";
import feedRouter from "./routes/feed";
require("./services/passport");

app.prepare().then(() => {
  const server = express();
  server.use(express.json());

  server.use(
    cookieSession({
      maxAge: 30 * 24 * 60 * 60 * 1000,
      keys: [process.env.COOKIE_KEY],
    })
  );

  server.use(passport.initialize());
  server.use(passport.session());

  server.use(authRouter);
  server.use("/api", userRouter);
  server.use("/api", feedRouter);

  server.all("*", (req, res) => {
    return handle(req, res);
  });

  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })
    .then(() => {
      console.log("connected to mongodb");
      server.listen(port, () => {
        console.log(`> Ready on http://localhost:${port}`);
      });
    });
});
