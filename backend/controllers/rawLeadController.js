const RawLead = require("../models/rawLeadModel");
const Enquiry = require("../models/enquiryModel");

const generateReferenceId = async () => {
  const enquiries = await Enquiry.find({}).select("referenceId");
  let maxNumber = 0;
  enquiries.forEach((item) => {
    if (!item.referenceId) return;
    const num = parseInt(item.referenceId.replace("REF", ""), 10);
    if (!isNaN(num) && num > maxNumber) {
      maxNumber = num;
    }
  });
  return `REF${String(maxNumber + 1).padStart(3, "0")}`;
};

const axios = require("axios");
const Integration = require("../models/integrationModel");

// ... (keep generateReferenceId and getPendingLeads) ...

exports.getPendingLeads = async (req, res) => {
  try {
    const leads = await RawLead.find({ status: "PENDING" }).sort({ createdAt: -1 });
    res.status(200).json(leads);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch social leads" });
  }
};

// GET /api/raw-leads/webhook - Webhook Verification (Facebook/Instagram)
exports.verifyWebhook = async (req, res) => {
  try {
    const fbIntegration = await Integration.findOne({ platform: "FACEBOOK" });
    const igIntegration = await Integration.findOne({ platform: "INSTAGRAM" });
    
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    const validToken = (fbIntegration && fbIntegration.verifyToken === token) || 
                       (igIntegration && igIntegration.verifyToken === token);

    if (mode === "subscribe" && validToken) {
      console.log("Meta Webhook Verified!");
      return res.status(200).send(challenge);
    } else {
      return res.sendStatus(403);
    }
  } catch (err) {
    console.error("Webhook Verification Error:", err);
    res.sendStatus(500);
  }
};

// POST /api/raw-leads/webhook - Handle Webhook Payloads
exports.webhookHandler = async (req, res) => {
  try {
    const body = req.body;

    // Check if this is a Meta (Facebook or Instagram) payload
    if (body.object === "page" || body.object === "instagram") {
      const isIg = body.object === "instagram";
      const platform = isIg ? "INSTAGRAM" : "FACEBOOK";
      const metaIntegration = await Integration.findOne({ platform });
      
      if (!metaIntegration || !metaIntegration.accessToken) {
        console.error(`${platform} integration not configured for webhook payload`);
        return res.status(403).send(`${platform} integration not configured`);
      }

      for (const entry of body.entry) {
        for (const change of entry.changes) {
          if (change.value && change.value.leadgen_id) {
            const leadgenId = change.value.leadgen_id;
            const formId = change.value.form_id;

            // Fetch lead details from Facebook Graph API (Handles both FB and IG leads)
            try {
              const fbRes = await axios.get(`https://graph.facebook.com/v19.0/${leadgenId}?access_token=${metaIntegration.accessToken}`);
              const leadData = fbRes.data;

              // Parse field data
              let name = "Unknown Web Lead";
              let phone = "0000000000";
              let email = "";

              if (leadData.field_data) {
                leadData.field_data.forEach(field => {
                  if (field.name === "full_name") name = field.values[0];
                  if (field.name === "phone_number") phone = field.values[0].replace(/[^0-9]/g, ""); // Keep only digits
                  if (field.name === "email") email = field.values[0];
                });
              }

              await RawLead.create({
                name,
                phone: phone.substring(phone.length - 10), // keep last 10 digits
                email,
                platform,
                campaignName: `Form ID: ${formId}`,
                rawData: leadData
              });
              console.log(`Successfully processed ${platform} lead: ${leadgenId}`);
            } catch (graphErr) {
              console.error("Meta Graph API Error:", graphErr?.response?.data || graphErr.message);
            }
          }
        }
      }
      return res.status(200).send("EVENT_RECEIVED");
    }

    // Check if this is a Google Ads Lead Form payload
    if (body.google_key) {
      const googleIntegration = await Integration.findOne({ platform: "GOOGLE" });
      
      if (!googleIntegration || googleIntegration.verifyToken !== body.google_key) {
        console.error("Google Ads integration not configured or invalid key");
        return res.status(403).send("Invalid google_key");
      }

      let name = "Unknown Google Lead";
      let phone = "0000000000";
      let email = "";

      if (body.user_column_data) {
        body.user_column_data.forEach(col => {
          const colName = col.column_name ? col.column_name.toLowerCase() : "";
          if (colName.includes("name")) name = col.string_value;
          if (colName.includes("phone")) phone = col.string_value.replace(/[^0-9]/g, "");
          if (colName.includes("email")) email = col.string_value;
        });
      }

      await RawLead.create({
        name,
        phone: phone.substring(phone.length - 10),
        email,
        platform: "GOOGLE",
        campaignName: `Campaign ID: ${body.campaign_id || 'Unknown'}`,
        rawData: body
      });
      console.log(`Successfully processed Google Ads lead: ${body.lead_id}`);
      
      return res.status(200).json({ message: "Lead processed successfully" });
    }

    // Default fallback for other platforms (or generic test webhook)
    const newLead = await RawLead.create({
      name: req.body.name || "Unknown Web Lead",
      phone: req.body.phone || "0000000000",
      email: req.body.email || "",
      platform: req.body.platform || "OTHER",
      campaignName: req.body.campaignName || "Organic",
      rawData: req.body
    });
    res.status(201).json({ success: true, lead: newLead });
  } catch (err) {
    console.error("Webhook processing error:", err);
    res.status(500).json({ message: "Failed to process webhook" });
  }
};

exports.convertToEnquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const rawLead = await RawLead.findById(id);

    if (!rawLead) return res.status(404).json({ message: "Lead not found" });
    if (rawLead.status === "CONVERTED") return res.status(400).json({ message: "Lead already converted" });

    // Ensure required fields are provided by the client
    const { interestedPackage, place } = req.body;
    
    if (!interestedPackage || !place) {
      return res.status(400).json({ message: "Package and Place are required to convert to an Enquiry" });
    }

    const referenceId = await generateReferenceId();

    // Auto-resolve Lead Source based on platform
    const LeadSource = require("../models/masterModels/leadSourceModel");
    let sourceName = rawLead.platform === "FACEBOOK" ? "Facebook Lead Ads" : 
                     rawLead.platform === "GOOGLE" ? "Google Ads" : 
                     rawLead.platform === "INSTAGRAM" ? "Instagram Ads" : "Social Media";
                     
    let source = await LeadSource.findOne({ leadSourceName: sourceName });
    if (!source) {
      source = await LeadSource.create({ leadSourceName: sourceName, leadSourceType: "SOCIAL_MEDIA" });
    }

    const enquiry = await Enquiry.create({
      referenceId,
      name: rawLead.name,
      phone: (rawLead.phone.replace(/[^0-9]/g, "") + "0000000000").substring(0, 10), // Ensure exactly 10 digits
      email: rawLead.email,
      place,
      interestedPackage,
      leadSource: source._id,
      assignedTo: "Admin", // default assignee to prevent validation error
      state: req.body.state || "",
      address: req.body.address || "",
      postCode: req.body.postCode || "",
    });

    rawLead.status = "CONVERTED";
    rawLead.convertedToEnquiry = enquiry._id;
    await rawLead.save();

    res.status(200).json({ success: true, enquiry });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to convert lead" });
  }
};
