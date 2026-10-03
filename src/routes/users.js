const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken } = require('../utils/jwt');
const bcrypt = require('bcryptjs');

// Get current user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, email, first_name, last_name, avatar_url, role, is_active, created_at
       FROM users WHERE id = $1`,
      [req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: true, message: 'User not found' });
    }

    res.status(200).json({
      error: false,
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ error: true, message: 'Internal server error' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { firstName, lastName, avatarUrl } = req.body;

    const result = await db.query(
      `UPDATE users
       SET first_name = COALESCE($1, first_name),
           last_name = COALESCE($2, last_name),
           avatar_url = COALESCE($3, avatar_url),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $4
       RETURNING id, email, first_name, last_name, avatar_url`,
      [firstName || null, lastName || null, avatarUrl || null, req.userId]
    );

    res.status(200).json({
      error: false,
      message: 'Profile updated successfully',
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ error: true, message: 'Internal server error' });
  }
});

// Change password
router.post('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: true, message: 'Current and new password required' });
    }

    const userResult = await db.query(
      'SELECT password_hash FROM users WHERE id = $1',
      [req.userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: true, message: 'User not found' });
    }

    const isValidPassword = await bcrypt.compare(currentPassword, userResult.rows[0].password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: true, message: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.query(
      'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [hashedPassword, req.userId]
    );

    res.status(200).json({
      error: false,
      message: 'Password changed successfully'
    });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ error: true, message: 'Internal server error' });
  }
});

module.exports = router;
