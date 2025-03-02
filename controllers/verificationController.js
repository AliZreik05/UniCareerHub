const fsPromises = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const usersDB = 
{
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data }
};

const handleVerification = async (req, res) => 
    {
    const {token,verificationCode } = req.body;
    if (!token|| !verificationCode) 
    {
        return res.status(400).json({ 'message': 'Username and code are required.' });
    }
    try
    {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        const email = decodedToken.user;
        const userIndex = usersDB.users.findIndex(person => person.username === email);
    if (userIndex === -1) 
    {
        return res.status(404).json({ 'message': 'User not found.' });
    }
    const user = usersDB.users[userIndex];
    if (user.verificationCode !== verificationCode) 
    {
        return res.redirect(`/verify?error=${encodeURIComponent('Invalid verification code.')}&token=${encodeURIComponent(token)}`);
    }
    if (Date.now() > user.verificationExpirationPeriod) {
        return res.redirect(`/verify?error=${encodeURIComponent('Expired verification code.')}&token=${encodeURIComponent(token)}`);
    }
    const updatedUser = { ...user, verified: true };
    delete updatedUser.verificationCode;
    delete updatedUser.verificationExpirationPeriod;
    usersDB.users[userIndex] = updatedUser;
    await fsPromises.writeFile
    (
        path.join(__dirname, '..', 'model', 'users.json'),
        JSON.stringify(usersDB.users)
    ); 
    res.redirect('/login');
    }
    catch (err) 
    {
        console.error(err);
        return res.redirect(`/verify?error=${encodeURIComponent('Invalid or expired token.')}&token=${encodeURIComponent(token)}`);
    }
    

};

module.exports = { handleVerification };
