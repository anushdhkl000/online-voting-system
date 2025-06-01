let initialState = {
    electionList: [],
    electionPositionList: [],
    isLoading: false,
    error: null
}

export const electionReducer = (state = initialState, action) => {
    switch (action.type) {
        case "VIEW_ELECTION_LIST_ATTEMPT":
            return {
                ...state,
                isLoading: true,
                error: null
            }
        case "VIEW_ELECTION_LIST_SUCCESS":
            return {
                ...state,
                isLoading: false,
                electionList: action.payload,
                error: null
            }
        case "VIEW_ELECTION_LIST_FAILURE":
            return {
                ...state,
                isLoading: false,
                error: action.payload
            }

        case "VIEW_ASSIGN_ELECTION_POSITIONS_ATTEMPT":
            return {
                ...state,
                isLoading: true,
                error: null
            }
        case "VIEW_ASSIGN_ELECTION_POSITIONS_SUCCESS":
            return {
                ...state,
                isLoading: false,
                electionPositionList: action.payload,
                error: null
            }
        case "VIEW_ASSIGN_ELECTION_POSITIONS_FAILURE":
            return {
                ...state,
                isLoading: false,
                error: action.payload
            }
        default:
            return state
    }
}