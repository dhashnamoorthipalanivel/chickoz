// const express = require("express");
// const {
//   registerUser,
//   loginUser,
//   forgotPassword,
//   resetPassword,
//   getMe,
//   logoutUser,
//   sendChangePasswordOtp,
//   verifyChangePasswordOtp,
// } = require("../controllers/authController");

// const { protect } = require("../middleware/authMiddleware");
// const router = express.Router();

// router.post("/register", registerUser);
// router.post("/login", loginUser);
// router.post("/forgot-password", forgotPassword);
// router.post("/reset-password/:token", resetPassword);
// router.get("/me", protect, getMe);
// router.post("/logout", protect, logoutUser);
// router.post("/send-change-password-otp", protect, sendChangePasswordOtp);
// router.post("/verify-change-password-otp", protect, verifyChangePasswordOtp);

// module.exports = router;


const express = require("express");

const {
  loginUser,
} = require("../controllers/authController");

const router = express.Router();

router.post("/login", loginUser);

module.exports = router;