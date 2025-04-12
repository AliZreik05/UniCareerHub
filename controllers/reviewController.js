const Review = require('../model/Reviews');
const crypto = require('crypto');
const { logEvents } = require('../middleware/logEvents');
const { format } = require('date-fns');

const postReview = async (req, res) => {
  const postId = crypto.randomUUID();
  const user = req.user.username;
  const authorId = req.user._id;
  const { operation, title, review, company, rating, industry, ID } = req.body; // Expect an "ID" for removal

  if (operation === 'remove') {
    try {
      // Only remove if the review's authorId matches the logged-in user.
      await Review.deleteOne({ ID, authorId: req.user._id });
      return res.redirect('/reviews');
    } catch (error) {
      console.error(error);
      logEvents(`${error.name}: ${error.message}`, 'errLog.txt');
      return res.status(500).json({ message: 'Error removing review' });
    }
  } else {
    try {
      const dateTime = new Date(); 
      const newReview = new Review({
        username: user,
        authorId, 
        ID: postId,
        title,
        companyName: company, 
        review,
        industry,
        rating,  
        time: dateTime
      });
      await newReview.save();
      return res.status(200).json({ message: 'Review posted successfully' });
    } catch (error) {
      console.error(error);
      logEvents(`${error.name}: ${error.message}`, 'errLog.txt');
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

const editReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const { review: newReviewText, rating: newRating } = req.body;
    const updatedReview = await Review.findOneAndUpdate(
      { ID: reviewId },
      { review: newReviewText, rating: newRating },
      { new: true }
    );
    if (!updatedReview) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.json({ message: 'Review updated successfully', review: updatedReview });
  } catch (error) {
    console.error(error);
    logEvents(`${error.name}: ${error.message}`, 'errLog.txt');
    res.status(500).json({ error: 'Server error' });
  }
};

const removeReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    // Only allow deletion if the review's authorId matches the logged-in user.
    const deletion = await Review.deleteOne({ ID: reviewId, authorId: req.user._id });
    if (deletion.deletedCount === 0) {
      return res.status(404).json({ error: 'Review not found or not authorized' });
    }
    res.json({ message: 'Review removed successfully' });
  } catch (error) {
    console.error(error);
    logEvents(`${error.name}: ${error.message}`, 'errLog.txt');
    res.status(500).json({ error: 'Server error' });
  }
};

const flagReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const reporter = req.user.username;
    const { reason } = req.body;

    const review = await Review.findOne({ ID: reviewId });
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    if (!review.flaggedBy.includes(reporter)) {
      review.flaggedBy.push(reporter);
      review.flagCount = review.flaggedBy.length;
      review.flagged = true;
      if (reason) {
        review.reportReasons.push(reason);
      }
      await review.save();
    }
    res.json({ message: 'Review flagged successfully', review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const approveReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const updatedReview = await Review.findOneAndUpdate(
      { ID: reviewId },
      { flagged: false, flagCount: 0, flaggedBy: [] },
      { new: true }
    );
    if (!updatedReview) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.json({ message: 'Review approved (flags reset)', review: updatedReview });
  } catch (error) {
    console.error(error);
    logEvents(`${error.name}: ${error.message}`, 'errLog.txt');
    res.status(500).json({ error: 'Server error' });
  }
};

const getReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const review = await Review.findOne({ ID: reviewId });
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const toggleUpvoteReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const username = req.user.username;
    // Find the review by its ID.
    const review = await Review.findOne({ ID: reviewId });
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }
    if (review.upvotedBy.includes(username)) {
      review.upvotes = Math.max(review.upvotes - 1, 0);
      review.upvotedBy = review.upvotedBy.filter(u => u !== username);
    } else {
      review.upvotes = review.upvotes + 1;
      review.upvotedBy.push(username);
    }
    await review.save();
    return res.json({ message: "Review upvote toggled successfully", upvotes: review.upvotes });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  postReview,
  getLatestReviews,
  editReview,
  removeReview,
  flagReview,
  approveReview,
  getReview,
  toggleUpvoteReview
};
