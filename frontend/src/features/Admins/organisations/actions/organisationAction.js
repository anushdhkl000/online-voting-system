export const getOrganisations = (payload, cb = () => { }) => {
    return {
        type: "VIEW_ORGANISATION_LIST_ATTEMPT",
        payload,
        cb
    }
}

export const addOrganisations = (payload, filters, cb = () => { }) => {
    return {
        type: "ADD_ORGANISATION_ATTEMPT",
        payload,
        filters,
        cb
    }
}

export const updateOrganisations = (payload, selectedValue, filters, cb = () => { }) => {
    return {
        type: "UPDATE_ORGANISATION_ATTEMPT",
        payload,
        orgId: selectedValue,
        filters,
        cb
    }
}

export const removeOrganisations = (selectedValue, filters, cb = () => { }) => {
    return {
        type: "REMOVE_ORGANISATION_ATTEMPT",
        orgId: selectedValue,
        filters,
        cb
    }
}