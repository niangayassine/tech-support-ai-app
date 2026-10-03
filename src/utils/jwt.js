const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const SECRET = process.env.JWT_SECRET || 'your_secret_key';
const EXPIRY = process.env.JWT_EXPIRE || '7d';

const generateToken = (userId) => {
  return jwt.sign({ userId }, SECRET, { expiresIn: EXPIRY });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, SECRET);
  } catch (err) {
    return null;
  }
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: true, message: 'Token required' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).json({ error: true, message: 'Invalid or expired token' });
  }

  req.userId = decoded.userId;
  next();
};

module.exports = {
  generateToken,
  verifyToken,
  authenticateToken
};
