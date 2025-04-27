const jwt = require('jsonwebtoken');
const { envConfig } = require('../config/envConfig');
const { accessTokenExpiryTime, refreshTokenExpiryTime } = require('../config/constant');

exports.signUpToken = async (user) => {

    const config = envConfig();
    let jwtSecretKey = config.JWT_SECRET;

    let data = {
        exp: Math.floor(Date.now() / 1000) + 300,
        userId: user.id,
        role: user.role
    }
    const token = jwt.sign(data, jwtSecretKey);
    return token
}

exports.verifyToken = async (filters) => {
    const { token, key } = filters
    try {
        const decoded = jwt.verify(token, key);
        return decoded
    } catch (err) {
        return err
    }
}

exports.accessTokenId = async (user) => {
    const config = envConfig();
    let jwtSecretKey = config.ACCESS_TOKEN_SECRET;

    let data = {
        exp: Math.floor(Date.now() / 1000) + accessTokenExpiryTime,
        userId: user.id
    }
    const token = jwt.sign(data, jwtSecretKey);
    return token
}

exports.refreshTokenId = async (user) => {
    const config = envConfig();
    let jwtSecretKey = config.REFRESH_TOKEN_SECRET;

    let data = {
        exp: Math.floor(Date.now() / 1000) + refreshTokenExpiryTime,
        userId: user.id
    }
    const token = jwt.sign(data, jwtSecretKey);
    return token
}