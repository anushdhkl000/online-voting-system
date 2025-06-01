import { catchError, mergeMap } from "rxjs/operators";
import { from, of } from "rxjs";
import { ofType } from "redux-observable";

import Api from "../../../../helpers/BaseUrlProvider";
const api = new Api();

export const getUserLandingPageEpic = (action$) =>
    action$.pipe(
        ofType("VIEW_LANDING_PAGE_ATTEMPT"),
        mergeMap((action) =>
            from(api.hitApi("/user/", {}, "GET")).pipe(
                mergeMap((response) => {
                    if (action.cb) action.cb(null, response?.data);
                    return of({
                        type: "VIEW_LANDING_PAGE_SUCCESS",
                        payload: response.data
                    });
                }),
                catchError((err) => {
                    if (action.cb) action.cb(err);
                    return of({
                        type: "VIEW_LANDING_PAGE_FAILURE",
                        payload: err.response
                    });
                })
            )
        )
    );


export const getUserElectionsEpic = (action$) =>
    action$.pipe(
        ofType("VIEW_USER_ELECTION_LIST_ATTEMPT"),
        mergeMap((action) =>
            from(api.hitApi("/user/elections", {}, "GET")).pipe(
                mergeMap((response) => {
                    if (action.cb) action.cb(null, response?.data);
                    return of({
                        type: "VIEW_USER_ELECTION_LIST_SUCCESS",
                        payload: response.data
                    });
                }),
                catchError((err) => {
                    if (action.cb) action.cb(err);
                    return of({
                        type: "VIEW_USER_ELECTION_LIST_FAILURE",
                        payload: err.response
                    });
                })
            )
        )
    );


export const getUserElectionCandidatesEpic = (action$) =>
    action$.pipe(
        ofType("VIEW_USER_ELECTION_CANDIDATE_LIST_ATTEMPT"),
        mergeMap((action) =>
            from(api.hitApi(`/user/candidate/${action.electionId}`, { positionId: action.positionId }, "GET")).pipe(
                mergeMap((response) => {
                    if (action.cb) action.cb(null, response?.data);
                    return of({
                        type: "VIEW_USER_ELECTION_CANDIDATE_LIST_SUCCESS",
                        payload: response.data
                    });
                }),
                catchError((err) => {
                    if (action.cb) action.cb(err);
                    return of({
                        type: "VIEW_USER_ELECTION_CANDIDATE_LIST_FAILURE",
                        payload: err.response
                    });
                })
            )
        )
    );

export const castingVoteEpic = (action$) =>
    action$.pipe(
        ofType("CASTING_VOTE_ATTEMPT"),
        mergeMap((action) =>
            from(api.hitApi(`/user/election/vote`, action.payload, "POST")).pipe(
                mergeMap((response) => {
                    if (action.cb) action.cb(null, response?.data);
                    return of({
                        type: "CASTING_VOTE_SUCCESS",
                        payload: response.data
                    });
                }),
                catchError((err) => {
                    if (action.cb) action.cb(err?.response?.data);
                    return of({
                        type: "CASTING_VOTE_FAILURE",
                        payload: err.response
                    });
                })
            )
        )
    );

export const generateVotingTokenEpic = (action$) =>
    action$.pipe(
        ofType("GENERATE_VOTING_TOKEN_ATTEMPT"),
        mergeMap((action) =>
            from(api.hitApi(`/user/election/vote/token`, action.payload, "POST")).pipe(
                mergeMap((response) => {
                    if (action.cb) action.cb(null, response?.data);
                    return of({
                        type: "GENERATE_VOTING_TOKEN_SUCCESS",
                        payload: response.data
                    });
                }),
                catchError((err) => {
                    if (action.cb) action.cb(err?.response?.data, null);
                    return of({
                        type: "GENERATE_VOTING_TOKEN_FAILURE",
                        payload: err.response
                    });
                })
            )
        )
    );

export const getUserElectionPositionsEpic = (action$) =>
    action$.pipe(
        ofType("VIEW_USER_ELECTION_POSITION_LIST_ATTEMPT"),
        mergeMap((action) =>
            from(api.hitApi(`/election/${action.electionId}/positions`, {}, "GET")).pipe(
                mergeMap((response) => {
                    if (action.cb) action.cb(null, response?.data);
                    return of({
                        type: "VIEW_USER_ELECTION_POSITION_LIST_SUCCESS",
                        payload: response.data
                    });
                }),
                catchError((err) => {
                    if (action.cb) action.cb(err);
                    return of({
                        type: "VIEW_USER_ELECTION_POSITION_LIST_FAILURE",
                        payload: err.response
                    });
                })
            )
        )
    );

export const getUserElectionResultsEpic = (action$) =>
    action$.pipe(
        ofType("VIEW_USER_ELECTION_RESULTS_ATTEMPT"),
        mergeMap((action) =>
            from(api.hitApi(`/user/election/results`, {}, "GET")).pipe(
                mergeMap((response) => {
                    if (action.cb) action.cb(null, response?.data);
                    return of({
                        type: "VIEW_USER_ELECTION_RESULTS_SUCCESS",
                        payload: response.data
                    });
                }),
                catchError((err) => {
                    if (action.cb) action.cb(err);
                    return of({
                        type: "VIEW_USER_ELECTION_RESULTS_FAILURE",
                        payload: err.response
                    });
                })
            )
        )
    );

export const trackYourVoteResultsEpic = (action$) =>
    action$.pipe(
        ofType("VIEW_USER_TRACK_YOUR_VOTE_RESULTS_ATTEMPT"),
        mergeMap((action) =>
            from(api.hitApi(`/user/election/track-vote`, action.payload, "POST")).pipe(
                mergeMap((response) => {
                    if (action.cb) action.cb(null, response?.data);
                    return of({
                        type: "VIEW_USER_TRACK_YOUR_VOTE_RESULTS_SUCCESS",
                        payload: response.data
                    });
                }),
                catchError((err) => {
                    if (action.cb) action.cb(err);
                    return of({
                        type: "VIEW_USER_TRACK_YOUR_VOTE_RESULTS_FAILURE",
                        payload: err.response
                    });
                })
            )
        )
    );