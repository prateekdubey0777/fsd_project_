const express = require('express');
const User = require('../models/User');
const { authRequired, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/users', authRequired, requireRole('ADMIN'), async (req, res, next) => {
  try {
    const users = await User.find({}).select('-passwordHash').sort({ createdAt: -1 });
    return res.json(users);
  } catch (err) {
    return next(err);
  }
});

router.put('/users/:id/role', authRequired, requireRole('ADMIN'), async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['USER', 'ADMIN'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-passwordHash');

    if (!updated) return res.status(404).json({ message: 'User not found' });
    return res.json(updated);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
