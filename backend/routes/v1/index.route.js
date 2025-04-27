const express = require("express")
const authRouter = require("./auth.route")
const electionRouter = require("./election.route")
const candidateRouter = require("./candidate.route")
const groupRouter = require("./group.route")
const indexRouter = express.Router()

indexRouter.use(
    "/auth",
    authRouter
)

indexRouter.use(
    "/election",
    electionRouter
)

indexRouter.use(
    "/candidate",
    candidateRouter
)

indexRouter.use(
    "/group",
    groupRouter
)


module.exports = indexRouter