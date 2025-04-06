const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {logEvents} = require('../middleware/logEvents');
require('dotenv').config();

const handleLogin = async (req, res) => 
{
    try{
    const { email, password } = req.body;
    if (!email || !password) 
    {
        return res.redirect('/login?error=' + encodeURIComponent('Invalid email or password.')); 
    }
    const foundUser = await User.findOne({ email: email });
    if (!foundUser) 
    {
        return res.redirect('/login?error=' + encodeURIComponent('User not found')); 
    }
    
    const match = await bcrypt.compare(password, foundUser.password); 
    if (match) 
    {
        if (!foundUser.verified) 
            {
            return res.redirect('/login?error=' + encodeURIComponent('User email not verified'));
          }
        if(foundUser.suspended)
        {
            return res.redirect('/login?error=' + encodeURIComponent('User is suspended'));
        }
        const roles = Array.from(foundUser.roles.values());
        const accessToken = jwt.sign(
            {
            "UserInfo":
                {
                    "_id": foundUser._id,
                    "username": foundUser.username,
                    "roles": roles
                }
            },
             process.env.ACCESS_TOKEN_SECRET,   
             { expiresIn: '12h' }

        );
        const refreshToken = jwt.sign(
            { 
                "username": foundUser.username 
            },
            process.env.REFRESH_TOKEN_SECRET,
            { 
                expiresIn: '1d' 
            }
        );
        foundUser.refreshToken = refreshToken;
        await foundUser.save();

        //secure: true          USE THIS WHEN WE GO LIVE(WHEN WE BECOME HTTPS)
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            sameSite: 'Lax', 
            maxAge: 12 * 60 * 60 * 1000, // 30 minutes
            path: '/'
          });
          
          res.cookie('jwt', refreshToken, {
            httpOnly: true,
            sameSite: 'Lax', 
            maxAge: 24 * 60 * 60 * 1000,
            path: '/'
          });
          res.cookie('isLoggedIn', 'true', {
            sameSite: 'Lax',
            maxAge: 12 * 60 * 60 * 1000,
            path: '/'
          });
          res.cookie('currentUser', foundUser.username, {
            sameSite: 'Lax',
            maxAge: 12 * 60 * 60 * 1000,
            path: '/'
          });
          res.cookie('currentUserId', foundUser._id.toString(), { 
            sameSite: 'Lax', 
            maxAge: 12 * 60 * 60 * 1000, 
            path: '/' });

        res.redirect('/');
    } 
    else 
    {
        return res.redirect('/login?error=' + encodeURIComponent('Incorrect password')); 
    }
}
catch (error) {
    logEvents(`${error.name}: ${error.message}`, 'errLog.txt');
    return res.redirect('/login?error=' + encodeURIComponent('An error occurred during login'));
  }
}

module.exports = { handleLogin };