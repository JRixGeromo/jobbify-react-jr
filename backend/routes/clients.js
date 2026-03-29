const express = require('express');
const { pool } = require('../server');
const router = express.Router();

// Get all clients for a company
router.get('/', async (req, res) => {
  try {
    const userId = req.user.userId;
    const { companyId } = req.query;

    // First verify user owns the company
    const companyCheck = await pool.query(
      'SELECT id FROM companies WHERE id = $1 AND owner_id = $2',
      [companyId, userId]
    );

    if (companyCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const result = await pool.query(
      'SELECT * FROM clients WHERE company_id = $1 ORDER BY created_at DESC',
      [companyId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get clients error:', error);
    res.status(500).json({ error: 'Failed to get clients' });
  }
});

// Create client
router.post('/', async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      companyId, firstName, lastName, company, emailAddress, phoneNumber,
      address, notes, imagePath
    } = req.body;

    // Verify user owns the company
    const companyCheck = await pool.query(
      'SELECT id FROM companies WHERE id = $1 AND owner_id = $2',
      [companyId, userId]
    );

    if (companyCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const result = await pool.query(
      `INSERT INTO clients (
        company_id, first_name, last_name, company, email_address, phone_number,
        address, notes, image_path
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [companyId, firstName, lastName, company, emailAddress, phoneNumber, address, notes, imagePath]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create client error:', error);
    res.status(500).json({ error: 'Failed to create client' });
  }
});

// Update client
router.put('/:id', async (req, res) => {
  try {
    const userId = req.user.userId;
    const clientId = req.params.id;
    const updates = req.body;

    // Verify user owns the client's company
    const ownershipCheck = await pool.query(
      `SELECT c.id FROM clients c 
       JOIN companies comp ON c.company_id = comp.id 
       WHERE c.id = $1 AND comp.owner_id = $2`,
      [clientId, userId]
    );

    if (ownershipCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const setClause = Object.keys(updates).map((key, index) => `${key} = $${index + 3}`).join(', ');
    const values = Object.values(updates);

    const result = await pool.query(
      `UPDATE clients SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
      [clientId, ...values]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update client error:', error);
    res.status(500).json({ error: 'Failed to update client' });
  }
});

// Delete client
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.user.userId;
    const clientId = req.params.id;

    // Verify user owns the client's company
    const ownershipCheck = await pool.query(
      `SELECT c.id FROM clients c 
       JOIN companies comp ON c.company_id = comp.id 
       WHERE c.id = $1 AND comp.owner_id = $2`,
      [clientId, userId]
    );

    if (ownershipCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await pool.query('DELETE FROM clients WHERE id = $1', [clientId]);
    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    console.error('Delete client error:', error);
    res.status(500).json({ error: 'Failed to delete client' });
  }
});

module.exports = router;
