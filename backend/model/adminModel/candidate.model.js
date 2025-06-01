const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema

const candidateSchema = new mongoose.Schema({
    groupName: {
        type: String,
        required: false
    },
    firstName: {
        type: String,
        required: false
    },
    lastName: {
        type: String,
        required: false
    },
    electionId: {
        type: ObjectId,
        ref: 'election',
        required: true
    },
    candidateID: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ["male", "female", "other"],
        required: false
    },
    members: {
        type: [{
            firstName: String,
            lastName: String,
            age: String
        }],
        required: false
    },
    group: {
        type: Boolean,
        default: false
    },
    age: {
        type: String,
        required: false
    },
    descriptions: {
        type: String,
        required: true
    },
    candidateProfile: {
        type: String,
        required: true
    },
    document: {
        type: String,
        required: true
    },
    assignGroup: {
        type: Boolean,
        default: false
    },
    userId: {
        type: String,
        required: false
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
module.exports = mongoose.model('candidate', candidateSchema)