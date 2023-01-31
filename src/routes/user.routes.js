const router = require("express").Router();

const { signup, signin } = require("../controllers/user.controller");
const { isUserAlreadySignedUp } = require("../middlewares/userMiddlewares");

router.route("/auth/signup").post(isUserAlreadySignedUp, signup);

router.route("/auth/signin").post(signin);

module.exports = router;
