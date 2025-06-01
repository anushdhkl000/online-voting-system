const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema

const userVoteElectionSchema = new mongoose.Schema({
    electionId: {
        type: ObjectId,
        ref: 'election',
        required: true
    },
    positionId: {
        type: ObjectId,
        ref: 'assign_election_position',
        required: true
    },
    userId: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    orgId: {
        type: ObjectId,
        ref: 'organisation',
        required: false
    }
})
module.exports = mongoose.model('user_vote_election', userVoteElectionSchema)