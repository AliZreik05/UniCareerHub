const express = require('express');
const path = require('path');
const router = express.Router();
const resetVerificationController = require('../controllers/resetVerificationController');

router.get('/',(req,res)=>
{
    res.sendFile(path.join(__dirname,'..','Frontend','HTML','ResetVerify.html'));
})

router.post('/',resetVerificationController.verifyReset);

module.exports = router;