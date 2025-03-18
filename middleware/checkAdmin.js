function checkAdmin(req, res, next) {
    if (req.roles && Array.isArray(req.roles) && req.roles.includes(5150)) {
      return next();
    }
    return res.status(403).json({ message: 'Access denied: Admins only' });
  }
  

module.exports = checkAdmin;