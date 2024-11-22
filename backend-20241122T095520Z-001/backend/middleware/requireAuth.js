const jwt = require("jsonwebtoken");
const User = require('../models/user_customerModel');

const requireAuth = async (req, res, next) => {
    // verify authentication
    const { authorization } = req.headers;

    if(!authorization){
        return res.status(401).json({error: 'Authorization token required'})
    }

    const token = authorization.split(' ')[1]

    try{
        const decoded = jwt.verify(token, process.env.SECRET)

        const user = await User.findById(decoded._id).select('_id'); 

        if (!user) {
            throw new Error('User not found');
        }

        req.user = user;
        next();
    }catch(error){
        console.log(error)
        console.error('Token verification error:', error);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired. Please log in again.' });
        } else {
            return res.status(401).json({ error: 'Request is not authorized' });
        }
    }

}


module.exports = requireAuth;
