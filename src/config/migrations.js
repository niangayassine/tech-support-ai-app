const db = require('./db');

const createTables = async () => {
  try {
    console.log('Creating database tables...');

    // Users table
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        avatar_url VARCHAR(500),
        role VARCHAR(50) DEFAULT 'user',
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Users table created');

    // Tickets table
    await db.query(`
      CREATE TABLE IF NOT EXISTS tickets (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        category VARCHAR(100),
        priority VARCHAR(50) DEFAULT 'medium',
        status VARCHAR(50) DEFAULT 'open',
        resolved_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Tickets table created');

    // Conversations table
    await db.query(`
      CREATE TABLE IF NOT EXISTS conversations (
        id SERIAL PRIMARY KEY,
        ticket_id INTEGER NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Conversations table created');

    // Messages table
    await db.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        conversation_id INTEGER NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
        sender_type VARCHAR(50) NOT NULL,
        sender_id INTEGER,
        message_text TEXT NOT NULL,
        is_from_ai BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Messages table created');

    // AI Responses table (for tracking AI responses)
    await db.query(`
      CREATE TABLE IF NOT EXISTS ai_responses (
        id SERIAL PRIMARY KEY,
        message_id INTEGER NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
        model_used VARCHAR(100),
        tokens_used INTEGER,
        confidence_score DECIMAL(3,2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ AI Responses table created');

    // Create indexes for better query performance
    await db.query('CREATE INDEX IF NOT EXISTS idx_tickets_user_id ON tickets(user_id)');
    await db.query('CREATE INDEX IF NOT EXISTS idx_conversations_ticket_id ON conversations(ticket_id)');
    await db.query('CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id)');
    console.log('✅ Indexes created');

    console.log('✅ All tables created successfully!');
  } catch (err) {
    console.error('❌ Migration error:', err);
    throw err;
  }
};

// Run migrations
if (require.main === module) {
  createTables()
    .then(() => {
      console.log('Database initialization complete');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Migration failed:', err);
      process.exit(1);
    });
}

module.exports = { createTables };
