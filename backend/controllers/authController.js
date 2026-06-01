const crypto = require("crypto");
const User = require("../models/user");
const generateToken = require("../utils/generateToken");
const Franchise = require("../models/masterModels/franchiseModel");

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, phone } = req.body;

    if (!firstName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "First name, email and password are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      role: role || "user",
      phone,
    });

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "User account is inactive",
      });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 mins
    await user.save();

    res.status(200).json({
      success: true,
      message: "Reset password token generated successfully",
      resetToken, // later this will be sent via email
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password/:token
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "New password is required",
      });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    }).select("+password");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    let franchise = null;

    // ✅ FRANCHISE USER
    if (user.franchiseId) {
      franchise = await Franchise.findById(user.franchiseId);
    }

    res.status(200).json({
      user,
      franchise,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logoutUser = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const sendChangePasswordOtp = async (req, res) => {
  try {
    const {
      currentPassword,

      newPassword,
    } = req.body;

    // FIND USER
    const user = await User.findById(req.user.id);

const userWithPassword = await User.findById(req.user.id).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,

        message: "User not found",
      });
    }

    // VERIFY CURRENT PASSWORD
    const isMatch = await userWithPassword.comparePassword( currentPassword);

    if (!isMatch) {
      return res.status(400).json({
        success: false,

        message: "Current password is incorrect",
      });
    }

    // GENERATE OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // SAVE OTP
    user.changePasswordOtp = otp;

    user.changePasswordOtpExpiry = Date.now() + 5 * 60 * 1000;

    // SAVE TEMP PASSWORD
    user.tempNewPassword = newPassword;

    await user.save();

    console.log("CHANGE PASSWORD OTP:", otp);

    res.status(200).json({
      success: true,

      message: "OTP sent successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

const verifyChangePasswordOtp = async (req, res) => {
  try {
    const { otp } = req.body;

    // FIND USER
    const user = await User.findById(req.user.id).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,

        message: "User not found",
      });
    }

    // OTP CHECK
    console.log("DB OTP:", user.changePasswordOtp);

    console.log("ENTERED OTP:", otp);

    if (String(user.changePasswordOtp) !== String(otp)) {
      return res.status(400).json({
        success: false,

        message: "Invalid OTP",
      });
    }

    // OTP EXPIRY
    if (new Date() > user.changePasswordOtpExpiry) {
      return res.status(400).json({
        success: false,

        message: "OTP expired",
      });
    }

    // UPDATE PASSWORD
    user.password = user.tempNewPassword;

    // CLEAR TEMP DATA
    user.changePasswordOtp = null;

    user.changePasswordOtpExpiry = null;

    user.tempNewPassword = null;

    await user.save();

    res.status(200).json({
      success: true,

      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  getMe,
  logoutUser,
  sendChangePasswordOtp,
  verifyChangePasswordOtp,
};
