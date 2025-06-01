export const dashboardActions = (payload, cb = () => { }) => {
    return {
        type: "VIEW_DASHBOARD_ATTEMPT",
        payload,
        cb
    }
}