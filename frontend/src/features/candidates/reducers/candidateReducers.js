let initialState = {
    candidateList: {
        data: [],
        total: 0,
        hasNextPage: false,
        currentPage: 0
    },
    isLoading: false,
    error: null
}

export const candidateReducer = (state = initialState, action) => {
    switch (action.type) {
        case "VIEW_CANDIDATE_LIST_ATTEMPT":
            return {
                ...state,
                isLoading: true,
                error: null
            }
        case "VIEW_CANDIDATE_LIST_SUCCESS":
            // eslint-disable-next-line no-case-declarations
            const shouldReplaceData = action.payload.currentPage === 1;

            return {
                ...state,
                isLoading: false,
                candidateList: {
                    data: shouldReplaceData
                        ? [...action.payload.data]
                        : [...state.candidateList.data, ...action.payload.data],
                    total: action.payload.total,
                    hasNextPage: action.payload.hasNextPage,
                    currentPage: action.payload.currentPage
                },
                error: null
            }
        case "VIEW_CANDIDATE_LIST_FAILURE":
            return {
                ...state,
                isLoading: false,
                error: action.payload
            }
        case "RESET_CANDIDATE_LIST":
            return {
                ...initialState
            }
        default:
            return state
    }
}