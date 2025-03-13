const fsPromises = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const sendVerificationEmail = require('../middleware/verifyByMail');
const usersDB = 
{
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data }
};

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
    const {user,password,confirmPassword} = req.body;
    const userFound = usersDB.users.find(person => person.username===user);
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
        userFound.resetVerificationExpirationPeriod = expiration;
        userFound.pendingPassword = password;
        await sendVerificationEmail(userFound.username, generatedCode);
        await fsPromises.writeFile
        (
            path.join(__dirname, '..', 'model', 'users.json'),
            JSON.stringify(usersDB.users)
        );
        const resetToken = jwt.sign({ user: userFound.username }, process.env.JWT_SECRET, { expiresIn: '15m' });
        return res.redirect(`/resetPassword/verify?token=${encodeURIComponent(resetToken)}`);
        
}
module.exports = { handleReset };