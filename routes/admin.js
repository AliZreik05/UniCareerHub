const express = require('express');
const router = express.Router();
const path = require('path')

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..','Frontend','HTML', 'AdminLogInPage.html'));
});
router.get('/content', (req, res) => {
    res.sendFile(path.join(__dirname, '..','Frontend','HTML', 'AdminContent.html'));
});
router.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '..','Frontend','HTML', 'AdminDashboard.html'));
});
router.get('/users', (req, res) => {
    res.sendFile(path.join(__dirname, '..','Frontend','HTML', 'AdminUserManagement.html'));
});
router.get('/navigation', (req, res) => {
    res.sendFile(path.join(__dirname, '..','Frontend','HTML', 'AdminNavigation.html'));
});

module.exports = router;