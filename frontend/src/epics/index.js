import { combineEpics } from "redux-observable";
import { addSecurityQuestionEpic, adminLoginEpic, checkSecurityQuestionEpic, hasUserSecurityQuestionEpic, userRegisterEpic, userVerifyEmailEpic } from "../features/auth/epics/authEpic";
import { addElectionEpic, deleteElectionEpic, editElectionEpic, getElectionListEpic } from "../features/elections/epics/electionEpics";
import { addCandidateListEpic, deleteCandidateListEpic, editCandidateListEpic, getCandidateListEpic } from "../features/candidates/epics/candidateEpics";
import { addGroupAssignCandidateEpic, addGroupEpic, deleteGroupEpic, editGroupEpic, getGroupAssignCandidateEpic, getGroupListEpic } from "../features/groups/epics/groupEpics";
import { addUserFeaturePermissionEpic, getFeaturePermissionListEpic, getUserListEpic, updateUserRoleEpic, updateUserStatusEpic, uploadOrganisationUsersEpic } from "../features/users/epics/userEpics";

export const rootEpic = combineEpics(
    adminLoginEpic,
    checkSecurityQuestionEpic,
    hasUserSecurityQuestionEpic,
    addSecurityQuestionEpic,
    userRegisterEpic,
    userVerifyEmailEpic,

    getElectionListEpic,
    addElectionEpic,
    deleteElectionEpic,
    editElectionEpic,

    addCandidateListEpic,
    getCandidateListEpic,
    deleteCandidateListEpic,
    editCandidateListEpic,

    getGroupListEpic,
    deleteGroupEpic,
    addGroupEpic,
    editGroupEpic,
    getGroupAssignCandidateEpic,
    addGroupAssignCandidateEpic,

    getUserListEpic,
    updateUserRoleEpic,
    updateUserStatusEpic,
    getFeaturePermissionListEpic,
    addUserFeaturePermissionEpic,
    uploadOrganisationUsersEpic
)

