const express = require("express")
const asyncHandler = require("../../utils/asyncHandler")
const { AuthController } = require("../../controller/authController/auth.controller")
const { validateFormSchema } = require("../../middleware/formValidator")
const { signUpSchema, verifyEmailSchema, signInSchema } = require("../../formSchema/auth.schema")
const { bearerToken } = require("../../middleware/verifyAccessToken")
const upload = require('../../middleware/uploadFile')
const { trackDevice } = require("../../middleware/trackDevice")
const { checkPermission } = require("../../utils/checkPermission")
const { PERMISSION_FEATURE_COSNTANTS } = require("../../config/permissionConstant")
const authRouter = express.Router()

authRouter.post(
    "/signup",
    upload.single("identityDocument"),
    validateFormSchema(signUpSchema),
    asyncHandler(AuthController.signup)
)

authRouter.post(
    "/verify-email",
    validateFormSchema(verifyEmailSchema),
    asyncHandler(AuthController.verfiyEmail)
)

authRouter.post(
    '/sign-in',
    trackDevice,
    validateFormSchema(signInSchema),
    asyncHandler(AuthController.signIn)
)

authRouter.post(
    '/sign-out',
    bearerToken,
    asyncHandler(AuthController.signOut)
)

authRouter.post(
    '/security-question',
    asyncHandler(AuthController.securityQuestion)
)

authRouter.get(
    '/security-question',
    bearerToken,
    asyncHandler(AuthController.hasUserSecurityQuestion)
)


authRouter.post(
    '/security-question/add',
    bearerToken,
    asyncHandler(AuthController.addSecurityQuestion)
)

authRouter.post(
    '/feature',
    bearerToken,
    asyncHandler(AuthController.addFeatures)
)

authRouter.post(
    '/feature/permission',
    bearerToken,
    asyncHandler(AuthController.addPermission)
)

authRouter.post(
    '/user/permission',
    bearerToken,
    checkPermission({
        AND: [PERMISSION_FEATURE_COSNTANTS.UPDATE_USER_PERMISSION]
    }),
    asyncHandler(AuthController.addUserPermission)
)

authRouter.get(
    '/feature',
    bearerToken,
    asyncHandler(AuthController.getFetures)
)

authRouter.put(
    '/user/role/:userId',
    bearerToken,
    checkPermission({
        AND: [PERMISSION_FEATURE_COSNTANTS.UPDATE_USER_ROLE]
    }),
    asyncHandler(AuthController.updateUserRole)
)

authRouter.put(
    '/user/status/:userId',
    bearerToken,
    checkPermission({
        AND: [PERMISSION_FEATURE_COSNTANTS.UPDATE_USER_STATUS]
    }),
    asyncHandler(AuthController.updateUserStatus)
)

authRouter.get(
    '/user/',
    bearerToken,
    asyncHandler(AuthController.getAllUsers)
)

// // import users
// authRouter.post(
//     '/organisation/upload',
//     bearerToken,
//     upload.any(),
//     asyncHandler(AuthController.uploadOrganisationUsers)
// )

authRouter.get(
    '/user/permission',
    bearerToken,
    asyncHandler(AuthController.getUserPermissionFeatures)
)

authRouter.put(
    '/user/verify-details/:userId',
    bearerToken,
    asyncHandler(AuthController.verifyUserDetails)
)

authRouter.post(
    '/group',
    bearerToken,
    asyncHandler(AuthController.addGroup)
)

authRouter.post(
    '/group/permission',
    bearerToken,
    asyncHandler(AuthController.addGroupPermission)
)

module.exports = authRouter