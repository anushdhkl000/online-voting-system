export const getAllGroups = (payload, cb = () => { }) => {
    return {
        type: "VIEW_GROUP_LIST_ATTEMPT",
        payload,
        cb
    }
}

export const deleteGroup = (groupId, payload, cb = () => { }) => {
    return {
        type: "DELETE_GROUP_ATTEMPT",
        groupId,
        payload,
        cb
    }
}

export const addGroup = (formData, filters, cb = () => { }) => {
    return {
        type: "ADD_GROUP_ATTEMPT",
        formData,
        filters,
        cb
    }
}

export const editGroup = (formData, id, filters, cb = () => { }) => {
    return {
        type: "EDIT_GROUP_ATTEMPT",
        formData,
        filters,
        id,
        cb
    }
}

export const addAssignGroupCandidate = (payload, filters, cb = () => { }) => {
    return {
        type: "ADD_ASSIGN_GROUP_CANDIDATE_ATTEMPT",
        payload,
        filters,
        cb
    }
}
