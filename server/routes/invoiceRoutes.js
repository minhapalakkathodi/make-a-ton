const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');

// GET all invoices
router.get('/', async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ createdAt: -1 });
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE invoice
router.post('/', async (req, res) => {
  try {
    const count = await Invoice.countDocuments();
    const invoiceNumber = req.body.invoiceNumber || `INV-${String(count + 1).padStart(3, '0')}`;

    const newInvoice = new Invoice({
      ...req.body,
      invoiceNumber,
    });
    const saved = await newInvoice.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// UPDATE invoice
router.put('/:id', async (req, res) => {
  try {
    const updated = await Invoice.findOneAndUpdate(
      { $or: [{ _id: req.params.id }, { invoiceNumber: req.params.id }] },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Invoice not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;

