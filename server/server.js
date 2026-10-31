require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const customerRoutes = require('./routes/customerRoutes');
const productRoutes = require('./routes/productRoutes');
const planRoutes = require('./routes/planRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const quotationRoutes = require('./routes/quotationRoutes');
const discountRoutes = require('./routes/discountRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    serverTime: new Date(),
    dbConnected: mongoose.connection.readyState === 1,
  });
});

// Mount Routes
app.use('/api/customers', customerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/quotations', quotationRoutes);
app.use('/api/discounts', discountRoutes);

// Database Connection
const mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
  console.warn('⚠️ Warning: MONGODB_URI is not set in server/.env');
} else {
  mongoose
    .connect(mongoURI)
    .then(() => {
      console.log('✅ Connected to MongoDB Atlas successfully!');
    })
    .catch((err) => {
      console.error('❌ MongoDB connection error:', err.message);
      console.log('💡 Note: Please update your MONGODB_URI in server/.env with your valid username & password.');
    });
}

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 BrightLoop Backend API running on http://localhost:${PORT}`);
  console.log(`📡 Ready to receive requests from frontend on ${process.env.CLIENT_URL || 'http://localhost:3000'}`);
});

