const User = require('../model/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const handleRefreshToken = async(req, res) => 
{
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;

    const foundUser = await User.findOne({ refreshToken });
    if (!foundUser) return res.sendStatus(403); 
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundUser.username !== decoded.username) return res.sendStatus(403);
            const roles = Array.from(foundUser.roles.values()); 
            const accessToken = jwt.sign(
                {
                    "UserInfo" : 
                    {
                        "username": decoded.username,
                        "roles": roles
                    },
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '30m' }
            );
            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                sameSite: 'Lax',
                maxAge: 30 * 60 * 1000,
                path: '/'
            });
            res.json({ accessToken });
        }
    );
}

module.exports = { handleRefreshToken }