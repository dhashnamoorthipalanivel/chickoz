const Franchise = require("../../models/masterModels/franchiseModel");
const sendMail = require("../../config/sendMail");
const User = require("../../models/user");

// ==========================================
// GET ALL
// ==========================================

exports.getFranchises = async (req, res) => {
  try {



    const data = await Franchise.find({
      isDeleted: false,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json(data);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================================
// GET SINGLE
// ==========================================

exports.getFranchiseById = async (req, res) => {
  try {
    const data = await Franchise.findById(req.params.id);

    if (!data) {
      return res.status(404).json({
        message: "Franchise not found",
      });
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================================
// UPDATE
// ==========================================

exports.updateFranchise = async (req, res) => {
  console.log("UPDATE FRANCHISE CALLED WITH BODY:", req.body);
  try {
    const updatedData = await Franchise.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      },
    );

    if (!updatedData) {
      return res.status(404).json({
        message: "Franchise not found",
      });
    }

    // Handle User creation/update if username or password provided
    const { username, password } = req.body;
    if (username || password) {
      const User = require("../../models/user");
      let user = await User.findOne({
          $or: [
              { franchiseId: updatedData._id }, 
              { email: username },
              { phone: updatedData.contact }
          ]
      });
      if (!user) {
        // Create if they typed a password
        if (password && username) {
          user = await User.create({
            firstName: updatedData.ownerName,
            email: username,
            phone: updatedData.contact,
            password: password,
            role: "franchise",
            franchiseId: updatedData._id,
            isActive: true,
            isEmailVerified: true
          });
          updatedData.inviteStatus = "ACTIVE";
          updatedData.passwordSetupAt = new Date();
          updatedData.email = username;
          updatedData.password = password;
          await updatedData.save();
        }
      } else {
        // Update existing
        if (username) {
          user.email = username;
          updatedData.email = username;
        }
        if (password) {
          user.password = password; // Will be hashed by pre-save hook
          updatedData.password = password; // Save plaintext to Franchise model for clipboard popup
        }
        user.franchiseId = updatedData._id; // Ensure linked
        await user.save();
        if (username || password) await updatedData.save();
      }
    }

    res.status(200).json({
      message: "Franchise updated successfully",

      data: updatedData,
    });
  } catch (error) {
    console.error("FRANCHISE UPDATE ERROR: ", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// Franchise email token
const crypto = require("crypto");

exports.sendFranchiseInvite = async (req, res) => {
  try {
    const franchise = await Franchise.findById(req.params.id);

    if (!franchise) {
      return res.status(404).json({
        message: "Franchise not found",
      });
    }



    // ✅ RESEND COOLDOWN (2 MINUTES)
    const cooldownTime = 2 * 60 * 1000;

    if (
      franchise.inviteSentAt &&
      Date.now() - new Date(franchise.inviteSentAt).getTime() < cooldownTime
    ) {
      const remainingTime = Math.ceil(
        (cooldownTime -
          (Date.now() - new Date(franchise.inviteSentAt).getTime())) /
        1000
      );

      return res.status(400).json({
        message: `Please wait ${remainingTime} seconds before resending invitation`,
      });
    }

    // ✅ GENERATE TOKEN
    const inviteToken = crypto.randomBytes(32).toString("hex");

    // ✅ 2 HOURS EXPIRY
    const inviteExpiry = new Date(Date.now() + 2 * 60 * 60 * 1000);

    // ✅ SAVE
    franchise.inviteToken = inviteToken;

    franchise.inviteExpiry = inviteExpiry;

    franchise.inviteSentAt = new Date();

    franchise.inviteStatus = "INVITE_SENT";

    franchise.inviteCount += 1;

    await franchise.save();

    // ✅ EMAIL LINK
    const inviteLink = `http://localhost:5173/auth-setup-password?token=${inviteToken}`;

    await sendMail({
      to: franchise.email,

      subject: "Franchise Invitation",

      html: `

    <h2>
      Welcome to Chickoz
    </h2>

    <p>
      Your franchise account
      has been created.
    </p>

    <p>
      Click below to setup password:
    </p>

    <a href="${inviteLink}">
      Setup Password
    </a>

    <p>
      Link valid for 2 hours.
    </p>
  `,
    });

    res.status(200).json({
      message: "Invitation sent successfully",
      inviteLink,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

exports.verifyInviteToken = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        message: "Token missing",
      });
    }

    const franchise = await Franchise.findOne({
      inviteToken: token,
    });

    if (!franchise) {
      return res.status(400).json({
        message: "Invalid invitation link",
      });
    }

    // ✅ CHECK EXPIRY
    if (new Date() > franchise.inviteExpiry) {
      franchise.inviteStatus = "EXPIRED";

      await franchise.save();

      return res.status(400).json({
        message: "Invitation link expired",
      });
    }

    res.status(200).json({
      message: "Token valid",

      franchise: {
        franchiseId: franchise.franchiseId,

        franchiseName: franchise.franchiseName,

        ownerName: franchise.ownerName,

        email: franchise.email,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

exports.setupPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        message: "Token and password required",
      });
    }

    // ✅ PASSWORD STRENGTH VALIDATION
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must contain uppercase, lowercase, number, special character and minimum 8 characters",
      });
    }

    // ✅ FIND FRANCHISE
    const franchise = await Franchise.findOne({
      inviteToken: token,
    });

    if (!franchise) {
      return res.status(400).json({
        message: "Invalid token",
      });
    }

    // ✅ CHECK EXPIRY
    if (new Date() > franchise.inviteExpiry) {
      franchise.inviteStatus = "EXPIRED";

      await franchise.save();

      return res.status(400).json({
        message: "Invitation expired",
      });
    }

    // ✅ CHECK EXISTING USER
    const existingUser = await User.findOne({
      email: franchise.email,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // ✅ CREATE USER
    await User.create({
      firstName: franchise.ownerName,

      email: franchise.email,

      phone: franchise.contact,

      password: password,

      role: "franchise",

      franchiseId: franchise._id,

      isActive: true,

      isEmailVerified: true,
    });

    // ✅ UPDATE FRANCHISE
    franchise.inviteStatus = "ACTIVE";

    franchise.inviteToken = "";

    franchise.inviteExpiry = null;

    franchise.inviteSentAt = null;

    franchise.passwordSetupAt = new Date();

    await franchise.save();

    res.status(200).json({
      message: "Password setup successful",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};
