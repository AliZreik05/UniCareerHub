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
        const generatedCode = generateCode();
        const expiration = Date.now() + 10 * 60 * 1000;
        userFound.resetVerificationCode = generatedCode;
        userFound.resetVerificationExpirationPeriod = expiration;
        userFound.pendingPassword = password;
        await sendVerificationEmail(userFound.username, generatedCode);
        await fsPromises.writeFile
        (
            path.join(__dirname, '..', 'model', 'users.json'),
            JSON.stringify(usersDB.users)
        );
        const resetToken = jwt.sign({ user: userFound.username }, process.env.JWT_SECRET, { expiresIn: '10m' });
        return res.redirect(`/resetPassword/verify?token=${encodeURIComponent(resetToken)}`);
        
}
module.exports = { handleReset };