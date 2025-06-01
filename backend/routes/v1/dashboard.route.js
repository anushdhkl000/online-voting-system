const express = require("express")
const { bearerToken } = require("../../middleware/verifyAccessToken")
const asyncHandler = require("../../utils/asyncHandler")
const { DashboardController } = require("../../controller/adminControllers/dashboard.controller")
const { checkPermission } = require("../../utils/checkPermission")
const { PERMISSION_FEATURE_COSNTANTS } = require("../../config/permissionConstant")

const dashboardRouter = express.Router()

dashboardRouter.get(
    "/",
    bearerToken,
    checkPermission({
        AND: [PERMISSION_FEATURE_COSNTANTS.VIEW_DASHBOARD]
    }),
    asyncHandler(DashboardController.getDashboard)
)


module.exports = dashboardRouter