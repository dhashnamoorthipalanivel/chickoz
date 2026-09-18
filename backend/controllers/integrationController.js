const Integration = require("../models/integrationModel");

// Get integration status
exports.getIntegrations = async (req, res) => {
  try {
    const integrations = await Integration.find();
    res.json(integrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Upsert integration configuration
exports.configureIntegration = async (req, res) => {
  try {
    const { platform, verifyToken, pageId, accessToken, isActive } = req.body;

    if (!platform) {
      return res.status(400).json({ message: "Platform is required" });
    }

    let integration = await Integration.findOne({ platform });

    if (integration) {
      // Update existing
      integration.verifyToken = verifyToken !== undefined ? verifyToken : integration.verifyToken;
      integration.pageId = pageId !== undefined ? pageId : integration.pageId;
      integration.accessToken = accessToken !== undefined ? accessToken : integration.accessToken;
      integration.isActive = isActive !== undefined ? isActive : integration.isActive;
      await integration.save();
    } else {
      // Create new
      integration = await Integration.create({
        platform,
        verifyToken,
        pageId,
        accessToken,
        isActive: isActive !== undefined ? isActive : true,
      });
    }

    res.status(200).json({ success: true, integration });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
