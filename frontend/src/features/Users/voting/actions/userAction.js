export const getAllLandingPage = (payload, cb = () => { }) => {
    return {
        type: "VIEW_LANDING_PAGE_ATTEMPT",
        payload,
        cb
    }
}


export const getAllElections = (payload, cb = () => { }) => {
    return {
        type: "VIEW_USER_ELECTION_LIST_ATTEMPT",
        payload,
        cb
    }
}

export const getAllElectionCandidates = (electionId, positionId, cb = () => { }) => {
    return {
        type: "VIEW_USER_ELECTION_CANDIDATE_LIST_ATTEMPT",
        electionId,
        positionId,
        cb
    }
}

export const castingVoteActions = (payload, cb = () => { }) => {
    return {
        type: "CASTING_VOTE_ATTEMPT",
        payload,
        cb
    }
}

export const generateVotingTokenActions = (payload, cb = () => { }) => {
    return {
        type: "GENERATE_VOTING_TOKEN_ATTEMPT",
        payload,
        cb
    }
}

export const getAllElectionPositions = (electionId, cb = () => { }) => {
    return {
        type: "VIEW_USER_ELECTION_POSITION_LIST_ATTEMPT",
        electionId,
        cb
    }
}

export const getAllElectionResults = (payload, cb = () => { }) => {
    return {
        type: "VIEW_USER_ELECTION_RESULTS_ATTEMPT",
        payload,
        cb
    }
}

export const trackYourVoteResults = (payload, cb = () => { }) => {
    return {
        type: "VIEW_USER_TRACK_YOUR_VOTE_RESULTS_ATTEMPT",
        payload,
        cb
    }
}