const express = require("express")
const { bearerToken } = require("../../middleware/verifyAccessToken")
const asyncHandler = require("../../utils/asyncHandler")
const { validateFormSchema } = require("../../middleware/formValidator")
const { electionSchema } = require("../../formSchema/election.Schema")
const { ElectionController } = require("../../controller/adminControllers/election.controller")
const { checkPermission } = require("../../utils/checkPermission")
const { PERMISSION_FEATURE_COSNTANTS } = require("../../config/permissionConstant")

const electionRouter = express.Router()

electionRouter.post(
    "/",
    bearerToken,
    checkPermission({
        AND: [PERMISSION_FEATURE_COSNTANTS.ADD_ELECTION]
    }),
    validateFormSchema(electionSchema),
    asyncHandler(ElectionController.createElection)
)

electionRouter.get(
    "/",
    bearerToken,
    checkPermission({
        AND: [PERMISSION_FEATURE_COSNTANTS.VIEW_ELECTION]
    }),
    asyncHandler(ElectionController.viewElection)
)

electionRouter.put(
    "/:id",
    bearerToken,
    checkPermission({
        AND: [PERMISSION_FEATURE_COSNTANTS.EDIT_ELECTION]
    }),
    asyncHandler(ElectionController.updateElection)
)

electionRouter.delete(
    "/:id",
    bearerToken,
    checkPermission({
        AND: [PERMISSION_FEATURE_COSNTANTS.DELETE_ELECTION]
    }),
    asyncHandler(ElectionController.deleteElection)
)

electionRouter.post(
    "/:electionId/assign-position",
    bearerToken,
    // checkPermission({
    //     AND: [PERMISSION_FEATURE_COSNTANTS.ASSIGN_POSITION]
    // }),
    asyncHandler(ElectionController.assignPosition)
)

electionRouter.get(
    "/:electionId/positions",
    bearerToken,
    asyncHandler(ElectionController.getElectionPositions)
)


module.exports = electionRouter