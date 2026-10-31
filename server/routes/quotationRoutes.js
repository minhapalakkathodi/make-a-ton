const express = require('express');
const router = express.Router();
const Quotation = require('../models/Quotation');
const Subscription = require('../models/Subscription');
const Invoice = require('../models/Invoice');

router.get('/', async (req, res) => {
  try {
    const quotations = await Quotation.find().sort({ createdAt: -1 });
    res.json(quotations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const count = await Quotation.countDocuments();
    const quotationNumber = req.body.quotationNumber || `QT-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`;
    const newQuotation = new Quotation({ ...req.body, quotationNumber });
    const saved = await newQuotation.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Convert Quotation into Subscription + Invoice!
router.post('/:id/convert', async (req, res) => {
  try {
    const quote = await Quotation.findOne({
      $or: [{ _id: req.params.id }, { quotationNumber: req.params.id }],
    });
    if (!quote) return res.status(404).json({ error: 'Quotation not found' });

    // 1. Create Subscription
    const subCount = await Subscription.countDocuments();
    const subCustomId = `SUB-${String(subCount + 1).padStart(3, '0')}`;

    const newSub = new Subscription({
      customId: subCustomId,
      customerId: quote.customerId,
      customerName: quote.customerName,
      customerEmail: quote.customerEmail,
      productId: quote.productId,
      productName: quote.productName,
      planId: quote.planId,
      planName: quote.planName,
      interval: 'Monthly',
      unitPrice: quote.unitPrice,
      quantity: quote.quantity,
      discountCode: quote.discountCode,
      discountAmount: quote.discountAmount,
      taxPercent: quote.taxPercent,
      taxAmount: quote.taxAmount,
      totalAmount: quote.totalAmount,
      startDate: new Date(),
      nextRenewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: 'Confirmed',
      notes: `Converted from quotation ${quote.quotationNumber}`,
    });
    await newSub.save();

    // 2. Mark Quote as Converted
    quote.status = 'Converted';
    quote.convertedSubscriptionId = subCustomId;
    await quote.save();

    // 3. Create initial recurring invoice
    const invCount = await Invoice.countDocuments();
    const invoiceNumber = `INV-${String(invCount + 1).padStart(3, '0')}`;
    const newInvoice = new Invoice({
      invoiceNumber,
      subscriptionId: subCustomId,
      customerId: quote.customerId,
      customerName: quote.customerName,
      customerEmail: quote.customerEmail,
      issueDate: new Date(),
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      status: 'Pending',
      items: [
        {
          description: `${quote.planName} Subscription Setup`,
          quantity: quote.quantity,
          unitPrice: quote.unitPrice,
          amount: quote.subtotal,
        },
      ],
      subtotal: quote.subtotal,
      discountAmount: quote.discountAmount,
      taxAmount: quote.taxAmount,
      totalAmount: quote.totalAmount,
    });
    await newInvoice.save();

    res.json({
      message: 'Quotation converted successfully',
      subscription: newSub,
      invoice: newInvoice,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

