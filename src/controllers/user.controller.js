const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const db = require("../models");
const CookieToken = require("../utils/cookieToken");
const User = db.user;

exports.signup = asyncHandler(async (req, res, next) => {
  if (!req.body.username || !req.body.email || !req.body.password) {
    return res.status(401).send("All Fields are mendatory!");
  }

  // Save user to database
  const user = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  });

  const userDetails = user.dataValues;
  CookieToken(userDetails, 201, res);
});

exports.signin = asyncHandler(async (req, res, next) => {
  if (!req.body.username || !req.body.password) {
    return res.status(401).send("All Fields are mendatory!");
  }

  const user = await User.findOne({
    where: {
      username: req.body.username,
    },
  });

  if (!user) {
    return res.status(404).send({ message: "User Not found, please sign up" });
  }

  let passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

  if (!passwordIsValid) {
    return res.status(401).send({
      accessToken: null,
      message: "Invalid Password!",
    });
  }
  const userDetails = user.dataValues;
  CookieToken(userDetails, 201, res);
});

exports.getLoggedInUserDetails = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({
    where: {
      id: req.user.id,
    },
  });

  res.status(200).send({
    success: true,
    user,
  });
});

exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).send({
    success: true,
    message: "User is Logged Out Successfully!!!",
  });
});
