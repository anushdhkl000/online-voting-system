const userPermissionModel = require("../model/authModal/userPermission.model");
const User = require("../model/authModal/auth.model")

module.exports = {
    checkPermission: (
        permissionData = {},
        permissionName,
        passtoNextMiddlewareWithPermission = false
    ) => {
        return async (req, res, next) => {

            const { AND = [], OR = [] } = permissionData;

            const usersPermissions = await userPermissionModel.find({
                userId: req.userId
            }).populate('permissionId');

            const hasUser = await User.findById(req.userId);

            const checkIfUserHasFeaturePermission = (feature_name) => {
                return usersPermissions.some((permission) => {
                    return permission.permissionId.permission === feature_name;
                });
            };

            const satisfiesANDPermissions = AND.every((feature_name) => {
                return checkIfUserHasFeaturePermission(feature_name);
            });
            const satisfiesORPermissions = OR.some((feature_name) => {
                return checkIfUserHasFeaturePermission(feature_name);
            });

            if (passtoNextMiddlewareWithPermission) {
                req[permissionName] = satisfiesANDPermissions || satisfiesORPermissions;
                next();
            } else if (satisfiesANDPermissions || satisfiesORPermissions) {
                next();
            } else if (hasUser.role === "super-admin") {
                next()
            } else {
                return res.status(403).send({
                    message: "Permission Denied",
                    code: "PERMISSION_DENIED"
                });
            }
        };
    }
};