const mongoose = require("mongoose")


const parentSchema = new mongoose.Schema({
    parent: {
        type: String,
        required: true,
        unique: true
    },

})

module.exports = mongoose.model("featureParent", parentSchema)