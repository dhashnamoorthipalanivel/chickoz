const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    menuId:          { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem", default: null },
    menuName:        { type: String, required: true },
    qty:             { type: Number, required: true, default: 1 },
    basePrice:       { type: Number, default: 0 },
    discountedPrice: { type: Number, default: 0 },
    addonTotal:      { type: Number, default: 0 },
    taxAmount:       { type: Number, default: 0 },
    finalPrice:      { type: Number, default: 0 },
    addons:          [{ addonName: String, price: Number }],
    notes:           { type: String, default: "" },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber:    { type: String, unique: true },
    franchiseId:    { type: mongoose.Schema.Types.ObjectId, ref: "Franchise", required: true },
    customerId:     { type: mongoose.Schema.Types.ObjectId, ref: "Customer", default: null },
    customerName:   { type: String, default: "Walk-in Customer" },
    customerMobile: { type: String, default: "" },
    orderType:      { type: String, enum: ["DINE_IN", "TAKE_AWAY", "HOME_DELIVERY"], required: true },
    tableNo:        { type: String, default: "" },
    items:          [orderItemSchema],
    subtotal:       { type: Number, default: 0 },
    discount:       { type: Number, default: 0 },
    tax:            { type: Number, default: 0 },
    totalAmount:    { type: Number, default: 0 },
    paymentMethod:  { type: String, enum: ["CASH", "CARD", "UPI", "WALLET", "OTHER"], default: "CASH" },
    paymentStatus:  { type: String, enum: ["PENDING", "PAID"], default: "PAID" },
    orderStatus:    { type: String, enum: ["PENDING", "PREPARING", "COMPLETED", "CANCELLED"], default: "COMPLETED" },
    createdBy:      { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

orderSchema.pre("save", async function (next) {
  if (!this.orderNumber) {
    const count = await mongoose.model("Order").countDocuments();
    this.orderNumber = `ORD-${String(count + 1).padStart(4, "0")}`;
  }
  next();
});

module.exports = mongoose.models.Order || mongoose.model("Order", orderSchema);
