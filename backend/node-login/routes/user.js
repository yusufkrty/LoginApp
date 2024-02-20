const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const secretkey='yusuf';
//const LoginAttempt = require('../models/loginAttempt');

// kullanıcı oluşturma
/*router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ email, password: hashedPassword });
        await user.save();
        res.status(201).send('Kullanıcı oluşturuldu.');
    } catch (error) {
        res.status(500).send('Kullanıcı oluşturulurken bir hata oluştu.');
    }
});*/

// Kullanıcı doğrulama
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user= await User.findOne({email});
        //const user = new User({ email, password });
        //await user.save();
    if (!user) {
            return res.status(404).send('Kullanıcı Adı Veya Şifre Yanlış');
        }
    //console.log("sifre "+ password+" "+user.password);
    //const validPassword= await bcrypt.compare(password,user.password);
    
    if(password !== user.password)
    {
        return res.status(404).send('Kullanıcı Adı Veya Şifre Yanlış');
    }
    const token = jwt.sign({ email }, secretkey);
    res.send({ token });

    } catch (error) {
        res.status(500).send('Giriş yapılırken bir hata oluştu.');
    }
});


router.get('/users', async (req, res) => {
    const token = req.header('Authorization');
    if(!token) return res.status(401).json({error:"Giriş Reddeildi"});
    console.log(token);
    try {
        const decoded = jwt.verify(token,secretkey);
        req.user=decoded;
        console.log(decoded);
        res.status(200).send(req.user);
        //next();
        //const users = await User.find({}, 'email');
        //res.json(users);
    } catch (error) {
        res.status(400).send('Geçersiz Token');
    }
});


module.exports = router;
