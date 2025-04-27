import { combineReducers } from "redux";
import { electionReducer } from "../features/elections/reducers/electionReducers";
import { candidateReducer } from "../features/candidates/reducers/candidateReducers";
import { AuthReducer } from "../features/auth/reducers/authReducer";
import { groupReducer } from "../features/groups/reducers/groupReducers";
import { userReducer } from "../features/users/reducers/userReducer";

function lastActionDispatched(_state = null, action) {
    return action;
}
const allReducers = combineReducers({
    Auth: AuthReducer,
    elections: electionReducer,
    candidate: candidateReducer,
    group: groupReducer,
    users: userReducer,
    lastActionDispatched
})

export default allReducers