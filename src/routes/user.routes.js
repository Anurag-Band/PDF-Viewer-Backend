const router = require("express").Router();

const {
  signup,
  signin,
  getLoggedInUserDetails,
  logout,
} = require("../controllers/user.controller");
const {
  isUserAlreadySignedUp,
  isUserLoggedIn,
} = require("../middlewares/userMiddlewares");

router.route("/auth/signup").post(isUserAlreadySignedUp, signup);

router.route("/auth/signin").post(signin);

router.route("/auth/me").get(isUserLoggedIn, getLoggedInUserDetails);

router.route("/auth/logout").get(logout);

module.exports = router;
