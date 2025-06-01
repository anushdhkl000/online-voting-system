import { combineEpics } from "redux-observable";
import { addSecurityQuestionEpic, adminLoginEpic, checkSecurityQuestionEpic, hasUserSecurityQuestionEpic, userRegisterEpic, userVerifyEmailEpic, viewOrganisationListEpic } from "../features/Admins/auth/epics/authEpic";
import { addElectionEpic, asssignElectionPositionsEpic, deleteElectionEpic, editElectionEpic, getElectionListEpic, viewAsssignElectionPositionsEpic } from "../features/Admins/elections/epics/electionEpics";
import { addCandidateListEpic, deleteCandidateListEpic, editCandidateListEpic, getCandidateListEpic } from "../features/Admins/candidates/epics/candidateEpics";
import { addGroupAssignCandidateEpic, addGroupEpic, deleteGroupEpic, editGroupEpic, getGroupAssignCandidateEpic, getGroupListEpic } from "../features/Admins/groups/epics/groupEpics";
import { addUserFeaturePermissionEpic, getFeaturePermissionListEpic, getUserListEpic, updateUserRoleEpic, updateUserStatusEpic, uploadOrganisationUsersEpic, verifyUserDetailsEpic } from "../features/Admins/users/epics/userEpics";

import { hasUserPermissionFeaturesEpic } from "./mainEpics";
import { castingVoteEpic, generateVotingTokenEpic, getUserElectionCandidatesEpic, getUserElectionPositionsEpic, getUserElectionResultsEpic, getUserElectionsEpic, getUserLandingPageEpic, trackYourVoteResultsEpic } from "../features/Users/voting/epics/userEpics";
import { dashboardEpic } from "../features/Admins/dashboard/epics/dashboardEpics";
import { addOrganiationListEpic, deleteOrganiationListEpic, getOrganiationListEpic, updateOrganiationListEpic } from "../features/Admins/organisations/epics/organisationEpics";

export const rootEpic = combineEpics(
    hasUserPermissionFeaturesEpic,
    adminLoginEpic,
    checkSecurityQuestionEpic,
    hasUserSecurityQuestionEpic,
    addSecurityQuestionEpic,
    userRegisterEpic,
    userVerifyEmailEpic,
    verifyUserDetailsEpic,

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
    uploadOrganisationUsersEpic,

    getUserLandingPageEpic,
    getUserElectionsEpic,
    getUserElectionCandidatesEpic,
    castingVoteEpic,
    generateVotingTokenEpic,

    dashboardEpic,

    getOrganiationListEpic,
    addOrganiationListEpic,
    updateOrganiationListEpic,
    deleteOrganiationListEpic,
    viewOrganisationListEpic,

    asssignElectionPositionsEpic,
    viewAsssignElectionPositionsEpic,
    getUserElectionPositionsEpic,
    getUserElectionResultsEpic,
    trackYourVoteResultsEpic
)

