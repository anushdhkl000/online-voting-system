const { envConfig } = require('../config/envConfig');
const jwt = require('jsonwebtoken');
const { AuthService } = require('../service/authService/auth.service');
const { refreshTokenExpiryTime, accessTokenExpiryTime } = require('../config/constant');

const bearerToken = async (req, res, next) => {
    const config = envConfig()
    const ACCESS_TOKEN_SECRET = config.ACCESS_TOKEN_SECRET;
    const accessToken = req.headers['authorization']?.split(' ')[1]; // Bearer <token>
    const refreshToken = req.headers['x-refresh-token']

    if (!accessToken) {
        return res.status(403).json({ message: 'Bearer not found' });
    }

    if (!accessToken && !refreshToken) {
        return res.status(403).json({ message: 'Bearer not found' });
    }


    jwt.verify(accessToken, ACCESS_TOKEN_SECRET, async (err, decoded) => {
        if (err) {
            if (refreshToken) {

                const { accessToken, userId } = await AuthService.generateRefreshToken({ refreshToken })
                const baseConfig = { httpOnly: true, secure: true }
                res.cookie('access_token', accessToken, { ...baseConfig, maxAge: Math.floor(Date.now() / 1000) + accessTokenExpiryTime })
                res.cookie('refresh_token', refreshToken, { ...baseConfig, maxAge: Math.floor(Date.now() / 1000) + refreshTokenExpiryTime })
                req.userId = userId
                return next()
            }

        }
        req.userId = decoded?.userId || null
        return next();
    });


};

module.exports = {
    bearerToken
}
