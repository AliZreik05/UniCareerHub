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

        if (!token) {
            console.log("No token found");
            return res.redirect('/login'); 
        }

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                console.log("JWT verification error:", err);
                return res.redirect('/login'); 
            }
            req.user = decoded.UserInfo;
            req.roles = decoded.UserInfo.roles;
            next();
        });
    };

    module.exports = verifyJWT;
