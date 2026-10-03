const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const { generateToken, authenticateToken } = require('../utils/jwt');
const { validateEmail, validatePassword } = require('../utils/validators');

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Validation
    if (!email || !validateEmail(email)) {
      return res.status(400).json({ error: true, message: 'Invalid email' });
    }
    if (!password || !validatePassword(password)) {
      return res.status(400).json({
        error: true,
        message: 'Password must be at least 8 characters with uppercase, lowercase, and number'
      });
    }

    // Check if user exists
    const userExists = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(409).json({ error: true, message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const result = await db.query(
      `INSERT INTO users (email, password_hash, first_name, last_name)
       VALUES ($1, $2, $3, $4) RETURNING id, email, first_name, last_name`,
      [email, hashedPassword, firstName || '', lastName || '']
    );

    const user = result.rows[0];
    const token = generateToken(user.id);

    res.status(201).json({
      error: false,
      message: 'User registered successfully',
      data: {
        user,
        token
      }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: true, message: 'Internal server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: true, message: 'Email and password required' });
    }

    // Find user
    const result = await db.query(
      'SELECT id, email, password_hash, first_name, last_name FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: true, message: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: true, message: 'Invalid credentials' });
    }

    const token = generateToken(user.id);

    res.status(200).json({
      error: false,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name
        },
        token
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: true, message: 'Internal server error' });
  }
});

// Verify Token
router.get('/verify', authenticateToken, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, email, first_name, last_name, role FROM users WHERE id = $1',
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
    console.error('Verify error:', err);
    res.status(500).json({ error: true, message: 'Internal server error' });
  }
});

module.exports = router;
