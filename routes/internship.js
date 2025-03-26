const express = require('express');
const path = require('path');
const router = express.Router();
const internshipController = require('../controllers/InternshipController');

router.get('/',(req,res)=>
{
    res.sendFile(path.join(__dirname,'..','Frontend','HTML','InternshipPage.html'));
})

router.get('/latest', internshipController.getLatestInternships);
router.post('/', internshipController.postInternship);
router.put('/:id', internshipController.editInternship);
router.delete('/:id', internshipController.removeInternship);

module.exports = router;