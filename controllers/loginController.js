const usersDB = 
{
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data }
};
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const fsPromises = require('fs').promises;
const path = require('path');

const handleLogin = async (req, res) => 
{
    const { user, password } = req.body;
    if (!user || !password) 
    {
        return res.redirect('/login?error=' + encodeURIComponent('Invalid email or password.')); 
    }
    const foundUser = usersDB.users.find(person => person.username === user);
    if (!foundUser) 
    {
        return res.redirect('/login?error=' + encodeURIComponent('User not found')); 
    }
    
    const match = await bcrypt.compare(password, foundUser.password); // evaluate password 
    if (match) 
    {
        const userIndex = usersDB.users.findIndex(person => person.username === user);
        const isVerified = usersDB.users.at(userIndex).verified;
        if(!isVerified)
        {
            return res.redirect('/login?error=' + encodeURIComponent('User email not verified')); 
        }
        const roles = Object.values(foundUser.roles); // create JWTs
        const accessToken = jwt.sign(
            {
            "UserInfo":
                {
                    "username": foundUser.username,
                    "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { 
                expiresIn: '5m' 
            }
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
        const otherUsers = usersDB.users.filter(person => person.username !== foundUser.username);
        const currentUser = { ...foundUser, refreshToken };
        usersDB.setUsers([...otherUsers, currentUser]);
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'model', 'users.json'),
            JSON.stringify(usersDB.users)
        );
        //secure: true          USE THIS WHEN WE GO LIVE(WHEN WE BECOME HTTPS)
        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000, path:'/'});
        res.redirect('/');
    } 
    else 
    {
        return res.redirect('/login?error=' + encodeURIComponent('Incorrect password')); 
    }
}

module.exports = { handleLogin };