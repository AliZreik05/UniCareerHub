const User = require('../model/User');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
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
    );
}

const handleReset= async(req,res) =>
{
    const { email, password, confirmPassword } = req.body;
    const userFound = await User.findOne({ email: email });

    if(!userFound)
    {
       return res.redirect('/reset?error='+encodeURIComponent('User does not exist'));
    }
    else if(password!==confirmPassword)
    {
        return res.redirect('/reset?error='+encodeURIComponent('Password and confirm do not match'));
    }
    if (!isStrongPassword(password)) 
        {
            return res.redirect('/reset?error='+encodeURIComponent('Password must be at least 8 characters with an uppercase letter, a lowercase letter, a digit, and a special character'));
        }
        const generatedCode = generateCode();
        const expiration = Date.now() + 15 * 60 * 1000;
        userFound.resetVerificationCode = generatedCode;
        userFound.resetVerificationExpirationPeriod = Date.now() + 15 * 60 * 1000;
        userFound.pendingPassword = password;
  
        await sendVerificationEmail(userFound.email, generatedCode);
        await userFound.save();
        const resetToken = jwt.sign({ user: userFound.username }, process.env.JWT_SECRET, { expiresIn: '15m' });
        return res.redirect(`/resetPassword/verify?token=${encodeURIComponent(resetToken)}`);
        
}
module.exports = { handleReset };