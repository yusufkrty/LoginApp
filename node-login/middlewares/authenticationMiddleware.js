// Authentication middleware dosyası
const jwt = require('jsonwebtoken');
const TokenExpiredError = require('jsonwebtoken/lib/TokenExpiredError');
const config = require('../config/config');

async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token missing' });
  }

  try {
    const decoded = jwt.verify(token, config.secretKey);
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return res.status(401).json({ message: 'Access token expired' });
    }
    return res.status(403).json({ message: 'Invalid token' });
  }
}

module.exports = { authenticateToken };
