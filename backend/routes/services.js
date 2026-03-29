const express = require('express');
const { pool } = require('../server');
const router = express.Router();

// Placeholder routes for services - implement as needed
router.get('/', async (req, res) => {
  try {
    const { companyId } = req.query;
    const result = await pool.query(
      'SELECT * FROM services WHERE company_id = $1 ORDER BY name',
      [companyId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({ error: 'Failed to get services' });
  }
});

module.exports = router;
