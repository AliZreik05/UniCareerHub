const User = require('../model/User');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const sendVerificationEmail = require('../middleware/verifyByMail');
function generateCode() 
{
    return crypto.randomBytes(3).toString('hex');
}
function isStrongPassword(password) 
{
    const minLength = 8;
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return (
        password.length >= minLength &&
        hasLowerCase &&
        hasUpperCase &&
        hasDigit &&
        hasSpecialChar
    )
}
const handleNewUser = async (req, res) => 
    {
    const {user,password,confirmPassword} = req.body;
    
    if (!user || !password || !confirmPassword) 
        {
            return res.status(400).json({ 'message': 'Username and password are required.' });
        }
        if(!user.includes("@mail.aub.edu"))
        {
            return res.redirect('/register?error='+encodeURIComponent('The email you used is not an AUB email. Please use an AUB email.'))
        }
        if(password !== confirmPassword)
        {
            return res.redirect('/register?error='+encodeURIComponent('Passwords do not match.'))
        }
        if (!isStrongPassword(password)) 
        {
            return res.redirect('/register?error='+encodeURIComponent('Password must be at least 8 characters with an uppercase letter, a lowercase letter, a digit, and a special character'));
        }
        const duplicate = await User.findOne({ username: user });
    if (duplicate) 
    {

        return res.redirect('/register?error=' + encodeURIComponent('Email already in use.'));                     
    }
    try 
    {
        const generatedCode = generateCode();
        await sendVerificationEmail(user,generatedCode);
        const hashedPassword = await bcrypt.hash(password, 10);  
        const newUser = new User({
            username: user,
            password: hashedPassword,
            roles: { User: 2001 },
            verified: false,
            verificationCode: generatedCode,
            verificationExpirationPeriod: Date.now() + 15 * 60 * 1000,
          });
          await newUser.save();
        const token = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '15m' });
        res.redirect(`/verify?token=${encodeURIComponent(token)}`);
    } 
    catch (error) 
    {
        res.status(500).json({ 'message': error.message });
    }
}

module.exports = { handleNewUser };