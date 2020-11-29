const express = require("express");
const router = express.Router();

router.get("/auth/google", (req, res, next) => {
  res.send({ hello: "asdf" });
});

module.exports = router;
