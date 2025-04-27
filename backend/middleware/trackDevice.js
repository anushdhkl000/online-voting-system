const DeviceDetector = require('device-detector-js');
const deviceDetector = new DeviceDetector();

const trackDevice = async (req, res, next) => {
    const userAgent = req.headers['user-agent'];
    const device = deviceDetector.parse(userAgent);

    req.deviceInfo = {
        userAgent,
        device: {
            type: device.device?.type || 'desktop',
            brand: device.device?.brand,
            model: device.device?.model,
        },
        client: {
            type: device.client?.type, // 'browser', 'app', etc.
            name: device.client?.name,
            version: device.client?.version,
            engine: device.client?.engine,
            engineVersion: device.client?.engine_version,
        },
        os: {
            name: device.os?.name,
            version: device.os?.version,
            platform: device.os?.platform,
        },
        ipAddress: req.ip || req.connection.remoteAddress,
        loginTime: new Date()
    };

    next()
}

module.exports = {
    trackDevice
}