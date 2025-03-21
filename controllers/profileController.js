const users = require('../model/User');
const {logEvents} = require('../middleware/logEvents');

const getProfile = async (req, res) => 
    {
  try {
    const username = req.user.username;
    const userFound = await users.findOne({ username });
    if (!userFound) {
      return res.status(404).json({ error: "User not found" });
    }
    const profileData = {
      username: userFound.username,
      majorYear: userFound.majorYear,
      description: userFound.description,
      courses: userFound.courses,
      experience: userFound.experience
    };
    res.json(profileData);
  } catch (err) {
    console.error(err);
    const users = require('../model/User');
const {logEvents} = require('../middleware/logEvents');

const getProfile = async (req, res) => 
    {
  try {
    const username = req.user.username;
    const userFound = await users.findOne({ username });
    if (!userFound) {
      return res.status(404).json({ error: "User not found" });
    }
    const profileData = {
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

const updateProfile = async (req, res) => {
  try {
    const currentUsername = req.user.username;
    const { username, majorYear, description, courses, experience } = req.body;
    const updatedUsername = username ? username : currentUsername;
    const userFound = await users.findOneAndUpdate(
      { username: currentUsername },
      { username: updatedUsername, majorYear, description, courses, experience },
      { new: true }
    );
    if (!userFound) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({
      success: true,
      profile: {
        username: userFound.username,
        majorYear: userFound.majorYear,
        description: userFound.description,
        courses: userFound.courses,
        experience: userFound.experience
      }
    });
  } catch (err) {
    console.error(err);
    logEvents(`${err.name}: ${err.message}`, 'errLog.txt');
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { getProfile, updateProfile };

    res.status(500).json({ error: "Server error" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const currentUsername = req.user.username;
    const { username, majorYear, description, courses, experience } = req.body;
    const updatedUsername = username ? username : currentUsername;
    const userFound = await users.findOneAndUpdate(
      { username: currentUsername },
      { username: updatedUsername, majorYear, description, courses, experience },
      { new: true }
    );
    if (!userFound) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({
      success: true,
      profile: {
        username: userFound.username,
        majorYear: userFound.majorYear,
        description: userFound.description,
        courses: userFound.courses,
        experience: userFound.experience
      }
    });
  } catch (err) {
    console.error(err);
    logEvents(`${err.name}: ${err.message}`, 'errLog.txt');
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { getProfile, updateProfile };
