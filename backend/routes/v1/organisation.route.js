const express = require("express")
const { bearerToken } = require("../../middleware/verifyAccessToken")
const asyncHandler = require("../../utils/asyncHandler")
const { OrganisationController } = require("../../controller/adminControllers/organisation.controller")
const { checkPermission } = require("../../utils/checkPermission")
const { PERMISSION_FEATURE_COSNTANTS } = require("../../config/permissionConstant")

const organisationRouter = express.Router()

organisationRouter.post("/",
    bearerToken,
    checkPermission({
        AND: [PERMISSION_FEATURE_COSNTANTS.ADD_ORGANISATION]
    }),
    asyncHandler(OrganisationController.addOrganisation)
)

organisationRouter.put("/:organisationId",
    bearerToken,
    checkPermission({
        AND: [PERMISSION_FEATURE_COSNTANTS.EDIT_ORGANISATION]
    }),
    asyncHandler(OrganisationController.updateOrganisation)
)

organisationRouter.delete("/:organisationId",
    bearerToken,
    checkPermission({
        AND: [PERMISSION_FEATURE_COSNTANTS.DELETE_ORGANISATION]
    }),
    asyncHandler(OrganisationController.deleteOrganisation)
)

organisationRouter.get("/",
    bearerToken,
    checkPermission({
        AND: [PERMISSION_FEATURE_COSNTANTS.VIEW_ORGANISATION]
    }),
    asyncHandler(OrganisationController.getAllOrganisation)
)

organisationRouter.get("/view",
    asyncHandler(OrganisationController.viewOrganisation)
)


module.exports = organisationRouter