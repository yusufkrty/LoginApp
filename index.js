// Gerekli modülleri yükle
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const TokenExpiredError = require('jsonwebtoken/lib/TokenExpiredError');

// Express uygulamasını oluştur
const app = express();

// Kullanıcı bilgilerini saklamak için basit bir veritabanı (örneğin: bir dizi) kullanalım
const users = [
  { id: 1, email: 'user@example.com', password: 'password', role: 'user' },
  // Diğer kullanıcılar burada eklenebilir
];

// JWT için gizli anahtar (secret key)
const secretKey = 'my-secret-key';

// Middleware'lar
app.use(bodyParser.json());

// Kullanıcı girişi (login) işlemi
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  // Kullanıcıyı veritabanında ara
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Access Token oluştur
  const accessToken = jwt.sign({ userId: user.id, role: user.role }, secretKey, { expiresIn: '15m' });

  // Refresh Token oluştur
  const refreshToken = jwt.sign({ userId: user.id }, secretKey, { expiresIn: '7d' });

  // Kullanıcı bilgileri ve yetkileri ile birlikte yanıt ver
  res.json({ accessToken, refreshToken, userInfo: { id: user.id, email: user.email, role: user.role } });
});

// Access Token doğrulama middleware'ı
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token missing' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return res.status(401).json({ message: 'Access token expired' });
    }
    return res.status(403).json({ message: 'Invalid token' });
  }
}

// Örnek bir korumalı rotaya erişim
app.get('/api/profile', authenticateToken, (req, res) => {
  // req.user içinde kullanıcı bilgileri mevcut
  res.json({ message: 'Welcome to your profile!', user: req.user });
});

// Refresh Token doğrulama middleware'ı
function verifyRefreshToken(refreshToken) {
  try {
    const decoded = jwt.verify(refreshToken, secretKey);
    return decoded.userId;
  } catch (error) {
    return null;
  }
}

// Refresh Token yenileme işlemi
app.post('/api/auth/refresh-token', (req, res) => {
  const { refreshToken } = req.body;
  const userId = verifyRefreshToken(refreshToken);

  if (!userId) {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }

  // Yeni Access Token oluştur
  const newAccessToken = jwt.sign({ userId }, secretKey, { expiresIn: '15m' });

  res.json({ accessToken: newAccessToken });
});

// Sunucuyu başlat
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
