const Question = require('../model/Questions');
const Review = require('../model/Reviews');
const User = require('../model/User');
const { logEvents } = require('../middleware/logEvents');

const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalReviews = await Review.countDocuments();
    const totalQuestions = await Question.countDocuments();
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const activeUsers = await User.countDocuments({ lastActivity: { $gte: fiveMinutesAgo } });
    const recentReviews = await Review.find().sort({ time: -1 }).limit(10);
    const recentQuestions = await Question.find().sort({ time: -1 }).limit(10);
    const taggedReviews = recentReviews.map(review => ({ 
      ...review.toObject(), 
      type: 'Review'
    }));
    const taggedQuestions = recentQuestions.map(question => ({ 
      ...question.toObject(), 
      type: 'Question'
    }));
    const combined = [...taggedReviews, ...taggedQuestions].sort((a, b) => new Date(b.time) - new Date(a.time));
    const recentActivity = combined.slice(0, 10);
    res.json({
      totalUsers,
      totalReviews,
      totalQuestions,
      activeUsers,
      recentActivity
    });
  } catch (error) {
    logEvents(`${error.name}: ${error.message}`, 'errLog.txt');
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getStats };
