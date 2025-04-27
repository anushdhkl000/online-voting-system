export const getElections = (payload, cb = () => { }) => {
    return {
        type: "VIEW_ELECTION_LIST_ATTEMPT",
        payload,
        cb
    }
}

export const addElections = (payload, cb = () => { }) => {
    return {
        type: "ADD_ELECTION_ATTEMPT",
        payload,
        cb
    }
}

export const deleteElections = (payload, cb = () => { }) => {
    return {
        type: "DELETE_ELECTION_ATTEMPT",
        payload,
        cb
    }
}


export const editElections = (payload, cb = () => { }) => {
    return {
        type: "EDIT_ELECTION_ATTEMPT",
        payload,
        cb
    }
}
