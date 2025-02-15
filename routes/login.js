const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');
const path = require('path')

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..','Frontend','HTML', 'LoginPage.html'));
});
router.post('/', loginController.handleLogin);

module.exports = router;