const allowedIPs = require('../config/allowedIPs');

const credentials = (req, res, next) => {
    const origin = req.headers.origin;
    if (allowedIPs.includes(origin)) {
        res.header('Access-Control-Allow-Credentials', true);
    }
    next();
}

module.exports = credentials