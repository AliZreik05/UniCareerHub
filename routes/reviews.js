const express = require('express');
const path = require('path');
const router = express.Router();
const reviewsController = require ('../controllers/reviewController');

router.get('/',(req,res)=>
{
    res.sendFile(path.join(__dirname,'..','Frontend','HTML','ReviewsSection.html'));
})

router.post('/',reviewsController.postReview);
module.exports = router;