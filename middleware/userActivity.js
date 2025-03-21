const User = require('../model/User');

const updateLastActivity = async (req, res, next) => {
  try 
  {
    if (req.user && req.user.username) {
      await User.findOneAndUpdate(
        { username: req.user.username },
        { lastActivity: new Date() }
      );
    }
  } catch (err) {
    console.error('Error updating last activity:', err);
  }
  next();
};

module.exports = updateLastActivity;
