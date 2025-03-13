const User = require('../model/User');

const handleLogout = async (req, res) => 
{
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); 
    const refreshToken = cookies.jwt;

    const foundUser = await User.findOne({ refreshToken });
    if (!foundUser) 
    {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        return res.sendStatus(204);
    }
    foundUser.refreshToken = '';
    await foundUser.save();
    //secure: true for both under
    res.clearCookie('accessToken', {
        httpOnly: true,
        sameSite: 'Lax',
        path: '/'
      });
      res.clearCookie('jwt', {
        httpOnly: true,
        sameSite: 'Lax',
        path: '/'
      });
      
    res.redirect('/login')
}

module.exports = { handleLogout }