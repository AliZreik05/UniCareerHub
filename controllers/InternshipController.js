const Internship = require('../model/Internships');
const crypto = require('crypto');
const { logEvents } = require('../middleware/logEvents');

const postInternship = async (req, res) => {
  try {
    const internshipId = crypto.randomUUID();
    const { company, position, description, applyLink } = req.body;
    if (!company || !position || !description || !applyLink) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    const newInternship = new Internship({
      ID: internshipId,
      company,
      position,
      description,
      applyLink,
      datePosted: new Date()
    });
    await newInternship.save();
    return res.status(200).json({ message: 'Internship posted successfully' });
  } catch (error) {
    console.error(error);
    logEvents(`${error.name}: ${error.message}`, 'errLog.txt');
    return res.status(500).json({ error: 'Server error' });
  }
};

const getLatestInternships = async (req, res) => {
  try {
    const latestInternships = await Internship.find().sort({ datePosted: -1 });
    res.status(200).json(latestInternships);
  } catch (error) {
    console.error(error);
    logEvents(`${error.name}: ${error.message}`, 'errLog.txt');
    res.status(500).json({ error: 'Server error' });
  }
};

const editInternship = async (req, res) => {
  try {
    const internshipId = req.params.id;
    const { company, position, description, applyLink } = req.body;
    const updatedInternship = await Internship.findOneAndUpdate(
      { ID: internshipId },
      { company, position, description, applyLink },
      { new: true }
    );
    if (!updatedInternship) {
      return res.status(404).json({ error: 'Internship not found' });
    }
    res.status(200).json({ message: 'Internship updated successfully', internship: updatedInternship });
  } catch (error) {
    console.error(error);
    logEvents(`${error.name}: ${error.message}`, 'errLog.txt');
    res.status(500).json({ error: 'Server error' });
  }
};

const removeInternship = async (req, res) => {
  try {
    const internshipId = req.params.id;
    const deletion = await Internship.deleteOne({ ID: internshipId });
    if (deletion.deletedCount === 0) {
      return res.status(404).json({ error: 'Internship not found' });
    }
    res.status(200).json({ message: 'Internship removed successfully' });
  } catch (error) {
    console.error(error);
    logEvents(`${error.name}: ${error.message}`, 'errLog.txt');
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { postInternship, getLatestInternships, editInternship, removeInternship };
