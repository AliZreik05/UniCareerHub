const usersDB = 
{
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data }
}
const fsPromises = require('fs').promises;
const path = require('path');
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

    return 
    (
        password.length >= minLength &&
        hasLowerCase &&
        hasUpperCase &&
        hasDigit &&
        hasSpecialChar
    );
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
            return res.redirect('/register?error='+encodeURIComponent('Password is not strong enough. Your password has to be atleast 8 characters long and has atleast one upper case, one lower case, one digit (0-9) and one special character (!@#$%^&*(),.?":{}|<>)'));
        }
    const duplicate = usersDB.users.find(person => person.username === user); // check for duplicate usernames in the db
    if (duplicate) 
    {

        return res.redirect('/register?error=' + encodeURIComponent('Email already in use.'));                     //Conflict 
    }
    try 
    {
        const generatedCode = generateCode();
        await sendVerificationEmail(user,generatedCode);
        const hashedPassword = await bcrypt.hash(password, 10);   //encrypt the password
        const newUser =                                 //store the new user
        {
            "username": user,
            "password": hashedPassword,
            "roles":
            {
                "User": 2001
            },
            "verified": false,
            "verificationCode":generatedCode,
            "verificationExpirationPeriod":Date.now() + 0.5 * 60 * 1000 
        };
        usersDB.setUsers([...usersDB.users, newUser]);
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'model', 'users.json'),
            JSON.stringify(usersDB.users)
        );
        const token = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '10m' });
        res.redirect(`/verify?token=${encodeURIComponent(token)}`);
    } 
    catch (error) 
    {
        res.status(500).json({ 'message': error.message });
    }
}

module.exports = { handleNewUser };