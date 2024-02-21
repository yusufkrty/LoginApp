// Auth controller dosyası
const express = require('express');
const jwt = require('jsonwebtoken');
const TokenExpiredError = require('jsonwebtoken/lib/TokenExpiredError');
const config = require('../config/config');
const User = require('../models/user');

async function login(req, res) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, password });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const accessToken = jwt.sign({ userId: user.id, role: 'user' }, config.secretKey, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ userId: user.id }, config.secretKey, { expiresIn: '7d' });

    res.json({ accessToken, refreshToken, userInfo: { id: user.id, email: user.email, role: 'user' } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function refreshAccessToken(req, res) {
  const { refreshToken } = req.body;

  try {
    const userId = verifyRefreshToken(refreshToken);

    if (!userId) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    const newAccessToken = jwt.sign({ userId }, config.secretKey, { expiresIn: '15m' });

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

function verifyRefreshToken(refreshToken) {
  try {
    const decoded = jwt.verify(refreshToken, config.secretKey);
    return decoded.userId;
  } catch (error) {
    return null;
  }
}

module.exports = { login, refreshAccessToken, verifyRefreshToken };
