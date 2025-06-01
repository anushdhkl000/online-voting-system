const express = require("express")
const { bearerToken } = require("../../middleware/verifyAccessToken")
const asyncHandler = require("../../utils/asyncHandler")
const { validateFormSchema } = require("../../middleware/formValidator")
const { candidateSchema } = require("../../formSchema/candidate.schema")
const { candidateController } = require("../../controller/adminControllers/candidate.controller")
const upload = require('../../middleware/uploadFile')
const { checkPermission } = require("../../utils/checkPermission")
const { PERMISSION_FEATURE_COSNTANTS } = require("../../config/permissionConstant")

const candidateRouter = express.Router()

candidateRouter.post(
    "/",
    bearerToken,
    upload.fields([
        { name: "document", maxCount: 1 },
        { name: "candidateProfile", maxCount: 1 }
    ]),
    checkPermission({
        AND: [PERMISSION_FEATURE_COSNTANTS.ADD_CANDIDATE]
    }),
    asyncHandler(candidateController.createCandidate)
)

candidateRouter.get(
    "/",
    bearerToken,
    checkPermission({
        AND: [PERMISSION_FEATURE_COSNTANTS.VIEW_CANDIDATE]
    }),
    asyncHandler(candidateController.viewCandidate)
)

candidateRouter.put(
    "/:id",
    bearerToken,
    upload.fields([
        { name: "document", maxCount: 1 },
        { name: "candidateProfile", maxCount: 1 }
    ]),
    checkPermission({
        AND: [PERMISSION_FEATURE_COSNTANTS.EDIT_CANDIDATE]
    }),
    asyncHandler(candidateController.updateCandidate)
)

candidateRouter.delete(
    "/:id",
    bearerToken,
    checkPermission({
        AND: [PERMISSION_FEATURE_COSNTANTS.DELETE_CANDIDATE]
    }),
    asyncHandler(candidateController.deleteCandidate)
)

module.exports = candidateRouter