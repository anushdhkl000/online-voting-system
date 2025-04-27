const mongoose = require('mongoose')

const groupSchema = new mongoose.Schema({
    symbol: {
        type: String,
        required: true
    },
    name: {
        type: String,
        unique: true,
        required: true
    }
})
module.exports = mongoose.model('group', groupSchema)