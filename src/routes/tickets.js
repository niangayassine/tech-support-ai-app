const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken } = require('../utils/jwt');
const { validateTicket } = require('../utils/validators');

// Create a new ticket
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description, category, priority } = req.body;
    const userId = req.userId;

    // Validate
    const validation = validateTicket({ title, description });
    if (!validation.valid) {
      return res.status(400).json({ error: true, message: validation.error });
    }

    const result = await db.query(
      `INSERT INTO tickets (user_id, title, description, category, priority)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, user_id, title, description, category, priority, status, created_at`,
      [userId, title, description, category || 'general', priority || 'medium']
    );

    res.status(201).json({
      error: false,
      message: 'Ticket created successfully',
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Create ticket error:', err);
    res.status(500).json({ error: true, message: 'Internal server error' });
  }
});

// Get all user tickets
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { status, category, limit = 20, offset = 0 } = req.query;
    const userId = req.userId;

    let query = 'SELECT * FROM tickets WHERE user_id = $1';
    let params = [userId];
    let paramCount = 1;

    if (status) {
      paramCount++;
      query += ` AND status = $${paramCount}`;
      params.push(status);
    }
    if (category) {
      paramCount++;
      query += ` AND category = $${paramCount}`;
      params.push(category);
    }

    query += ' ORDER BY created_at DESC LIMIT $' + (paramCount + 1) + ' OFFSET $' + (paramCount + 2);
    params.push(parseInt(limit), parseInt(offset));

    const result = await db.query(query, params);
    const countResult = await db.query('SELECT COUNT(*) FROM tickets WHERE user_id = $1', [userId]);

    res.status(200).json({
      error: false,
      data: result.rows,
      pagination: {
        total: parseInt(countResult.rows[0].count),
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (err) {
    console.error('Get tickets error:', err);
    res.status(500).json({ error: true, message: 'Internal server error' });
  }
});

// Get a specific ticket
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const result = await db.query(
      'SELECT * FROM tickets WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: true, message: 'Ticket not found' });
    }

    res.status(200).json({
      error: false,
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Get ticket error:', err);
    res.status(500).json({ error: true, message: 'Internal server error' });
  }
});

// Update a ticket
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority } = req.body;
    const userId = req.userId;

    // Check if ticket belongs to user
    const ticketResult = await db.query(
      'SELECT id FROM tickets WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (ticketResult.rows.length === 0) {
      return res.status(404).json({ error: true, message: 'Ticket not found' });
    }

    const result = await db.query(
      `UPDATE tickets
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           status = COALESCE($3, status),
           priority = COALESCE($4, priority),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $5 AND user_id = $6
       RETURNING *`,
      [title || null, description || null, status || null, priority || null, id, userId]
    );

    res.status(200).json({
      error: false,
      message: 'Ticket updated successfully',
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Update ticket error:', err);
    res.status(500).json({ error: true, message: 'Internal server error' });
  }
});

// Close a ticket
router.post('/:id/close', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const result = await db.query(
      `UPDATE tickets
       SET status = 'closed', resolved_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: true, message: 'Ticket not found' });
    }

    res.status(200).json({
      error: false,
      message: 'Ticket closed successfully',
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Close ticket error:', err);
    res.status(500).json({ error: true, message: 'Internal server error' });
  }
});

module.exports = router;
