import { combineReducers } from "redux";
import { electionReducer } from "../features/Admins/elections/reducers/electionReducers";
import { candidateReducer } from "../features/Admins/candidates/reducers/candidateReducers";
import { AuthReducer } from "../features/Admins/auth/reducers/authReducer";
import { groupReducer } from "../features/Admins/groups/reducers/groupReducers";
import { userReducer } from "../features/Admins/users/reducers/userReducer";
import { userLandingPageReducer } from "../features/Users/voting/reducers/userReducers";
import { dashboardReducer } from "../features/Admins/dashboard/reducers/dashboardReducers";
import { organisationReducer } from "../features/Admins/organisations/reducers/organisationReducers";

function lastActionDispatched(_state = null, action) {
    return action;
}
const allReducers = combineReducers({
    Auth: AuthReducer,
    elections: electionReducer,
    candidate: candidateReducer,
    group: groupReducer,
    users: userReducer,
    lastActionDispatched,
    landingPage: userLandingPageReducer,
    dashboard: dashboardReducer,
    organisation: organisationReducer
})

export default allReducers