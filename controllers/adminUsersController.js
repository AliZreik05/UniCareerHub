const User = require('../model/User');
const {logEvents} = require('../middleware/logEvents')

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

const removeUser = async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) {
      return res.redirect('/admin/users?error=' + encodeURIComponent('User not found'));
    }
    const result = await User.deleteOne({ username });
    if (result.deletedCount === 0) {
      return res.redirect('/admin/users?error=' + encodeURIComponent('User not found'));
    }
    return res.redirect('/admin/users?success=' + encodeURIComponent('User deleted successfully'));
  } catch (error) {
    logEvents(`${error.name}: ${error.message}`, 'errLog.txt');
    console.error(error);
    return res.redirect('/admin/users?error=' + encodeURIComponent('Error deleting user'));
  }
};

const toggleUserStatus = async (req, res) => {
  try {
    const { username, currentStatus } = req.body;
    if (!username) {
      return res.redirect('/admin/users?error=' + encodeURIComponent("Username is required"));
    }
    const newStatus = currentStatus === "Active" ? true : false;
    const updatedUser = await User.findOneAndUpdate(
      { username },
      { suspended: newStatus },
      { new: true }
    );
    if (!updatedUser) {
      return res.redirect('/admin/users?error=' + encodeURIComponent("User not found"));
    }
    return res.redirect('/admin/users?success=' + encodeURIComponent(`User status updated to ${newStatus ? "Suspended" : "Active"}`));
  } catch (error) {
    logEvents(`${error.name}: ${error.message}`, 'errLog.txt');
    console.error(error);
    return res.redirect('/admin/users?error=' + encodeURIComponent("Error updating user status"));
  }
};
const updateUser = async (req, res) => {
    try {
      let { username, email, verified, roles } = req.body;
      if (!username) {
        return res.redirect('/admin/users?error=' + encodeURIComponent("Username is required"));
      }
      const updateData = {};
      if (email) updateData.email = email;
      if (typeof verified === "boolean") updateData.verified = verified;
      if (!Array.isArray(roles)) {
        roles = [roles];
      }
      const roleMap = {};
      roles.forEach(role => {
        if (role === "Admin") {
          roleMap[role] = 5150;
        } else if (role === "User") {
          roleMap[role] = 2001;
        }
      });
      updateData.roles = roleMap;
      const updatedUser = await User.findOneAndUpdate({ username }, updateData, { new: true });
      if (!updatedUser) {
        return res.redirect('/admin/users?error=' + encodeURIComponent("User not found"));
      }
      return res.redirect('/admin/users?success=' + encodeURIComponent("User updated successfully"));
    } catch (error) {
      logEvents(`${error.name}: ${error.message}`, 'errLog.txt');
      console.error("Error updating user:", error);
      return res.redirect('/admin/users?error=' + encodeURIComponent("Server error updating user"));
    }
  };
  

module.exports = { getAllUsers, removeUser, toggleUserStatus, updateUser };
