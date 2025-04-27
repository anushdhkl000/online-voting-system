const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema

const deviceSchema = new mongoose.Schema({
    userAgent: String,
    device: {
        type: String,
    },
    client: {
        clientType: String,
        name: String,
        version: String,
        engine: String,
    },
    os: {
        name: String,
        version: String,
        platform: String
    },
    lastLogin: Date,
    isActive: { type: Boolean, default: true },
    userId: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
})


module.exports = mongoose.model('TrackDevice', deviceSchema)