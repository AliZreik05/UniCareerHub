const User = require('../model/User');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const sendVerificationEmail = require('../middleware/verifyByMail');
require('dotenv').config();

const handleVerification = async (req, res) => 
    {
    const {token,verificationCode } = req.body;
    if (!token|| !verificationCode) 
    {
        return res.status(400).json({ 'message': 'Token and code are required.' });
    }
    try
    {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const username = decodedToken.username;
        const user = await User.findOne({ username: username });
        if (!user) 
            {
            return res.status(404).json({ message: 'User not found.' });
          }
    if (user.verificationCode !== verificationCode) 
    {
        return res.redirect(`/verify?error=${encodeURIComponent('Invalid verification code.')}&token=${encodeURIComponent(token)}`);
    }
    if (Date.now() > user.verificationExpirationPeriod) {
        return res.redirect(`/verify?error=${encodeURIComponent('Expired')}&token=${encodeURIComponent(token)}`);
    }
    user.verified = true;
    user.verificationCode = undefined;
    user.verificationExpirationPeriod = undefined;
    await user.save();
    res.redirect('/login');
    }
    catch (err) 
    {
        console.error(err);
        return res.redirect(`/verify?error=${encodeURIComponent('Invalid or expired token.')}&token=${encodeURIComponent(token)}`);
    }
};

function generateCode() 
{
    return crypto.randomBytes(3).toString('hex');
}

const handleResend = async (req,res) =>
    {

        const {token} = req.query;
    if (!token) 
    {
        return res.status(400).json({ 'message': 'Username and code are required.' });
    }
    try
    {
        const decodedToken = jwt.verify(token,process.env.JWT_SECRET);
        const username = decodedToken.username; 
        const user = await User.findOne({ username: username });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
          }
          const newVerificationCode = generateCode();
          user.verificationCode = newVerificationCode;
          user.verificationExpirationPeriod = Date.now() + 0.5 * 60 * 1000;
          await user.save();
        await sendVerificationEmail(user.email, newVerificationCode);
        res.redirect(`/verify?message=${encodeURIComponent('A new verification code has been sent.')}&token=${encodeURIComponent(token)}`);
    }
    catch (err) 
    {
        console.error(err);
        return res.redirect(`/verify?error=${encodeURIComponent('Invalid or expired token.')}&token=${encodeURIComponent(token)}`);
    }
    }

module.exports = { handleVerification,handleResend };
