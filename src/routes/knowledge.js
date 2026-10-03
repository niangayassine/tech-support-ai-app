const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken } = require('../utils/jwt');

router.use(authenticateToken);

const ensureAdmin = (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ error: true, message: 'Admin access required' });
  }
  next();
};

router.get('/stats', ensureAdmin, async (req, res) => {
  try {
    const usersCount = await db.query('SELECT COUNT(*) AS count FROM users');
    const ticketsCount = await db.query('SELECT COUNT(*) AS count FROM tickets');
    const openCount = await db.query("SELECT COUNT(*) AS count FROM tickets WHERE status = 'open'");
    const inProgressCount = await db.query("SELECT COUNT(*) AS count FROM tickets WHERE status = 'in_progress'");
    const closedCount = await db.query("SELECT COUNT(*) AS count FROM tickets WHERE status = 'closed'");
    const categories = await db.query(`
      SELECT category, COUNT(*) AS count
      FROM tickets
      GROUP BY category
      ORDER BY count DESC
    `);

    res.status(200).json({
      error: false,
      data: {
        totalUsers: Number(usersCount.rows[0].count),
        totalTickets: Number(ticketsCount.rows[0].count),
        open: Number(openCount.rows[0].count),
        inProgress: Number(inProgressCount.rows[0].count),
        closed: Number(closedCount.rows[0].count),
        categories: categories.rows
      }
    });
  } catch (err) {
    console.error('stats error:', err);
    res.status(500).json({ error: true, message: 'Internal server error' });
  }
});

router.get('/tickets', ensureAdmin, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT t.*, u.email, u.first_name, u.last_name, u.role
      FROM tickets t
      LEFT JOIN users u ON u.id = t.user_id
      ORDER BY t.created_at DESC
    `);

    res.status(200).json({ error: false, data: result.rows });
  } catch (err) {
    console.error('admin tickets error:', err);
    res.status(500).json({ error: true, message: 'Internal server error' });
  }
});

router.patch('/tickets/:id/status', ensureAdmin, async (req, res) => {
  const { status } = req.body;
  const allowedStates = ['open', 'in_progress', 'closed'];

  if (!allowedStates.includes(status)) {
    return res.status(400).json({ error: true, message: 'Invalid ticket status' });
  }

  try {
    const result = await db.query(
      `UPDATE tickets
       SET status = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [status, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: true, message: 'Ticket not found' });
    }

    res.status(200).json({ error: false, message: 'Ticket updated', data: result.rows[0] });
  } catch (err) {
    console.error('update ticket status error:', err);
    res.status(500).json({ error: true, message: 'Internal server error' });
  }
});

module.exports = router;
