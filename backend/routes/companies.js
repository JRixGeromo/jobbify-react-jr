const express = require('express');
const { pool } = require('../server');
const router = express.Router();

// Get user's companies
router.get('/', async (req, res) => {
  try {
    const userId = req.user.userId;
    const result = await pool.query(
      'SELECT * FROM companies WHERE owner_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get companies error:', error);
    res.status(500).json({ error: 'Failed to get companies' });
  }
});

// Create company
router.post('/', async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      name, legal_name, tax_id, email, phone, website, street_address,
      city, state, zip_code, country, logo_url, primary_color, accent_color,
      invoice_prefix, invoice_footer, payment_terms, account_name, bank_name,
      account_number, routing_number, swift_code
    } = req.body;

    const result = await pool.query(
      `INSERT INTO companies (
        name, legal_name, tax_id, email, phone, website, street_address,
        city, state, zip_code, country, logo_url, primary_color, accent_color,
        invoice_prefix, invoice_footer, payment_terms, account_name, bank_name,
        account_number, routing_number, swift_code, owner_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23) RETURNING *`,
      [name, legal_name, tax_id, email, phone, website, street_address,
       city, state, zip_code, country, logo_url, primary_color, accent_color,
       invoice_prefix, invoice_footer, payment_terms, account_name, bank_name,
       account_number, routing_number, swift_code, userId]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create company error:', error);
    res.status(500).json({ error: 'Failed to create company' });
  }
});

// Update company
router.put('/:id', async (req, res) => {
  try {
    const userId = req.user.userId;
    const companyId = req.params.id;
    const updates = req.body;

    // First check if user owns the company
    const ownershipCheck = await pool.query(
      'SELECT id FROM companies WHERE id = $1 AND owner_id = $2',
      [companyId, userId]
    );

    if (ownershipCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const setClause = Object.keys(updates).map((key, index) => `${key} = $${index + 3}`).join(', ');
    const values = Object.values(updates);

    const result = await pool.query(
      `UPDATE companies SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $1 AND owner_id = $2 RETURNING *`,
      [companyId, userId, ...values]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update company error:', error);
    res.status(500).json({ error: 'Failed to update company' });
  }
});

module.exports = router;
