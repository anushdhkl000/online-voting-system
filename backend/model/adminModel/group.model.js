const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema

const groupSchema = new mongoose.Schema({
    symbol: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    orgId: {
        type: ObjectId,
        ref: 'organisation',
        required: false
    }
})
module.exports = mongoose.model('symbol', groupSchema)