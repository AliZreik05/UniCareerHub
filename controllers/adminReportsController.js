const Review = require('../model/Reviews');
const Question = require('../model/Questions');

const getReports = async (req, res) => {
  try {
    const flaggedReviews = await Review.find({ flagged: true });
    const flaggedQuestions = await Question.find({ flagged: true });
    const questionsWithFlaggedReplies = await Question.find({ 'replies.flagged': true });

    const reviewReports = flaggedReviews.map(r => ({
      reportedBy: r.username,
      contentType: 'Review',
      reason: `Flag count: ${r.flagCount || 0}`,
      date: r.time,
      ID: r.ID,
      isReply: false
    }));

    const questionReports = flaggedQuestions.map(q => ({
      reportedBy: q.username,
      contentType: 'Question',
      reason: `Flag count: ${q.flagCount || 0}`,
      date: q.time,
      ID: q.ID,
      isReply: false
    }));

    let replyReports = [];
    questionsWithFlaggedReplies.forEach(q => {
      q.replies
        .filter(rep => rep.flagged === true)
        .forEach(rep => {
          replyReports.push({
            reportedBy: rep.user,
            contentType: 'Reply',
            reason: 'Flagged',
            date: rep.time,
            questionID: q.ID,
            replyID: rep._id,
            isReply: true
          });
        });
    });

    const allReports = [...reviewReports, ...questionReports, ...replyReports];
    res.json(allReports);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching reports' });
  }
};

module.exports = { getReports };
