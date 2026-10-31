const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema(
  {
    customId: { type: String, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String },
    company: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Customer', customerSchema);

