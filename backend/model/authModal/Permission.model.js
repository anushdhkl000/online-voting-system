const mongoose = require("mongoose")
const { ObjectId } = mongoose.Schema

const permissionSchema = new mongoose.Schema({
    permission: {
        type: String,
        required: true,
        unique: true
    },
    parentId: {
        type: ObjectId,
        ref: 'featureParent',
        required: true
    }

})

module.exports = mongoose.model("permission", permissionSchema)