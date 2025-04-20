const users = require('../model/User');
const { logEvents } = require('../middleware/logEvents');

// GET /profile/:id/data
const getProfileById = async (req, res) => {
  try {
    const profileId = req.params.id;
    const userFound = await users.findById(profileId);

    if (!userFound) {
      return res.status(404).json({ error: "User not found" });
    }

    const profileData = {
      _id: userFound._id,
      username: userFound.username,
      majorYear: userFound.majorYear,
      description: userFound.description,
      courses: userFound.courses,
      experience: userFound.experience
    };

    res.json(profileData);
  } catch (err) {
    console.error(err);
    logEvents(`${err.name}: ${err.message}`, 'errLog.txt');
    res.status(500).json({ error: "Server error" });
  }
};

// POST /profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id; // ✅ safer than username
    const { username, majorYear, description, courses, experience } = req.body;

    const updatedUser = await users.findByIdAndUpdate(
      userId,
      { username, majorYear, description, courses, experience },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // ✅ Optional: Update username cookie if username was changed
    if (req.user.username !== updatedUser.username) {
      res.cookie('currentUser', updatedUser.username, {
        sameSite: 'Lax',
        maxAge: 12 * 60 * 60 * 1000,
        path: '/'
      });
    }

    res.json({
      success: true,
      profile: {
        username: updatedUser.username,
        majorYear: updatedUser.majorYear,
        description: updatedUser.description,
        courses: updatedUser.courses,
        experience: updatedUser.experience
      }
    });
  } catch (err) {
    console.error(err);
    logEvents(`${err.name}: ${err.message}`, 'errLog.txt');
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { getProfileById, updateProfile };
