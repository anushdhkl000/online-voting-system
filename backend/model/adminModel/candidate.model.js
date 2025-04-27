const mongoose = require('mongoose')

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
            age: String
        }],
        required: false
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
    }

}, { timestamps: true })
module.exports = mongoose.model('candidate', candidateSchema)