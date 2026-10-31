const express = require('express');
const router = express.Router();
const Plan = require('../models/Plan');

router.get('/', async (req, res) => {
  try {
    const plans = await Plan.find().sort({ createdAt: -1 });
    res.json(plans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const count = await Plan.countDocuments();
    const customId = req.body.customId || `PLAN-${String(count + 1).padStart(3, '0')}`;
    const newPlan = new Plan({ ...req.body, customId });
    const saved = await newPlan.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await Plan.findOneAndUpdate(
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
    await Plan.findOneAndDelete({
      $or: [{ _id: req.params.id }, { customId: req.params.id }],
    });
    res.json({ message: 'Plan deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

