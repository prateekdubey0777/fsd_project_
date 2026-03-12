const express = require('express');
const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { authRequired, requireRole } = require('../middleware/auth');

const router = express.Router();

function calcTotals(items) {
  const subtotal = items.reduce((sum, it) => sum + it.price * it.quantity, 0);
  const shippingFee = 0;
  const total = subtotal + shippingFee;
  return { subtotal, shippingFee, total };
}

// User: create order
router.post('/', authRequired, async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    const { items, shippingAddress, paymentMode } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'items is required' });
    }

    session.startTransaction();

    // Validate products + lock stock updates
    const hydratedItems = [];
    for (const it of items) {
      const product = await Product.findById(it.product).session(session);
      if (!product || !product.isActive) {
        await session.abortTransaction();
        return res.status(400).json({ message: 'Invalid product in cart' });
      }

      const qty = Number(it.quantity || 0);
      if (!Number.isFinite(qty) || qty < 1) {
        await session.abortTransaction();
        return res.status(400).json({ message: 'Invalid quantity' });
      }

      if (product.stock < qty) {
        await session.abortTransaction();
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }

      product.stock -= qty;
      await product.save({ session });

      hydratedItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: qty,
        image: product.images?.[0],
      });
    }

    const totals = calcTotals(hydratedItems);

    const order = await Order.create(
      [
        {
          user: req.user.id,
          items: hydratedItems,
          shippingAddress,
          paymentMode: paymentMode || 'COD',
          status: 'PENDING',
          ...totals,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    return res.status(201).json(order[0]);
  } catch (err) {
    try {
      await session.abortTransaction();
    } catch (_) {
      // ignore
    }
    return next(err);
  } finally {
    session.endSession();
  }
});

// User: my orders
router.get('/mine', authRequired, async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    return res.json(orders);
  } catch (err) {
    return next(err);
  }
});

// User/Admin: order details
router.get('/:id', authRequired, async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'email name role');
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const isAdmin = req.user.role === 'ADMIN';
    const isOwner = order.user && order.user._id.toString() === req.user.id;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    return res.json(order);
  } catch (err) {
    return next(err);
  }
});

// Admin: list all
router.get('/', authRequired, requireRole('ADMIN'), async (req, res, next) => {
  try {
    const orders = await Order.find({}).populate('user', 'email name role').sort({ createdAt: -1 });
    return res.json(orders);
  } catch (err) {
    return next(err);
  }
});

// Admin: update status
router.put('/:id/status', authRequired, requireRole('ADMIN'), async (req, res, next) => {
  try {
    const { status } = req.body;
    const updated = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!updated) return res.status(404).json({ message: 'Order not found' });
    return res.json(updated);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
