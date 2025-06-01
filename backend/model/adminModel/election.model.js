const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema

const electionSchema = new mongoose.Schema({
    title: {
        type: String,
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
    },
    // positionId: {
    //     type: ObjectId,
    //     ref: 'assign_election_position',
    //     required: true
    // },
    orgId: {
        type: ObjectId,
        ref: 'organisation',
        required: false
    }

})
module.exports = mongoose.model('election', electionSchema)