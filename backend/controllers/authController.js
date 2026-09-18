const crypto = require("crypto");
// const User = require("../models/User");
const User = require("../models/User")
// const generateToken = require("../utils/generateToken");
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

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });

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

    const cleanInput = email.toLowerCase().trim();
    const bcrypt = require("bcryptjs");

    // 1. Search in User collection by email or phone
    let user = await User.findOne({
      $or: [{ email: cleanInput }, { phone: cleanInput }]
    }).select("+password");

    let isMatch = false;

    if (user) {
      isMatch = await user.comparePassword(password);
    }

    // 2. Fallback search in Franchise collection if user not found or password didn't match
    if (!user || !isMatch) {
      const franchise = await Franchise.findOne({
        $or: [{ email: cleanInput }, { contact: cleanInput }],
        isDeleted: false
      });

      if (franchise && franchise.password) {
        let franPassMatch = password === franchise.password;
        if (!franPassMatch && franchise.password.startsWith("$2a$")) {
          try {
            franPassMatch = await bcrypt.compare(password, franchise.password);
          } catch (_) { }
        }

        if (franPassMatch) {
          user = await User.findOne({
            $or: [{ franchiseId: franchise._id }, { email: franchise.email }, { phone: franchise.contact }]
          }).select("+password");

          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(password, salt);

          if (!user) {
            user = await User.create({
              firstName: franchise.ownerName || franchise.franchiseName,
              email: franchise.email,
              phone: franchise.contact,
              password: hashedPassword,
              role: "franchise",
              franchiseId: franchise._id,
              isActive: true,
              isEmailVerified: true
            });
          } else {
            user.password = hashedPassword;
            user.email = franchise.email;
            user.phone = franchise.contact;
            user.role = "franchise";
            user.franchiseId = franchise._id;
            user.isActive = true;
            await user.save();
          }

          isMatch = true;
        }
      }
    }

    if (!user || !isMatch) {
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

    await User.findByIdAndUpdate(user._id, { lastLogin: new Date() });

    const token = generateToken(user);
    
    // Fetch permissions via RoleAssignment
    const RoleAssignment = require("../models/RoleAssignment");
    const Role = require("../models/Role");
    
    let permissions = [];
    if (user.role === 'super_admin') {
      permissions = ['all'];
    } else {
      const assignment = await RoleAssignment.findOne({ userId: user._id }).populate('roleId');
      if (assignment && assignment.roleId) {
        permissions = assignment.roleId.permissions || [];
      } else if (user.role === 'franchise') {
        // Give franchise owner full access to their own isolated franchise
        permissions = ['all'];
      }
    }

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
        franchiseId: user.franchiseId,
        permissions,
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

    const user = await User.findOne({ email: email.toLowerCase().trim() });

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
    const isMatch = await userWithPassword.comparePassword(currentPassword);

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

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "Current and new password are required" });
    }

    const user = await User.findById(req.user.id).select("+password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Incorrect current password" });
    }

    user.password = newPassword;
    await user.save();

    // Also update the Franchise document password if it's a franchise user
    if (user.role === "franchise" && user.franchiseId) {
      const franchise = await Franchise.findById(user.franchiseId);
      if (franchise) {
        franchise.password = newPassword;
        await franchise.save();
      }
    }

    res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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
  changePassword,
};
