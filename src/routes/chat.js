const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken } = require('../utils/jwt');
const aiService = require('../services/aiService');

// Create a new conversation
router.post('/conversations', authenticateToken, async (req, res) => {
  try {
    const { ticketId, title } = req.body;
    const userId = req.userId;

    if (!ticketId) {
      return res.status(400).json({ error: true, message: 'Ticket ID is required' });
    }

    // Verify ticket belongs to user
    const ticketResult = await db.query(
      'SELECT id FROM tickets WHERE id = $1 AND user_id = $2',
      [ticketId, userId]
    );

    if (ticketResult.rows.length === 0) {
      return res.status(404).json({ error: true, message: 'Ticket not found' });
    }

    const result = await db.query(
      `INSERT INTO conversations (ticket_id, user_id, title)
       VALUES ($1, $2, $3)
       RETURNING id, ticket_id, user_id, title, is_active, created_at`,
      [ticketId, userId, title || 'Support Conversation']
    );

    res.status(201).json({
      error: false,
      message: 'Conversation created successfully',
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Create conversation error:', err);
    res.status(500).json({ error: true, message: 'Internal server error' });
  }
});

// Send a message in conversation
router.post('/conversations/:conversationId/messages', authenticateToken, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { message } = req.body;
    const userId = req.userId;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: true, message: 'Message is required' });
    }

    // Verify conversation belongs to user
    const convResult = await db.query(
      'SELECT id FROM conversations WHERE id = $1 AND user_id = $2',
      [conversationId, userId]
    );

    if (convResult.rows.length === 0) {
      return res.status(404).json({ error: true, message: 'Conversation not found' });
    }

    // Save user message
    const userMsgResult = await db.query(
      `INSERT INTO messages (conversation_id, sender_type, sender_id, message_text, is_from_ai)
       VALUES ($1, $2, $3, $4, false)
       RETURNING id, message_text, created_at`,
      [conversationId, 'user', userId, message]
    );

    // Get AI response
    const aiResponse = await aiService.generateResponse(message);

    // Save AI message
    const aiMsgResult = await db.query(
      `INSERT INTO messages (conversation_id, sender_type, message_text, is_from_ai)
       VALUES ($1, $2, $3, true)
       RETURNING id, message_text, created_at`,
      [conversationId, 'ai', aiResponse.response]
    );

    // Save AI response metadata
    if (aiResponse.tokens) {
      await db.query(
        `INSERT INTO ai_responses (message_id, model_used, tokens_used, confidence_score)
         VALUES ($1, $2, $3, $4)`,
        [aiMsgResult.rows[0].id, aiResponse.model, aiResponse.tokens, aiResponse.confidence || null]
      );
    }

    res.status(201).json({
      error: false,
      message: 'Message sent successfully',
      data: {
        userMessage: userMsgResult.rows[0],
        aiMessage: aiMsgResult.rows[0],
        aiMetadata: aiResponse
      }
    });
  } catch (err) {
    console.error('Send message error:', err);
    res.status(500).json({ error: true, message: 'Internal server error' });
  }
});

// Get conversation messages
router.get('/conversations/:conversationId/messages', authenticateToken, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { limit = 50, offset = 0 } = req.query;
    const userId = req.userId;

    // Verify conversation belongs to user
    const convResult = await db.query(
      'SELECT id FROM conversations WHERE id = $1 AND user_id = $2',
      [conversationId, userId]
    );

    if (convResult.rows.length === 0) {
      return res.status(404).json({ error: true, message: 'Conversation not found' });
    }

    const result = await db.query(
      `SELECT m.*, ar.model_used, ar.tokens_used, ar.confidence_score
       FROM messages m
       LEFT JOIN ai_responses ar ON m.id = ar.message_id
       WHERE m.conversation_id = $1
       ORDER BY m.created_at ASC
       LIMIT $2 OFFSET $3`,
      [conversationId, parseInt(limit), parseInt(offset)]
    );

    res.status(200).json({
      error: false,
      data: result.rows
    });
  } catch (err) {
    console.error('Get messages error:', err);
    res.status(500).json({ error: true, message: 'Internal server error' });
  }
});

// Get user conversations
router.get('/conversations', authenticateToken, async (req, res) => {
  try {
    const userId = req.userId;
    const { limit = 20, offset = 0 } = req.query;

    const result = await db.query(
      `SELECT c.*, t.title as ticket_title
       FROM conversations c
       LEFT JOIN tickets t ON c.ticket_id = t.id
       WHERE c.user_id = $1
       ORDER BY c.updated_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, parseInt(limit), parseInt(offset)]
    );

    res.status(200).json({
      error: false,
      data: result.rows
    });
  } catch (err) {
    console.error('Get conversations error:', err);
    res.status(500).json({ error: true, message: 'Internal server error' });
  }
});

module.exports = router;
