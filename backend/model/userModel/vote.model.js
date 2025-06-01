const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema

const voteSchema = new mongoose.Schema({
    electionId: {
        type: ObjectId,
        ref: 'election',
        required: true
    },
    symbolId: {
        type: ObjectId,
        ref: 'symbol',
        required: true
    },
    token: {
        type: String,
        required: true
    },
    orgId: {
        type: ObjectId,
        ref: 'organisation',
        required: false
    },
    positionId: {
        type: ObjectId,
        ref: 'assign_election_position',
        required: false
    }


}, { timestamps: true })
module.exports = mongoose.model('vote', voteSchema)