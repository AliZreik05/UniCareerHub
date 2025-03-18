    const jwt = require('jsonwebtoken');
    require('dotenv').config();

    const verifyJWT = (req, res, next) => {
        console.log("Cookies received:", req.cookies);

        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        } else if (req.cookies && req.cookies.accessToken) {
            token = req.cookies.accessToken;
        }

        if (!token) 
        {
            console.log("No token found");
            const isAdminRoute = req.originalUrl.startsWith('/admin');
            return res.redirect(isAdminRoute ? '/admin/login' : '/login'); 
        }

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) 
                {
                console.log("JWT verification error:", err);
                if (err.name === 'TokenExpiredError') 
                {
                    return res.status(401).json({ message: 'Access token expired' });
                }
                return res.status(403).json({ message: 'Unauthorized' });
            }
            req.user = decoded.UserInfo;
            req.roles = decoded.UserInfo.roles;
            next();
        });
    };

    module.exports = verifyJWT;
