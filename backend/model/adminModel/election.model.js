const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema

const electionSchema = new mongoose.Schema({
    title: {
        type: String,
        unique: true,
        required: true
    },
    startedAt: {
        type: Date,
        default: Date.now()
    },
    endedAt: {
        type: Date,
        default: Date.now()
    },
    timeZone: {
        type: String,
        required: true
    }

})
module.exports = mongoose.model('election', electionSchema)