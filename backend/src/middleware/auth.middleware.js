import jwt from 'jsonwebtoken'
import APIResponse from '../utils/APIResponse.js';

export const authMiddleware = (req, res, next) => {
    try {
        const token = req.cookies.accessToken;
        if (!token) {
            res.status(400).json(APIResponse.errorMethod(false, "something wrong with accesstoken", 400))
        }
        let user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRECT)
        if (!user) {
            res.status(400).json(APIResponse.errorMethod(false, "No user", 400))
        }

        req.userId = user._id
        next()
    } catch (error) {

    }




}

