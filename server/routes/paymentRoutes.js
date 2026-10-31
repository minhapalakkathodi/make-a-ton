const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const Invoice = require('../models/Invoice');

// GET all payments
router.get('/', async (req, res) => {
  try {
    const payments = await Payment.find().sort({ paymentDate: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// RECORD payment (and auto-update invoice to Paid)
router.post('/', async (req, res) => {
  try {
    const count = await Payment.countDocuments();
    const customId = req.body.customId || `PAY-${String(count + 1).padStart(3, '0')}`;

    const newPayment = new Payment({
      ...req.body,
      customId,
      paymentDate: req.body.paymentDate || new Date(),
      status: 'Completed',
    });
    const saved = await newPayment.save();

    // Automatically update target invoice to Paid!
    if (req.body.invoiceId || req.body.invoiceNumber) {
      await Invoice.findOneAndUpdate(
        {
          $or: [
            { _id: req.body.invoiceId },
            { invoiceNumber: req.body.invoiceNumber },
          ],
        },
        {
          status: 'Paid',
          paidAmount: Number(req.body.amount),
          paidDate: new Date(),
        }
      );
    }

    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;

