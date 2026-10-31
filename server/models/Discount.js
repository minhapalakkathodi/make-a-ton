const mongoose = require('mongoose');

const discountSchema = new mongoose.Schema(
  {
    code: { type: String, unique: true, uppercase: true, required: true },
    type: { type: String, enum: ['percentage', 'fixed'], default: 'percentage' },
    value: { type: Number, required: true },
    minPurchaseAmount: { type: Number, default: 0 },
    minQuantity: { type: Number, default: 1 },
    startDate: { type: Date },
    endDate: { type: Date },
    maxUses: { type: Number, default: 100 },
    usedCount: { type: Number, default: 0 },
    applicablePlanId: { type: String, default: 'ALL' },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    description: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Discount', discountSchema);

