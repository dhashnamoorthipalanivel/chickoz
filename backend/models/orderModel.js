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
    orderType:      { type: String, enum: ["DINE_IN", "TAKE_AWAY", "HOME_DELIVERY", "DELIVERY_PARTNER"], required: true },
    deliveryPartner:{ type: String, default: "" },
    deliveryOrderId:{ type: String, default: "" },
    tableNo:        { type: String, default: "" },
    items:          [orderItemSchema],
    subtotal:       { type: Number, default: 0 },
    discount:       { type: Number, default: 0 },
    tax:            { type: Number, default: 0 },
    manualDiscount: { type: Number, default: 0 },
    totalAmount:    { type: Number, default: 0 },
    paymentMethod:  { type: String, enum: ["CASH", "CARD", "UPI", "WALLET", "OTHER", "UPI_CASH"], default: "CASH" },
    splitCash:      { type: Number, default: 0 },
    splitUpi:       { type: Number, default: 0 },
    paymentStatus:  { type: String, enum: ["PENDING", "PAID"], default: "PAID" },
    orderStatus:    { type: String, enum: ["PENDING", "PREPARING", "COMPLETED", "CANCELLED"], default: "COMPLETED" },
    createdBy:      { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

orderSchema.pre("save", async function () {
  if (!this.orderNumber) {
    let code = "ORD";
    let count = 0;
    try {
      const franchise = await mongoose.model("Franchise").findById(this.franchiseId);
      if (franchise) {
        code = franchise.referenceId || franchise.franchiseId || "ORD";
      }

      // Get the last order to determine the next order sequence number.
      // This prevents duplicate key errors if older orders were deleted (which reduces countDocuments).
      const lastOrder = await mongoose.model("Order")
        .findOne({ franchiseId: this.franchiseId })
        .sort({ createdAt: -1 });

      if (lastOrder && lastOrder.orderNumber) {
        const parts = lastOrder.orderNumber.split('-');
        const numStr = parts[parts.length - 1];
        if (!isNaN(numStr)) {
          count = parseInt(numStr, 10);
        } else {
          count = await mongoose.model("Order").countDocuments({ franchiseId: this.franchiseId });
        }
      }
    } catch(e) {
      console.error("Error generating order number:", e);
    }
    this.orderNumber = `${code}-${String(count + 1).padStart(4, "0")}`;
  }
});

module.exports = mongoose.models.Order || mongoose.model("Order", orderSchema);
