const express = require('express');
const path = require('path');
const router = express.Router();
const verifyJWT = require('../middleware/verifyJWT');
const profileController = require('../controllers/profileController');
const User = require('../model/User');

router.get('/:id', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'Frontend', 'HTML', 'ProfilePage.html'));
  });
  
  router.get('/:id/data', verifyJWT, profileController.getProfileById);

router.post('/',verifyJWT,profileController.updateProfile);
module.exports = router;