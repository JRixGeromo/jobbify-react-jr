const express = require('express');
const { pool } = require('../server');
const router = express.Router();

// Placeholder routes for invoices - implement as needed
router.get('/', async (req, res) => {
  try {
    const { companyId } = req.query;
    const result = await pool.query(
      'SELECT * FROM invoices WHERE company_id = $1 ORDER BY date DESC',
      [companyId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get invoices error:', error);
    res.status(500).json({ error: 'Failed to get invoices' });
  }
});

module.exports = router;
