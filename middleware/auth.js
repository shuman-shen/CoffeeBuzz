const jwt = require('jsonwebtoken');
const confit = require('config');


module.exports = function (req, res, next) {

    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send('Access denied. No token provided.');

    try{
        const decoded = jwt.verify(token, confit.get('jwtPrivateKey'));
        req.user = decoded;
        // use in route: req.user._id, req.user.admin

        next();
    }
    catch(ex){
        res.status(401).send('Invalid token.'); //401: unauthorized

    }

};