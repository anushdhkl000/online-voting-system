const mongoose = require("mongoose")
const { ObjectId } = mongoose.Schema

const organisationSchema = new mongoose.Schema({
    organisation: {
        type: String,
        required: true,
        unique: true
    },
    organisationId: {
        type: String,
        required: true,
        unique: true
    }

})

module.exports = mongoose.model("organisation", organisationSchema)