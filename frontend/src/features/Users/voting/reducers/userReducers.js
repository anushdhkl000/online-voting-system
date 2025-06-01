let initialState = {
    userLandingPageList: [],
    userElections: [],
    userElectionCandidates: [],
    positions: [],
    isLoading: false,
    error: null,
    electionResults: []
}

export const userLandingPageReducer = (state = initialState, action) => {
    switch (action.type) {
        case "VIEW_LANDING_PAGE_ATTEMPT":
            return {
                ...state,
                isLoading: true,
                error: null
            }
        case "VIEW_LANDING_PAGE_SUCCESS":
            return {
                ...state,
                isLoading: false,
                userLandingPageList: action.payload,
                error: null
            }
        case "VIEW_LANDING_PAGE_FAILURE":
            return {
                ...state,
                isLoading: false,
                error: action.payload
            }
        case "VIEW_USER_ELECTION_LIST_ATTEMPT":
            return {
                ...state,
                isLoading: true,
                error: null
            }
        case "VIEW_USER_ELECTION_LIST_SUCCESS":
            return {
                ...state,
                isLoading: false,
                userElections: action.payload,
                error: null
            }
        case "VIEW_USER_ELECTION_LIST_FAILURE":
            return {
                ...state,
                isLoading: false,
                error: action.payload
            }
        case "VIEW_USER_ELECTION_CANDIDATE_LIST_ATTEMPT":
            return {
                ...state,
                isLoading: true,
                error: null
            }
        case "VIEW_USER_ELECTION_CANDIDATE_LIST_SUCCESS":
            return {
                ...state,
                isLoading: false,
                userElectionCandidates: action.payload,
                error: null
            }
        case "VIEW_USER_ELECTION_CANDIDATE_LIST_FAILURE":
            return {
                ...state,
                isLoading: false,
                error: action.payload
            }
        case "VIEW_USER_ELECTION_POSITION_LIST_ATTEMPT":
            return {
                ...state,
                isLoading: true,
                error: null
            }
        case "VIEW_USER_ELECTION_POSITION_LIST_SUCCESS":
            return {
                ...state,
                isLoading: false,
                positions: action.payload,
                error: null
            }
        case "VIEW_USER_ELECTION_POSITION_LIST_FAILURE":
            return {
                ...state,
                isLoading: false,
                error: action.payload
            }
        case "VIEW_USER_ELECTION_RESULTS_ATTEMPT":
            return {
                ...state,
                isLoading: true,
                error: null
            }
        case "VIEW_USER_ELECTION_RESULTS_SUCCESS":
            return {
                ...state,
                isLoading: false,
                electionResults: action.payload,
                error: null
            }
        case "VIEW_USER_ELECTION_RESULTS_FAILURE":
            return {
                ...state,
                isLoading: false,
                error: action.payload
            }
        default:
            return state
    }
}