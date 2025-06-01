let initialState = {
    dashboardList: [],
    isLoading: false,
    error: null
}

export const dashboardReducer = (state = initialState, action) => {
    switch (action.type) {
        case "VIEW_DASHBOARD_ATTEMPT":
            return {
                ...state,
                isLoading: true,
                error: null
            }
        case "VIEW_DASHBOARD_SUCCESS":
            return {
                ...state,
                isLoading: false,
                dashboardList: action.payload,
                error: null
            }
        case "VIEW_DASHBOARD_FAILURE":
            return {
                ...state,
                isLoading: false,
                error: action.payload
            }
        default:
            return state
    }
}