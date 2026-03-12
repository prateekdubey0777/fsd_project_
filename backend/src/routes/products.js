const express = require('express');
const Product = require('../models/Product');
const { authRequired, requireRole } = require('../middleware/auth');

const router = express.Router();

// Public: list/search products
router.get('/', async (req, res, next) => {
  try {
    const { q, category } = req.query;

    const filter = { isActive: true };
    if (category) filter.category = String(category);

    if (q) {
      filter.$text = { $search: String(q) };
    }

    const products = await Product.find(filter).sort({ createdAt: -1 }).limit(100);
    return res.json(products);
  } catch (err) {
    return next(err);
  }
});

// Public: product details
router.get('/:id', async (req, res, next) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p || !p.isActive) return res.status(404).json({ message: 'Product not found' });
    return res.json(p);
  } catch (err) {
    return next(err);
  }
});

// Admin: create
router.post('/', authRequired, requireRole('ADMIN'), async (req, res, next) => {
  try {
    const { name, description, price, category, images, stock, isActive } = req.body;
    if (!name || price === undefined) {
      return res.status(400).json({ message: 'name and price are required' });
    }
    const created = await Product.create({
      name,
      description,
      price,
      category,
      images: Array.isArray(images) ? images : [],
      stock: stock ?? 0,
      isActive: isActive ?? true,
    });
    return res.status(201).json(created);
  } catch (err) {
    return next(err);
  }
});

// Admin: update
router.put('/:id', authRequired, requireRole('ADMIN'), async (req, res, next) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Product not found' });
    return res.json(updated);
  } catch (err) {
    return next(err);
  }
});

// Admin: delete (soft)
router.delete('/:id', authRequired, requireRole('ADMIN'), async (req, res, next) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Product not found' });
    return res.json({ message: 'Deleted', product: updated });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
