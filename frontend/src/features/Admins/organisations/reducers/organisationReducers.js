let initialState = {
    organisationList: [],
    isLoading: false,
    error: null
}

export const organisationReducer = (state = initialState, action) => {
    switch (action.type) {
        case "VIEW_ORGANISATION_LIST_ATTEMPT":
            return {
                ...state,
                isLoading: true,
                error: null
            }
        case "VIEW_ORGANISATION_LIST_SUCCESS":
            return {
                ...state,
                isLoading: false,
                organisationList: action.payload,
                error: null
            }
        case "VIEW_ORGANISATION_LIST_FAILURE":
            return {
                ...state,
                isLoading: false,
                error: action.payload
            }
        default:
            return state
    }
}