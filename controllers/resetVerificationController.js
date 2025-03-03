const fsPromises = require('fs').promises;
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const usersDB = 
{
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data }
};

const verifyReset = async (req,res)=>
{
    const {token,verificationCode } = req.body;
    if (!token || !verificationCode) {
        return res.status(400).send('Missing token or verification code');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const username = decoded.user;
        const userFound = usersDB.users.find(u => u.username === username);
        if (!userFound) 
        {
            return res.redirect(`/resetPassword/verify?error=${encodeURIComponent('User not found')}&token=${encodeURIComponent(token)}`);
        }
        if (userFound.resetVerificationCode !== verificationCode) 
        {
            return res.redirect(`/resetPassword/verify?error=${encodeURIComponent('Verification code is incorrect')}&token=${encodeURIComponent(token)}`);
        }
        if (Date.now() > userFound.resetVerificationExpirationPeriod) 
        {   
            return res.redirect(`/resetPassword/verify?error=${encodeURIComponent('Verification code expired')}&token=${encodeURIComponent(token)}`);
        }
        userFound.password = await bcrypt.hash(userFound.pendingPassword, 10);
        delete userFound.resetVerificationCode;
        delete userFound.resetVerificationExpirationPeriod;
        delete userFound.pendingPassword;
        await fsPromises.writeFile
        (
            path.join(__dirname, '..', 'model', 'users.json'),
            JSON.stringify(usersDB.users)
        );
        return res.redirect('/login?message=' + encodeURIComponent('Password successfully reset'));
    } 
    catch (error) 
    {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
};

module.exports = { verifyReset };

