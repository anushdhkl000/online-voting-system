let initialState = {
    userList: [],
    featurePermissionList: [],
    isLoading: false,
    error: null
}

export const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case "VIEW_USER_LIST_ATTEMPT":
            return {
                ...state,
                isLoading: true,
                error: null
            }
        case "VIEW_USER_LIST_SUCCESS":
            return {
                ...state,
                isLoading: false,
                userList: action.payload,
                error: null
            }
        case "VIEW_USER_LIST_FAILURE":
            return {
                ...state,
                isLoading: false,
                error: action.payload
            }
        case "VIEW_FEATURE_PERMISSION_LIST_ATTEMPT":
            return {
                ...state,
                isLoading: true,
                error: null
            }
        case "VIEW_FEATURE_PERMISSION_LIST_SUCCESS":
            return {
                ...state,
                isLoading: false,
                featurePermissionList: action.payload,
                error: null
            }
        case "VIEW_FEATURE_PERMISSION_LIST_FAILURE":
            return {
                ...state,
                isLoading: false,
                error: action.payload
            }
        default:
            return state
    }
}