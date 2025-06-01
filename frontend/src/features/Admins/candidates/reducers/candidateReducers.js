/* eslint-disable no-case-declarations */
let initialState = {
    candidateList: {
        data: [],
        total: 0,
        hasNextPage: false,
        currentPage: 0,
        electionPosition: []
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
            // const shouldReplaceData = action.payload.currentPage === 1;

            // return {
            //     ...state,
            //     isLoading: false,
            //     candidateList: {
            //         data: shouldReplaceData
            //             ? [...action.payload.data]
            //             : [...state.candidateList.data, ...action.payload.data],
            //         total: action.payload.total,
            //         hasNextPage: action.payload.hasNextPage,
            //         currentPage: action.payload.currentPage
            //     },
            //     error: null
            // }
            const shouldReplaceData = action.payload.currentPage === 1 || action.payload.forceReplace;
            return {
                ...state,
                isLoading: false,
                candidateList: {
                    data: shouldReplaceData
                        ? action.payload.data // Directly use the new data
                        : [...state.candidateList.data, ...action.payload.data],
                    total: action.payload.total,
                    hasNextPage: action.payload.hasNextPage,
                    currentPage: action.payload.currentPage,
                    electionPosition: action.payload.electionPosition
                },
                error: null,
            };
        case "VIEW_CANDIDATE_LIST_FAILURE":
            return {
                ...state,
                isLoading: false,
                error: action.payload
            }
        case "RESET_CANDIDATE_LIST":
            return {
                ...state,
                candidateList: {
                    data: [],
                    total: 0,
                    hasNextPage: false,
                    currentPage: 1
                },
                isLoading: true
            }
        default:
            return state
    }
}