let initialState = {
    groupList: {
        data: [],
        total: 0,
        hasNextPage: false,
        currentPage: 0
    },
    assignGroupCandidateList: {
        data: {}
    },
    isLoading: false,
    error: null
}

export const groupReducer = (state = initialState, action) => {
    switch (action.type) {
        case "VIEW_GROUP_LIST_ATTEMPT":
            return {
                ...state,
                isLoading: true,
                error: null
            }
        case "VIEW_GROUP_LIST_SUCCESS":
            return {
                ...state,
                isLoading: false,
                groupList: action.payload,
                error: null
            }
        case "VIEW_GROUP_LIST_FAILURE":
            return {
                ...state,
                isLoading: false,
                error: action.payload
            }
        case "GET_ASSIGN_GROUP_CANDIDATE_ATTEMPT":
            return {
                ...state,
                isLoading: true,
                error: null
            }
        case "GET_ASSIGN_GROUP_CANDIDATE_SUCCESS":
            return {
                ...state,
                isLoading: false,
                assignGroupCandidateList: {
                    data: action.payload
                },
                error: null
            }
        case "GET_ASSIGN_GROUP_CANDIDATE_FAILURE":
            return {
                ...state,
                isLoading: false,
                error: action.payload
            }
        default:
            return state
    }
}