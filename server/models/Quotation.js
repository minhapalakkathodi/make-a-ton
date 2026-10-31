const mongoose = require('mongoose');

const quotationSchema = new mongoose.Schema(
  {
    quotationNumber: { type: String, unique: true, required: true },
    customerId: { type: String, required: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String },
    productId: { type: String },
    productName: { type: String },
    planId: { type: String },
    planName: { type: String, required: true },
    quantity: { type: Number, default: 1 },
    unitPrice: { type: Number, required: true },
    subtotal: { type: Number, required: true },
    discountCode: { type: String },
    discountAmount: { type: Number, default: 0 },
    taxPercent: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    validUntil: { type: Date, required: true },
    issueDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['Draft', 'Pending', 'Approved', 'Rejected', 'Converted'],
      default: 'Pending',
    },
    convertedSubscriptionId: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Quotation', quotationSchema);

