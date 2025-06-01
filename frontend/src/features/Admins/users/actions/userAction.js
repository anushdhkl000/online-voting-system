export const viewUserList = (payload, cb = () => { }) => {
    return {
        type: "VIEW_USER_LIST_ATTEMPT",
        payload,
        cb
    }
}


export const updateUserRole = (payload, cb = () => { }) => {
    return {
        type: "UPDATE_USER_ROLE_ATTEMPT",
        userId: payload.userId,
        role: payload.role,
        filters: payload.filters,
        cb
    }
}

export const updateUserStatus = (payload, cb = () => { }) => {
    return {
        type: "UPDATE_USER_STATUS_ATTEMPT",
        userId: payload.userId,
        status: payload.status,
        filters: payload.filters,
        cb
    }
}

export const viewFeaturePermissionList = (payload, cb = () => { }) => {
    return {
        type: "VIEW_FEATURE_PERMISSION_LIST_ATTEMPT",
        payload,
        cb
    }
}

export const addUserFeaturePermission = (payload, cb = () => { }) => {
    return {
        type: "ADD_USER_FEATURE_PERMISSION_ATTEMPT",
        payload,
        cb
    }
}

export const uploadOrganisationUsers = (formData, cb = () => { }) => {
    return {
        type: "UPLOAD_ORGANISATION_USERS_ATTEMPT",
        formData,
        cb
    }
}

export const verifyUserDetails = (payload, cb = () => { }) => {
    return {
        type: "VERIFY_USER_DETAILS_ATTEMPT",
        userId: payload.userId,
        verify: payload.verify,
        filters: payload.filters,
        cb
    }
}