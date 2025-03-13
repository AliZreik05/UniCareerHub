const Question = require('../model/Questions');
const crypto = require('crypto');

const postQuestion = async (req, res) => {
  const postId = crypto.randomUUID();
  const { title, question } = req.body;
  const user = req.user.username;
  const newQuestion = new Question({
    username: user,
    ID: postId,
    title,
    question,
    time: new Date(), 
  });
  await newQuestion.save();
  return res.status(200).json({ message: 'Question posted successfully' });
};

const getLatestQuestions = async (req, res) => {
  try {
    const latestQuestions = await Question.find().sort({ time: -1 }).limit(10);
    res.status(200).json(latestQuestions);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

const handleReply = async (req, res) => {
  const { ID, reply } = req.body;
  const user = req.user.username;
  const replyTime = new Date();
  
  const question = await Question.findOne({ ID });
  if (!question) {
    return res.status(404).json({ message: 'Question not found' });
  }
  if (!question.replies) {
    question.replies = [];
  }
  question.replies.push({ user, reply, time: replyTime });
  await question.save();
  return res.status(200).json({ message: 'Reply posted successfully' });
};

module.exports = { postQuestion, getLatestQuestions, handleReply };
