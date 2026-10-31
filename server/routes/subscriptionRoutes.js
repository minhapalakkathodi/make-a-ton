const express = require('express');
const router = express.Router();
const Subscription = require('../models/Subscription');

// GET all subscriptions
router.get('/', async (req, res) => {
  try {
    const subscriptions = await Subscription.find().sort({ createdAt: -1 });
    res.json(subscriptions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single subscription
router.get('/:id', async (req, res) => {
  try {
    const sub = await Subscription.findOne({
      $or: [{ _id: req.params.id }, { customId: req.params.id }],
    });
    if (!sub) return res.status(404).json({ error: 'Subscription not found' });
    res.json(sub);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE subscription
router.post('/', async (req, res) => {
  try {
    const count = await Subscription.countDocuments();
    const customId = req.body.customId || `SUB-${String(count + 1).padStart(3, '0')}`;

    const newSub = new Subscription({
      ...req.body,
      customId,
    });
    const saved = await newSub.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// UPDATE subscription
router.put('/:id', async (req, res) => {
  try {
    const updated = await Subscription.findOneAndUpdate(
      { $or: [{ _id: req.params.id }, { customId: req.params.id }] },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Subscription not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE / Cancel subscription
router.delete('/:id', async (req, res) => {
  try {
    const updated = await Subscription.findOneAndUpdate(
      { $or: [{ _id: req.params.id }, { customId: req.params.id }] },
      { status: 'Closed' },
      { new: true }
    );
    res.json({ message: 'Subscription closed successfully', subscription: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

