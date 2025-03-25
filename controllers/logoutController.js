const User = require('../model/User');
const {logEvents} = require('../middleware/logEvents')

const handleLogout = async (req, res) => 
{
  try
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
      res.clearCookie('isLoggedIn', {
        sameSite: 'Lax',
        path: '/'
      });
      res.clearCookie('currentUser', {
        sameSite: 'Lax',
        path: '/'
      });
      
      
    res.redirect('/login')
  }
  catch (error) {
    logEvents(`${error.name}: ${error.message}`, 'errLog.txt');
    return res.redirect('/logout?error=' + encodeURIComponent('An error occurred during logout'));
  }
}

module.exports = { handleLogout }