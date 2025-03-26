const express = require('express');
const router = express.Router();
const path = require('path')
const usersController = require('../controllers/adminUsersController');
const adminDashboardController = require('../controllers/adminDashboardController');
const adminErrorLogsController = require('../controllers/adminErrorController');
const reviewController = require('../controllers/reviewController');
const questionController = require('../controllers/qnaController');
const adminReportsController = require('../controllers/adminReportsController');
const internshipController = require('../controllers/InternshipController');

router.get('/content', (req, res) => {
    res.sendFile(path.join(__dirname, '..','Frontend','HTML', 'AdminContent.html'));
});

router.get('/content/reports', adminReportsController.getReports);
router.get('/content/review/:id', reviewController.getReview);
router.get('/content/question/:id', questionController.getQuestion);

router.put('/content/review/edit/:id', reviewController.editReview);
router.delete('/content/review/:id',reviewController.removeReview);
router.put('/content/review/flag/:id', reviewController.flagReview);

router.put('/content/question/edit/:id', questionController.editQuestion);
router.delete('/content/question/:id', questionController.removeQuestion);
router.put('/content/question/flag/:id', questionController.flagQuestion);

router.put('/content/question/reply/edit/:id', questionController.editReply);
router.delete('/content/question/reply/:id', questionController.removeReply);
router.put('/content/question/reply/flag/:id', questionController.flagReply);
router.get('/content/question/reply/:id', questionController.getReply);

router.put('/content/review/approve/:id', reviewController.approveReview);
router.put('/content/question/approve/:id', questionController.approveQuestion);
router.put('/content/question/reply/approve/:id', questionController.approveReply);

router.get('/internships',(req,res)=>
{
    res.sendFile(path.join(__dirname, '..','Frontend','HTML', 'AdminInternship.html'));
})
router.get('/internships/latest', internshipController.getLatestInternships);
router.post('/internships', internshipController.postInternship);
router.put('/internships/:id', internshipController.editInternship);
router.delete('/internships/:id', internshipController.removeInternship);



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