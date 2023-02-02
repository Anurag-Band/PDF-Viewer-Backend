const db = require("../models");
const User = db.user;
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

exports.isUserLoggedIn = asyncHandler(async (req, res, next) => {
  let token = req.cookies.token;

  if (!token && req.header("Authorization")) {
    token = req.header("Authorization").replace("Bearer ", "");
  }

  if (!token) {
    return res.status(401).send();
  }

  const decoded = jwt.verify(token, process.env.SECRET_KEY);

  const userDetails = await User.findOne({
    where: {
      id: decoded.id,
    },
  });

  req.user = userDetails.dataValues;
  next();
});

exports.isUserAlreadySignedUp = asyncHandler(async (req, res, next) => {
  // Username
  User.findOne({
    where: {
      username: req.body.username,
    },
  }).then((user) => {
    if (user) {
      res.status(400).send({
        message: "Failed! Username is already in use!",
      });
      return;
    }

    // Email
    User.findOne({
      where: {
        email: req.body.email,
      },
    }).then((user) => {
      if (user) {
        res.status(400).send({
          message: "Failed! Email is already in use!",
        });
        return;
      }

      next();
    });
  });
});
