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

// router.get("/", (req, res) => {
//   res.send("Auth Route Working");
// });

// module.exports = router;


const express = require("express");

const router = express.Router();

router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Auth route working",
  });
});

module.exports = router;
