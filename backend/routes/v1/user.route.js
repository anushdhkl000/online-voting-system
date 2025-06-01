const express = require("express")
const { bearerToken, publicToken } = require("../../middleware/verifyAccessToken")
const asyncHandler = require("../../utils/asyncHandler")
const { UserController } = require("../../controller/userController/user.controller")

const userRouter = express.Router()

userRouter.get(
    "/",
    publicToken,
    asyncHandler(UserController.getAll)
)

userRouter.get("/elections",
    publicToken,
    asyncHandler(UserController.getAllElection)
)

userRouter.get("/candidate/:electionId",
    asyncHandler(UserController.getCandidateByElectionId)
)

userRouter.post("/election/vote/token",
    bearerToken,
    asyncHandler(UserController.generateVotingToken)
)

userRouter.post("/election/vote",
    bearerToken,
    asyncHandler(UserController.castingVote)
)

userRouter.get("/election/results",
    bearerToken,
    asyncHandler(UserController.getAllElectionResults)
)

userRouter.post("/election/track-vote",
    bearerToken,
    asyncHandler(UserController.trackVote)
)

module.exports = userRouter