const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { logEvents } = require('../middleware/logEvents');


const handleLogin = async (req, res) => 
{   
    try{
    const { email, password } = req.body;
    if (!email || !password) 
    {
        return res.redirect('/admin/login?error=' + encodeURIComponent('Invalid email or password.')); 
    }
    const foundUser = await User.findOne({ email:email });
    if (!foundUser) 
    {
        return res.redirect('/admin/login?error=' + encodeURIComponent('User not found')); 
    }
    if(foundUser.suspended)
    {
        return res.redirect('/admin/login?error=' + encodeURIComponent('User is suspended'));
    }
    const match = await bcrypt.compare(password, foundUser.password); 
    if (match) 
    {
            const roles = Array.from(foundUser.roles.values()); 
            if (foundUser.roles.get('Admin') !== 5150) 
            {
                return res.redirect('/admin/login?error=' + encodeURIComponent('User unauthorized'));
            }
            
        const accessToken = jwt.sign(
            {
            "UserInfo":
                {
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
        res.redirect('/admin/navigation');
    } 
    else 
    {
        return res.redirect('/admin/login?error=' + encodeURIComponent('Incorrect password')); 
    }
}
catch (error) 
{
    logEvents(`${error.name}: ${error.message}`, 'errLog.txt');
    return res.redirect('/admin/login?error=' + encodeURIComponent('An error occurred during login'));
  }
}

module.exports = { handleLogin };