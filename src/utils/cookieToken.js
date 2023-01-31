const jwt = require("jsonwebtoken");

// Create Token and Saving in Cookies
const CookieToken = (user, statusCode, res) => {
  const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRY,
  });

  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRY * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  user.password = undefined;
  res.status(statusCode).cookie("token", token, options).send({
    success: true,
    token,
    user,
  });
};

module.exports = CookieToken;
