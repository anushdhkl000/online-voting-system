const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema

const userVoteElectionSchema = new mongoose.Schema({
    symbolId: {
        type: ObjectId,
        ref: 'symbol',
        required: true
    },
    userId: {
        type: ObjectId,
        ref: 'User',
        required: true
    }
})
module.exports = mongoose.model('user_vote', userVoteElectionSchema)