const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema(
  {
    customId: { type: String, unique: true },
    customerId: { type: String, required: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String },
    productId: { type: String },
    productName: { type: String },
    planId: { type: String },
    planName: { type: String, required: true },
    interval: { type: String, default: 'Monthly' },
    unitPrice: { type: Number, required: true },
    quantity: { type: Number, default: 1 },
    discountCode: { type: String },
    discountAmount: { type: Number, default: 0 },
    taxPercent: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    startDate: { type: Date, default: Date.now },
    nextRenewalDate: { type: Date },
    status: {
      type: String,
      enum: ['Draft', 'Quotation', 'Confirmed', 'Active', 'Closed'],
      default: 'Active',
    },
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Subscription', subscriptionSchema);

