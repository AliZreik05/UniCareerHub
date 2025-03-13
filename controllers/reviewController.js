const Review = require('../model/Reviews');
const crypto = require('crypto');
const { format } = require('date-fns');

const postReview = async (req, res) => {
  const postId = crypto.randomUUID();
  const user = req.user.username;
  const { operation, title, review, company, industry, ID } = req.body; // Expect an "ID" for removal

  if (operation === 'remove') {
    try {
      await Review.deleteOne({ ID, username: user });
      return res.redirect('/reviews');
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error removing review' });
    }
  } else {
    try {
      const dateTime = new Date(); 
      const newReview = new Review({
        username: user,
        ID: postId,
        title,
        companyName: company, 
        review,
        industry,
        time: dateTime
      });
      await newReview.save();
      return res.status(200).json({ message: 'Review posted successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error posting review' });
    }
  }
};

const getLatestReviews = async (req, res) => {
  try {
    const latestReviews = await Review.find().sort({ time: -1 }).limit(10);
    res.status(200).json(latestReviews);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

module.exports = { postReview, getLatestReviews };
