const express = require('express');
const router = express.Router();
const path = require('path')
const usersController = require('../controllers/adminUsersController');
const adminDashboardController = require('../controllers/adminDashboardController');
const adminErrorLogsController = require('../controllers/adminErrorController');

router.get('/content', (req, res) => {
    res.sendFile(path.join(__dirname, '..','Frontend','HTML', 'AdminContent.html'));
});
router.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '..','Frontend','HTML', 'AdminDashboard.html'));
});
router.get('/dashboard/stats', adminDashboardController.getStats);
router.get('/error-logs', adminErrorLogsController.getErrorLogs);

router.get('/users', (req, res) => {
    res.sendFile(path.join(__dirname, '..','Frontend','HTML', 'AdminUserManagement.html'));
});
router.get('/users/latest', usersController.getAllUsers);
router.post('/users/delete', usersController.removeUser);
router.post('/users/toggle-status', usersController.toggleUserStatus);
router.post('/users/edit', usersController.updateUser);


router.get('/navigation', (req, res) => {
    res.sendFile(path.join(__dirname, '..','Frontend','HTML', 'AdminNavigation.html'));
});

module.exports = router;