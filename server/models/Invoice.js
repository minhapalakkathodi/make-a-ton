const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, unique: true, required: true },
    subscriptionId: { type: String },
    customerId: { type: String, required: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String },
    customerAddress: { type: String },
    issueDate: { type: Date, default: Date.now },
    dueDate: { type: Date, required: true },
    status: { type: String, enum: ['Paid', 'Pending', 'Overdue'], default: 'Pending' },
    items: [
      {
        description: { type: String, required: true },
        quantity: { type: Number, default: 1 },
        unitPrice: { type: Number, required: true },
        amount: { type: Number, required: true },
      },
    ],
    subtotal: { type: Number, default: 0 },
    discountCode: { type: String },
    discountAmount: { type: Number, default: 0 },
    taxPercent: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 },
    paidDate: { type: Date },
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Invoice', invoiceSchema);

