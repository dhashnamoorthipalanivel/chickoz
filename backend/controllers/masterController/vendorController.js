const Vendor = require("../../models/masterModels/vendorModel");

exports.createVendor = async (req, res) => {
  try {

    const { name, companyName, phone, email, gstNo, address, city, state, bankName, accountNumber, ifscCode, accountHolderName, status } = req.body;
    if (!name || !phone || !gstNo || !address || !city || !state || !bankName || !accountNumber || !ifscCode || !accountHolderName) {
      return res.status(400).json({ success: false, message: "All basic and bank details are required fields" });
    }

    const vendors = await Vendor.find({}, "vendorCode");
    let maxNumber = 0;

    vendors.forEach((v) => {
      if (v.vendorCode && v.vendorCode.startsWith("VND")) {
        const num = parseInt(v.vendorCode.replace("VND", ""));
        if (!isNaN(num) && num > maxNumber) {
          maxNumber = num;
        }
      }
    });

    const vendorCode = `VND${String(maxNumber + 1).padStart(3, "0")}`;

    const newVendor = await Vendor.create({
      vendorCode,
      name,
      companyName,
      phone,
      email,
      gstNo,
      address,
      city,
      state,
      bankName,
      accountNumber,
      ifscCode,
      accountHolderName,
      status: status || "ACTIVE",
    });

    res.status(201).json({ success: true, message: "Vendor created successfully", data: newVendor });
  } catch (error) {
    console.error("Create Vendor Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.getAllVendors = async (req, res) => {
  try {

    const vendors = await Vendor.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: vendors });
  } catch (error) {
    console.error("Get All Vendors Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.getSingleVendor = async (req, res) => {
  try {
    if (!isAdmin(req.user)) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }

    res.status(200).json({ success: true, data: vendor });
  } catch (error) {
    console.error("Get Single Vendor Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.updateVendor = async (req, res) => {
  try {

    const { name, phone, gstNo, address, city, state, bankName, accountNumber, ifscCode, accountHolderName } = req.body;
    if (!name || !phone || !gstNo || !address || !city || !state || !bankName || !accountNumber || !ifscCode || !accountHolderName) {
      return res.status(400).json({ success: false, message: "All basic and bank details are required fields" });
    }

    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }

    res.status(200).json({ success: true, message: "Vendor updated successfully", data: vendor });
  } catch (error) {
    console.error("Update Vendor Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.deleteVendor = async (req, res) => {
  try {

    const vendor = await Vendor.findByIdAndDelete(req.params.id);
    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }

    res.status(200).json({ success: true, message: "Vendor deleted successfully" });
  } catch (error) {
    console.error("Delete Vendor Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
