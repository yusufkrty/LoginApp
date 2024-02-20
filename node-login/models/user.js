const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/node-login', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB bağlantısı başarılı'))
    .catch(err => console.error('MongoDB bağlantı hatası:', err));

const userSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    //timestamp: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
