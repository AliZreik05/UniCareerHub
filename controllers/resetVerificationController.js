const User = require('../model/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const verifyReset = async (req,res)=>
{
    const {token,verificationCode } = req.body;
    if (!token || !verificationCode) {
        return res.status(400).send('Missing token or verification code');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const username = decoded.username;
        const userFound = await User.findOne({ username });
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
            userFound.resetVerificationCode = undefined;
            userFound.resetVerificationExpirationPeriod = undefined;
            userFound.pendingPassword = undefined;
            await userFound.save();
            return res.redirect(`/resetPassword/verify?error=${encodeURIComponent('Verification code expired')}&token=${encodeURIComponent(token)}`);
        }
        userFound.password = await bcrypt.hash(userFound.pendingPassword, 10);
        userFound.resetVerificationCode = undefined;
        userFound.resetVerificationExpirationPeriod = undefined;
        userFound.pendingPassword = undefined;
        await userFound.save();
        return res.redirect('/login?message=' + encodeURIComponent('Password successfully reset'));
    } 
    catch (error) 
    {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
};

module.exports = { verifyReset };

