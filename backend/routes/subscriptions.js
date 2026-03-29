const express = require('express');
const { pool } = require('../server');
const router = express.Router();

// Placeholder routes for subscriptions - implement as needed
router.get('/', async (req, res) => {
  try {
    const userId = req.user.userId;
    const result = await pool.query(
      'SELECT s.*, sp.name as plan_name FROM subscriptions s JOIN subscription_plans sp ON s.plan_id = sp.id WHERE s.user_id = $1',
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get subscriptions error:', error);
    res.status(500).json({ error: 'Failed to get subscriptions' });
  }
});

module.exports = router;
