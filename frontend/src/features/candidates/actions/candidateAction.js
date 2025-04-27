export const getCandidates = (payload, cb = () => { }) => {
    return {
        type: "VIEW_CANDIDATE_LIST_ATTEMPT",
        payload,
        cb
    }
}

export const addCandidates = (formData, filters, cb = () => { }) => {
    return {
        type: "ADD_CANDIDATE_ATTEMPT",
        formData,
        filters,
        cb
    }
}


export const deleteCandidates = (payload, filters, cb = () => { }) => {
    return {
        type: "DELETE_CANDIDATE_ATTEMPT",
        payload,
        filters,
        cb
    }
}

export const editCandidates = (formData, id, filters, cb = () => { }) => {
    return {
        type: "EDIT_CANDIDATE_ATTEMPT",
        formData,
        id,
        filters,
        cb
    }
}

export const getAssignGroupCandidates = (groupId, cb = () => { }) => {
    return {
        type: "GET_ASSIGN_GROUP_CANDIDATE_ATTEMPT",
        groupId,
        cb
    }
}
