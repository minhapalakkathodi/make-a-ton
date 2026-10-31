const mongoose = require('mongoose');

const planSchema = new mongoose.Schema(
  {
    customId: { type: String, unique: true },
    productId: { type: String },
    productName: { type: String, default: 'Software Service' },
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    interval: { type: String, enum: ['Daily', 'Weekly', 'Monthly', 'Yearly'], default: 'Monthly' },
    billing: { type: String, default: 'Monthly' },
    minQuantity: { type: Number, default: 1 },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Plan', planSchema);

