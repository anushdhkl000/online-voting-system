const express = require("express")
const authRouter = require("./auth.route")
const electionRouter = require("./election.route")
const candidateRouter = require("./candidate.route")
const groupRouter = require("./group.route")
const userRouter = require("./user.route")
const dashboardRouter = require("./dashboard.route")
const organisationRouter = require("./organisation.route")
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

indexRouter.use(
    "/user",
    userRouter
)

indexRouter.use(
    "/dashboard",
    dashboardRouter
)

indexRouter.use(
    "/organisation",
    organisationRouter
)


module.exports = indexRouter