const express = require('express');
const router = express.Router();
const registerController = require('../controllers/registerController');
const path = require('path');

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..','Frontend','HTML', 'Register.html'));
});

router.post('/', registerController.handleNewUser);

module.exports = router;