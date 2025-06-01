export const getUserPermissionFeatures = (cb = () => { }) => {
    return {
        type: "GET_USER_PERMISSION_FEATURES",
        cb
    }
}
