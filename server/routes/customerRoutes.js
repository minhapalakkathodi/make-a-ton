const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');

router.get('/', async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const count = await Customer.countDocuments();
    const customId = req.body.customId || `CUST-${String(count + 1).padStart(3, '0')}`;
    const newCustomer = new Customer({ ...req.body, customId });
    const saved = await newCustomer.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await Customer.findOneAndUpdate(
      { $or: [{ _id: req.params.id }, { customId: req.params.id }] },
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Customer.findOneAndDelete({
      $or: [{ _id: req.params.id }, { customId: req.params.id }],
    });
    res.json({ message: 'Customer deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

