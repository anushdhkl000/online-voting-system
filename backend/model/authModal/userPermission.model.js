const mongoose = require("mongoose")
const { ObjectId } = mongoose.Schema

const userPermissionSchema = new mongoose.Schema({
    permissionId: {
        type: ObjectId,
        ref: 'permission',
        required: true
    },
    userId: {
        type: ObjectId,
        ref: 'user',
        required: true
    }

})

module.exports = mongoose.model("userPermission", userPermissionSchema)