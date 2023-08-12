const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY;



const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, SECRET_KEY);
        console.log({ SECRET_KEY: decoded._id })
        const user = await User.findOne({ _id: decoded._id });
        if (!user) {
            throw new Error();
        }
        req.token = token;
        req.user = user;
        next();
    } catch (error) {
        console.log('Token verification error:', error);
        res.status(401).send({ error: 'Please authenticate.' });
    }
};

module.exports = auth;