const express = require("express")
const { bearerToken } = require("../../middleware/verifyAccessToken")
const asyncHandler = require("../../utils/asyncHandler")
const { validateFormSchema } = require("../../middleware/formValidator")
const { electionSchema } = require("../../formSchema/election.Schema")
const { ElectionController } = require("../../controller/adminControllers/election.controller")

const electionRouter = express.Router()

electionRouter.post(
    "/",
    bearerToken,
    validateFormSchema(electionSchema),
    asyncHandler(ElectionController.createElection)
)

electionRouter.get(
    "/",
    bearerToken,
    asyncHandler(ElectionController.viewElection)
)

electionRouter.put(
    "/:id",
    bearerToken,
    asyncHandler(ElectionController.updateElection)
)

electionRouter.delete(
    "/:id",
    bearerToken,
    asyncHandler(ElectionController.deleteElection)
)

module.exports = electionRouter