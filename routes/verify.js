const express = require('express');
const path = require('path');
const router = express.Router();
const verifyContoller = require('../controllers/verificationController');

router.get('/',(req,res)=>
{
    res.sendFile(path.join(__dirname,'..','Frontend','HTML','VerifyCode.html'));
})

router.post('/',verifyContoller.handleVerification);

module.exports = router;