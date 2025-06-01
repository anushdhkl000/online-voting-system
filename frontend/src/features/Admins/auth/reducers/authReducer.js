let initialState = {
    AuthDetails: {
        hasSecurityQuestion: false,
    },
    userPermission: [],
    orginationList: []
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
        case "GET_USER_PERMISSION_FEATURES":
            return {
                ...state
            }
        case "GET_USER_PERMISSION_SUCCESS":
            return {
                ...state,
                userPermission: action.payload
            }
        case "GET_USER_PERMISSION_FAILURE":
            return {
                ...state
            }
        case "VIEW_ORGANISATION":
            return {
                ...state
            }
        case "VIEW_ORGANISATION_SUCCESS":
            return {
                ...state,
                orginationList: action.payload
            }
        case "VIEW_ORGANISATION_FAILURE":
            return {
                ...state
            }
        default:
            return state
    }
}