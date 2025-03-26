const express = require('express');
const path = require('path');
const router = express.Router();
const qnaController = require ('../controllers/qnaController');

router.get('/',(req,res)=>
{
    res.sendFile(path.join(__dirname,'..','Frontend','HTML','Q&ASection.html'));
})
router.get('/latest', qnaController.getLatestQuestions);
router.post('/reply',qnaController.handleReply);

router.delete('/:id', qnaController.removeQuestion);
router.delete('/reply/:id', qnaController.removeReply);

router.post('/flag/:id', qnaController.flagQuestion);
router.post('/reply/flag/:id', qnaController.flagReply);


router.post('/',qnaController.postQuestion);
module.exports = router;