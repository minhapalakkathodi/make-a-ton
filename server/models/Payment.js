const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    customId: { type: String, unique: true },
    invoiceId: { type: String, required: true },
    invoiceNumber: { type: String },
    customerId: { type: String, required: true },
    customerName: { type: String },
    amount: { type: Number, required: true },
    paymentDate: { type: Date, default: Date.now },
    paymentMethod: {
      type: String,
      enum: ['Credit Card', 'UPI', 'Net Banking', 'Bank Transfer', 'Direct Net Banking', 'Cash'],
      default: 'UPI',
    },
    transactionId: { type: String },
    status: { type: String, enum: ['Completed', 'Pending', 'Failed'], default: 'Completed' },
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);

