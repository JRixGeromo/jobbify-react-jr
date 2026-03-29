const express = require('express');
const { pool } = require('../server');
const router = express.Router();

// Get current user profile
router.get('/profile', async (req, res) => {
  try {
    const userId = req.user.userId;
    const result = await pool.query(
      'SELECT id, email, first_name, last_name, role, created_at FROM users WHERE id = $1',
      [userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// Update user profile
router.put('/profile', async (req, res) => {
  try {
    const userId = req.user.userId;
    const { firstName, lastName, phone } = req.body;
    
    const result = await pool.query(
      'UPDATE users SET first_name = $1, last_name = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING id, email, first_name, last_name, role',
      [firstName, lastName, userId]
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = router;
