const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema

const assignCandidateGroupSchema = new mongoose.Schema({
    candidateId: {
        type: ObjectId,
        ref: 'candidate',
        unique: true,
        required: true
    },
    groupId: {
        type: ObjectId,
        ref: 'group',
        unique: true,
        required: true
    }
})
module.exports = mongoose.model('assign_candidate_group', assignCandidateGroupSchema)