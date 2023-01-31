const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const db = require("../models");
const CookieToken = require("../utils/cookieToken");
const User = db.user;

exports.signup = asyncHandler(async (req, res, next) => {
  // Save user to database
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  })
    .then((user) => {
      if (user) {
        res.send({ message: "User was registered successfully!" }, 200);
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
});
exports.signin = asyncHandler(async (req, res, next) => {
  User.findOne({
    where: {
      username: req.body.username,
    },
  })
    .then((user) => {
      if (!user) {
        return res
          .status(404)
          .send({ message: "User Not found, please sign up" });
      }

      let passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }

      CookieToken(user, 201, res);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
});
