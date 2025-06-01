const express = require("express")
const { bearerToken } = require("../../middleware/verifyAccessToken")
const asyncHandler = require("../../utils/asyncHandler")
const { GroupController } = require("../../controller/adminControllers/group.controller")
const { validateFormSchema } = require("../../middleware/formValidator")
const upload = require('../../middleware/uploadFile')
const { assignCandidateGroupSchema } = require("../../formSchema/group.schema")
const { checkPermission } = require("../../utils/checkPermission")
const { PERMISSION_FEATURE_COSNTANTS } = require("../../config/permissionConstant")

const groupRouter = express.Router()

groupRouter.post(
    "/",
    bearerToken,
    checkPermission({
        AND: [PERMISSION_FEATURE_COSNTANTS.ADD_GROUP]
    }),
    upload.fields([
        { name: "symbol", maxCount: 1 }
    ]),
    asyncHandler(GroupController.createGroup)
)

groupRouter.get(
    "/",
    bearerToken,
    checkPermission({
        AND: [PERMISSION_FEATURE_COSNTANTS.VIEW_GROUP]
    }),
    asyncHandler(GroupController.viewGroup)
)

groupRouter.put(
    "/:id",
    bearerToken,
    checkPermission({
        AND: [PERMISSION_FEATURE_COSNTANTS.EDIT_GROUP]
    }),
    upload.fields([
        { name: "symbol", maxCount: 1 }
    ]),
    asyncHandler(GroupController.updateGroup)
)

groupRouter.delete(
    "/:id",
    bearerToken,
    checkPermission({
        AND: [PERMISSION_FEATURE_COSNTANTS.DELETE_GROUP]
    }),
    asyncHandler(GroupController.deleteGroup)
)

groupRouter.post(
    "/assign",
    bearerToken,
    checkPermission({
        AND: [PERMISSION_FEATURE_COSNTANTS.ASSIGN_GROUP]
    }),
    validateFormSchema(assignCandidateGroupSchema),
    asyncHandler(GroupController.assignGroup)
)

groupRouter.get(
    "/assign/:groupId",
    bearerToken,
    asyncHandler(GroupController.getAssignCandidateGroup)
)


module.exports = groupRouter