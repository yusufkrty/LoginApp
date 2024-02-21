// Profile routes dosyası
const express = require('express');
const authenticationMiddleware = require('../middlewares/authenticationMiddleware');

const router = express.Router();

router.get('/home', authenticationMiddleware.authenticateToken, (req, res) => {
  res.json({ message: 'Welcome to your home!', user: req.user });
});

module.exports = router;
