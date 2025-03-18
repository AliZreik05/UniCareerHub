const express = require('express');
const router = express.Router();
const path = require('path')
const adminLoginController = require('../controllers/adminLoginController');

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..','Frontend','HTML', 'AdminLogInPage.html'));
});

router.post('/',adminLoginController.handleLogin);

module.exports = router;