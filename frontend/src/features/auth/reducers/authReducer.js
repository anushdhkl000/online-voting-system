let initialState = {
    AuthDetails: {
        hasSecurityQuestion: false,
    }
}

export const AuthReducer = (state = initialState, action) => {
    switch (action.type) {
        case "HAS_USER_SECURITY_QUESTION":
            return {
                ...state
            }
        case "HAS_USER_SECURITY_QUESTION_SUCCESS":
            return {
                ...state,
                AuthDetails: action.payload
            }
        case "HAS_USER_SECURITY_QUESTION_FAILURE":
            return {
                ...state
            }
        default:
            return state
    }
}