export const loginUser = (payload, cb = () => { }) => {
    return {
        type: "ADMIN_LOGIN_ATTEMPT",
        payload,
        cb
    }
}

export const checkSecurityQuestion = (payload, cb = () => { }) => {
    return {
        type: "CHECK_SECURITY_QUESTION",
        payload,
        cb
    }
}

export const hasUserAddedSecurityQuestion = (payload, cb = () => { }) => {
    return {
        type: "HAS_USER_SECURITY_QUESTION",
        payload,
        cb
    }
}

export const addedSecurityQuestion = (payload, cb = () => { }) => {
    return {
        type: "ADD_SECURITY_QUESTION",
        payload,
        cb
    }
}

export const registerUser = (payload, cb = () => { }) => {
    return {
        type: "USER_REGISTER_ATTEMPT",
        payload,
        cb
    }
}

export const verifyUserEmail = (payload, cb = () => { }) => {
    return {
        type: "VERIFY_USER_EMAIL",
        payload,
        cb
    }
}
