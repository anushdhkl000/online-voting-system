const express = require("express")
const { bearerToken } = require("../../middleware/verifyAccessToken")
const asyncHandler = require("../../utils/asyncHandler")
const { validateFormSchema } = require("../../middleware/formValidator")
const { candidateSchema } = require("../../formSchema/candidate.schema")
const { candidateController } = require("../../controller/adminControllers/candidate.controller")
const upload = require('../../middleware/uploadFile')

const candidateRouter = express.Router()

candidateRouter.post(
    "/",
    bearerToken,
    upload.fields([
        { name: "document", maxCount: 1 },
        { name: "candidateProfile", maxCount: 1 }
    ]),
    asyncHandler(candidateController.createCandidate)
)

candidateRouter.get(
    "/",
    bearerToken,
    asyncHandler(candidateController.viewCandidate)
)

candidateRouter.put(
    "/:id",
    bearerToken,
    upload.fields([
        { name: "document", maxCount: 1 },
        { name: "candidateProfile", maxCount: 1 }
    ]),
    asyncHandler(candidateController.updateCandidate)
)

candidateRouter.delete(
    "/:id",
    bearerToken,
    asyncHandler(candidateController.deleteCandidate)
)

module.exports = candidateRouter