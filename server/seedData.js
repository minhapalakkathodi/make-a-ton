require('dotenv').config();
const mongoose = require('mongoose');

const Customer = require('./models/Customer');
const Product = require('./models/Product');
const Plan = require('./models/Plan');
const Subscription = require('./models/Subscription');
const Invoice = require('./models/Invoice');
const Payment = require('./models/Payment');
const Quotation = require('./models/Quotation');
const Discount = require('./models/Discount');

const seedNetflixDatabase = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.error('❌ MONGODB_URI is missing in server/.env');
      process.exit(1);
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB Atlas');

    // 0. Wipe existing collections completely
    console.log('🗑️ Wiping all previous data...');
    await Product.deleteMany({});
    await Plan.deleteMany({});
    await Customer.deleteMany({});
    await Subscription.deleteMany({});
    await Invoice.deleteMany({});
    await Payment.deleteMany({});
    await Quotation.deleteMany({});
    await Discount.deleteMany({});
    console.log('✨ All old data cleared!');

    // 1. Seed Netflix-style Products
    const products = await Product.insertMany([
      {
        customId: 'PROD-001',
        name: 'Netflix Stream',
        type: 'Digital Streaming',
        category: 'Entertainment',
        price: 199,
        description: 'Unlimited movies, TV series, documentaries, and award-winning originals on all your screens.',
        status: 'Active',
      },
      {
        customId: 'PROD-002',
        name: 'MusicFlow Audio',
        type: 'Digital Audio',
        category: 'Music & Podcasts',
        price: 119,
        description: 'Over 100 million songs and podcasts ad-free with lossless high-fidelity audio.',
        status: 'Active',
      },
      {
        customId: 'PROD-003',
        name: 'CloudPlay Games',
        type: 'Cloud Gaming',
        category: 'Gaming',
        price: 399,
        description: 'Instant cloud gaming library with 100+ console games on any laptop, smart TV, or phone.',
        status: 'Active',
      },
    ]);
    console.log(`🎬 Seeded ${products.length} Products (Netflix, MusicFlow, CloudPlay)`);

    // 2. Seed Netflix-style Plans
    const plans = await Plan.insertMany([
      {
        customId: 'PLAN-001',
        productId: 'PROD-001',
        productName: 'Netflix Stream',
        name: 'Mobile Plan',
        price: 149,
        interval: 'Monthly',
        billing: 'Monthly',
        description: 'Watch in 480p SD on 1 mobile phone or tablet at a time. Ad-free streaming.',
        minQuantity: 1,
        status: 'Active',
      },
      {
        customId: 'PLAN-002',
        productId: 'PROD-001',
        productName: 'Netflix Stream',
        name: 'Basic Plan',
        price: 199,
        interval: 'Monthly',
        billing: 'Monthly',
        description: 'Watch in 720p HD on 1 screen (Phone, Tablet, Laptop, or Smart TV). Offline downloads.',
        minQuantity: 1,
        status: 'Active',
      },
      {
        customId: 'PLAN-003',
        productId: 'PROD-001',
        productName: 'Netflix Stream',
        name: 'Standard Plan (Full HD)',
        price: 499,
        interval: 'Monthly',
        billing: 'Monthly',
        description: 'Watch in 1080p Full HD on 2 devices simultaneously. Download on 2 supported devices.',
        minQuantity: 1,
        status: 'Active',
      },
      {
        customId: 'PLAN-004',
        productId: 'PROD-001',
        productName: 'Netflix Stream',
        name: 'Premium Plan (4K Ultra HD)',
        price: 649,
        interval: 'Monthly',
        billing: 'Monthly',
        description: 'Watch in 4K Ultra HD + HDR on 4 devices simultaneously with Spatial Audio sound.',
        minQuantity: 1,
        status: 'Active',
      },
      {
        customId: 'PLAN-005',
        productId: 'PROD-001',
        productName: 'Netflix Stream',
        name: 'Annual Family VIP Pass',
        price: 4999,
        interval: 'Yearly',
        billing: 'Yearly',
        description: 'Full Premium 4K access for the whole family for 1 full year with 35% annual savings.',
        minQuantity: 1,
        status: 'Active',
      },
    ]);
    console.log(`📋 Seeded ${plans.length} Netflix-style Plans (Mobile, Basic, Standard, Premium 4K, Annual VIP)`);

    // 3. Seed Realistic Customers
    const customers = await Customer.insertMany([
      {
        customId: 'CUST-001',
        name: 'Aarav Patel',
        email: 'aarav.patel@gmail.com',
        phone: '+91 98201 12345',
        company: 'Individual Subscriber',
        address: 'Bandra West, Hill Road',
        city: 'Mumbai',
        state: 'Maharashtra',
        status: 'Active',
      },
      {
        customId: 'CUST-002',
        name: 'Sneha Reddy',
        email: 'sneha.reddy@gmail.com',
        phone: '+91 98490 56789',
        company: 'Family Account',
        address: 'Jubilee Hills, Road No. 36',
        city: 'Hyderabad',
        state: 'Telangana',
        status: 'Active',
      },
      {
        customId: 'CUST-003',
        name: 'Rohan Mehta',
        email: 'rohan.mehta@gmail.com',
        phone: '+91 98111 87654',
        company: 'Student Pass',
        address: 'Connaught Place, Block C',
        city: 'New Delhi',
        state: 'Delhi',
        status: 'Active',
      },
      {
        customId: 'CUST-004',
        name: 'Ananya Iyer',
        email: 'ananya.iyer@gmail.com',
        phone: '+91 97400 34567',
        company: 'Annual Subscriber',
        address: 'Indiranagar 100ft Road',
        city: 'Bangalore',
        state: 'Karnataka',
        status: 'Active',
      },
    ]);
    console.log(`👥 Seeded ${customers.length} Customers`);

    // 4. Seed Subscriptions
    const subscriptions = await Subscription.insertMany([
      {
        customId: 'SUB-001',
        customerId: 'CUST-001',
        customerName: 'Aarav Patel',
        customerEmail: 'aarav.patel@gmail.com',
        productId: 'PROD-001',
        productName: 'Netflix Stream',
        planId: 'PLAN-004',
        planName: 'Premium Plan (4K Ultra HD)',
        interval: 'Monthly',
        unitPrice: 649,
        quantity: 1,
        totalAmount: 649,
        startDate: new Date('2025-03-01'),
        nextRenewalDate: new Date('2026-04-01'),
        status: 'Active',
        notes: 'Premium 4K streaming subscriber.',
      },
      {
        customId: 'SUB-002',
        customerId: 'CUST-002',
        customerName: 'Sneha Reddy',
        customerEmail: 'sneha.reddy@gmail.com',
        productId: 'PROD-001',
        productName: 'Netflix Stream',
        planId: 'PLAN-003',
        planName: 'Standard Plan (Full HD)',
        interval: 'Monthly',
        unitPrice: 499,
        quantity: 1,
        totalAmount: 499,
        startDate: new Date('2025-02-15'),
        nextRenewalDate: new Date('2026-03-15'),
        status: 'Active',
        notes: 'Standard 2-screen household account.',
      },
      {
        customId: 'SUB-003',
        customerId: 'CUST-003',
        customerName: 'Rohan Mehta',
        customerEmail: 'rohan.mehta@gmail.com',
        productId: 'PROD-001',
        productName: 'Netflix Stream',
        planId: 'PLAN-002',
        planName: 'Basic Plan',
        interval: 'Monthly',
        unitPrice: 199,
        quantity: 1,
        totalAmount: 199,
        startDate: new Date('2025-01-20'),
        nextRenewalDate: new Date('2026-02-20'),
        status: 'Active',
        notes: 'Single-screen basic subscriber.',
      },
      {
        customId: 'SUB-004',
        customerId: 'CUST-004',
        customerName: 'Ananya Iyer',
        customerEmail: 'ananya.iyer@gmail.com',
        productId: 'PROD-001',
        productName: 'Netflix Stream',
        planId: 'PLAN-005',
        planName: 'Annual Family VIP Pass',
        interval: 'Yearly',
        unitPrice: 4999,
        quantity: 1,
        totalAmount: 4999,
        startDate: new Date('2025-01-01'),
        nextRenewalDate: new Date('2026-01-01'),
        status: 'Active',
        notes: 'Annual family prepaid VIP pass.',
      },
    ]);
    console.log(`🍿 Seeded ${subscriptions.length} Subscriptions`);

    // 5. Seed Invoices
    const invoices = await Invoice.insertMany([
      {
        invoiceNumber: 'INV-001',
        subscriptionId: 'SUB-001',
        customerId: 'CUST-001',
        customerName: 'Aarav Patel',
        customerEmail: 'aarav.patel@gmail.com',
        customerAddress: 'Bandra West, Hill Road, Mumbai',
        issueDate: new Date('2025-04-01'),
        dueDate: new Date('2025-04-15'),
        status: 'Paid',
        items: [
          {
            description: 'Netflix Premium Plan (4K Ultra HD) - Monthly Subscription',
            quantity: 1,
            unitPrice: 649,
            amount: 649,
          },
        ],
        subtotal: 649,
        totalAmount: 649,
        paidAmount: 649,
        paidDate: new Date('2025-04-01'),
      },
      {
        invoiceNumber: 'INV-002',
        subscriptionId: 'SUB-002',
        customerId: 'CUST-002',
        customerName: 'Sneha Reddy',
        customerEmail: 'sneha.reddy@gmail.com',
        customerAddress: 'Jubilee Hills, Hyderabad',
        issueDate: new Date('2025-04-15'),
        dueDate: new Date('2025-04-29'),
        status: 'Paid',
        items: [
          {
            description: 'Netflix Standard Plan (Full HD) - Monthly Subscription',
            quantity: 1,
            unitPrice: 499,
            amount: 499,
          },
        ],
        subtotal: 499,
        totalAmount: 499,
        paidAmount: 499,
        paidDate: new Date('2025-04-15'),
      },
      {
        invoiceNumber: 'INV-003',
        subscriptionId: 'SUB-003',
        customerId: 'CUST-003',
        customerName: 'Rohan Mehta',
        customerEmail: 'rohan.mehta@gmail.com',
        customerAddress: 'Connaught Place, New Delhi',
        issueDate: new Date('2025-04-20'),
        dueDate: new Date('2025-05-04'),
        status: 'Pending',
        items: [
          {
            description: 'Netflix Basic Plan - Monthly Renewal',
            quantity: 1,
            unitPrice: 199,
            amount: 199,
          },
        ],
        subtotal: 199,
        totalAmount: 199,
        paidAmount: 0,
      },
      {
        invoiceNumber: 'INV-004',
        subscriptionId: 'SUB-004',
        customerId: 'CUST-004',
        customerName: 'Ananya Iyer',
        customerEmail: 'ananya.iyer@gmail.com',
        customerAddress: 'Indiranagar 100ft Road, Bangalore',
        issueDate: new Date('2025-01-01'),
        dueDate: new Date('2025-01-15'),
        status: 'Paid',
        items: [
          {
            description: 'Netflix Annual Family VIP Pass - 1 Year Subscription',
            quantity: 1,
            unitPrice: 4999,
            amount: 4999,
          },
        ],
        subtotal: 4999,
        totalAmount: 4999,
        paidAmount: 4999,
        paidDate: new Date('2025-01-01'),
      },
    ]);
    console.log(`🧾 Seeded ${invoices.length} Invoices`);

    // 6. Seed Payments
    const payments = await Payment.insertMany([
      {
        customId: 'PAY-001',
        invoiceId: 'INV-001',
        invoiceNumber: 'INV-001',
        customerId: 'CUST-001',
        customerName: 'Aarav Patel',
        amount: 649,
        paymentDate: new Date('2025-04-01'),
        paymentMethod: 'UPI',
        transactionId: 'UPI-9948210398',
        status: 'Completed',
      },
      {
        customId: 'PAY-002',
        invoiceId: 'INV-002',
        invoiceNumber: 'INV-002',
        customerId: 'CUST-002',
        customerName: 'Sneha Reddy',
        amount: 499,
        paymentDate: new Date('2025-04-15'),
        paymentMethod: 'Credit Card',
        transactionId: 'CC-4921092837',
        status: 'Completed',
      },
      {
        customId: 'PAY-003',
        invoiceId: 'INV-004',
        invoiceNumber: 'INV-004',
        customerId: 'CUST-004',
        customerName: 'Ananya Iyer',
        amount: 4999,
        paymentDate: new Date('2025-01-01'),
        paymentMethod: 'Net Banking',
        transactionId: 'NB-1092837465',
        status: 'Completed',
      },
    ]);
    console.log(`💳 Seeded ${payments.length} Payments`);

    // 7. Seed Discounts
    const discounts = await Discount.insertMany([
      {
        code: 'NETFLIX50',
        type: 'percentage',
        value: 50,
        minPurchaseAmount: 199,
        description: 'First month 50% discount on Standard & Premium',
        status: 'Active',
      },
      {
        code: 'FAMILYPASS',
        type: 'fixed',
        value: 1000,
        minPurchaseAmount: 4999,
        description: 'Flat ₹1,000 off on Annual Family Pass',
        status: 'Active',
      },
    ]);
    console.log(`🏷️ Seeded ${discounts.length} Discount Codes`);

    console.log('\n🎉 SUCCESS: All old data deleted and clean Netflix-style subscription dataset seeded into MongoDB!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
};

seedNetflixDatabase();
