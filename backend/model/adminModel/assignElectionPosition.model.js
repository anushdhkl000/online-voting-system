const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema

const assignElectionPositionSchema = new mongoose.Schema({
    electionId: {
        type: ObjectId,
        ref: 'election',
        required: true
    },
    position: {
        type: String,
        required: true
    },
    contenders: {
        type: Number,
        required: true
    },
    elected: {
        type: Number,
        required: true
    },
    orgId: {
        type: ObjectId,
        ref: 'organisation',
        required: false
    }
})

module.exports = mongoose.model('assign_election_position', assignElectionPositionSchema)