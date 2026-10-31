const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    customId: { type: String, unique: true },
    name: { type: String, required: true },
    type: { type: String, default: 'Software' },
    category: { type: String, default: 'Software' },
    price: { type: Number, required: true },
    description: { type: String },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);

