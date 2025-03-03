const express = require('express');
const path = require('path');
const router = express.Router();
const resetController = require('../controllers/resetController')


router.get('/',(req,res)=>
{
    res.sendFile(path.join(__dirname,'..','Frontend','HTML','ResetPassword.html'));
})
router.post('/',resetController.handleReset);

module.exports = router;