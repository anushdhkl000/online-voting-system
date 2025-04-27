const mongoose = require("mongoose")
const { ObjectId } = mongoose.Schema

const organisationUserSchema = new mongoose.Schema({
    user: {
        type: Object,
        required: true
    },
    orgId: {
        type: ObjectId,
        ref: 'organisation',
        required: true
    }

})

module.exports = mongoose.model("organisationUser", organisationUserSchema)