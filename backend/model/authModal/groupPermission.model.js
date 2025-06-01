const mongoose = require("mongoose")
const { ObjectId } = mongoose.Schema

const groupPermissionSchema = new mongoose.Schema({
    permissionId: {
        type: ObjectId,
        ref: 'permission',
        required: true
    },
    groupId: {
        type: ObjectId,
        ref: 'permisionGroup',
        required: true
    }

})

module.exports = mongoose.model("assignGroupPermission", groupPermissionSchema)