const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken } = require('../utils/jwt');

router.use(authenticateToken);

const isKnowledgeManager = (req) => req.userRole === 'admin' || req.userRole === 'support';

const searchQuery = `
  SELECT *
  FROM knowledge_base
  WHERE title ILIKE $1
     OR content ILIKE $1
     OR keywords ILIKE $1
     OR category ILIKE $1
  ORDER BY updated_at DESC
  LIMIT 10
`;

router.get('/search', async (req, res) => {
  try {
    const searchTerm = (req.query.q || '').trim();

    if (!searchTerm) {
      return res.status(400).json({ error: true, message: 'Search term is required' });
    }

    const likeTerm = `%${searchTerm}%`;
    const result = await db.query(searchQuery, [likeTerm]);

    res.status(200).json({
      error: false,
      data: result.rows
    });
  } catch (err) {
    console.error('Knowledge search error:', err);
    res.status(500).json({ error: true, message: 'Internal server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT * FROM knowledge_base ORDER BY updated_at DESC LIMIT 50`
    );

    res.status(200).json({
      error: false,
      data: result.rows
    });
  } catch (err) {
    console.error('Knowledge list error:', err);
    res.status(500).json({ error: true, message: 'Internal server error' });
  }
});

router.get('/category/:category', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM knowledge_base WHERE category = $1 ORDER BY updated_at DESC',
      [req.params.category]
    );

    res.status(200).json({
      error: false,
      data: result.rows
    });
  } catch (err) {
    console.error('Knowledge category error:', err);
    res.status(500).json({ error: true, message: 'Internal server error' });
  }
});

router.post('/', async (req, res) => {
  if (!isKnowledgeManager(req)) {
    return res.status(403).json({ error: true, message: 'You do not have permission to manage knowledge base' });
  }

  try {
    const { title, content, category, keywords } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({ error: true, message: 'Title, content and category are required' });
    }

    const result = await db.query(
      `INSERT INTO knowledge_base (title, content, category, keywords, created_by)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [title, content, category, keywords || '', req.userId]
    );

    res.status(201).json({
      error: false,
      message: 'Knowledge article created successfully',
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Create knowledge article error:', err);
    res.status(500).json({ error: true, message: 'Internal server error' });
  }
});

router.patch('/:id', async (req, res) => {
  if (!isKnowledgeManager(req)) {
    return res.status(403).json({ error: true, message: 'You do not have permission to edit knowledge base' });
  }

  try {
    const { title, content, category, keywords } = req.body;
    const result = await db.query(
      `UPDATE knowledge_base
       SET title = COALESCE($1, title),
           content = COALESCE($2, content),
           category = COALESCE($3, category),
           keywords = COALESCE($4, keywords),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING *`,
      [title || null, content || null, category || null, keywords || null, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: true, message: 'Knowledge article not found' });
    }

    res.status(200).json({
      error: false,
      message: 'Knowledge article updated successfully',
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Update knowledge article error:', err);
    res.status(500).json({ error: true, message: 'Internal server error' });
  }
});

router.delete('/:id', async (req, res) => {
  if (!isKnowledgeManager(req)) {
    return res.status(403).json({ error: true, message: 'You do not have permission to delete knowledge base entries' });
  }

  try {
    const result = await db.query(
      'DELETE FROM knowledge_base WHERE id = $1 RETURNING *',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: true, message: 'Knowledge article not found' });
    }

    res.status(200).json({
      error: false,
      message: 'Knowledge article deleted successfully',
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Delete knowledge article error:', err);
    res.status(500).json({ error: true, message: 'Internal server error' });
  }
});

router.post('/:id/feedback', async (req, res) => {
  try {
    const { useful, comment } = req.body;

    if (typeof useful !== 'boolean') {
      return res.status(400).json({ error: true, message: 'Feedback usefulness is required' });
    }

    const result = await db.query(
      `INSERT INTO knowledge_feedback (article_id, user_id, useful, comment)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [req.params.id, req.userId, useful, comment || '']
    );

    res.status(201).json({
      error: false,
      message: 'Feedback recorded successfully',
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Knowledge feedback error:', err);
    res.status(500).json({ error: true, message: 'Internal server error' });
  }
});

module.exports = router;
