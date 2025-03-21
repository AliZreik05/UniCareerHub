const User = require('../model/User');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const sendVerificationEmail = require('../middleware/verifyByMail');
const {logEvents} = require('../middleware/logEvents')
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
    
    const { username, email, password, confirmPassword } = req.body;
    
    if (!username|| !email || !password || !confirmPassword) 
        {
            return res.status(400).json({ 'message': 'Username and password are required.' });
        }
        if(!email.includes("@mail.aub.edu"))
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

        const duplicateEmail = await User.findOne({ email:email});
        const duplicateUsername = await User.findOne({username:username});
    if (duplicateEmail) 
    {

        return res.redirect('/register?error=' + encodeURIComponent('Email already in use.'));                     
    }
    else if (duplicateUsername)
    {
        return res.redirect('/register?error=' + encodeURIComponent('Username taken.'));      
    }
    try 
    {
        const generatedCode = generateCode();
        await sendVerificationEmail(email,generatedCode);
        const hashedPassword = await bcrypt.hash(password, 10);  
        const newUser = new User({
            username: username,
            email: email,
            password: hashedPassword,
            roles: { User: 2001 },
            verified: false,
            verificationCode: generatedCode,
            verificationExpirationPeriod: Date.now() + 15 * 60 * 1000,
          });
          await newUser.save();
        const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '15m' });
        res.redirect(`/verify?token=${encodeURIComponent(token)}`);
    } 
    catch (error) 
    {
        res.status(500).json({ 'message': error.message });
        logEvents(`${error.name}: ${error.message}`, 'errLog.txt');
    }
}

module.exports = { handleNewUser };