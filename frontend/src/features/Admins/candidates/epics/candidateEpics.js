import { catchError, mergeMap } from "rxjs/operators";
import { from, of } from "rxjs";
import { ofType } from "redux-observable";

import Api from "../../../../helpers/BaseUrlProvider";
const api = new Api();

export const getCandidateListEpic = (action$) =>
    action$.pipe(
        ofType("VIEW_CANDIDATE_LIST_ATTEMPT"),
        mergeMap((action) =>
            from(api.hitApi("/candidate", action.payload, "GET")).pipe(
                mergeMap((response) => {
                    if (action.cb) action.cb(null, response?.data);
                    return of({
                        type: "VIEW_CANDIDATE_LIST_SUCCESS",
                        payload: response.data
                    });
                }),
                catchError((err) => {
                    if (action.cb) action.cb(err);
                    return of({
                        type: "VIEW_CANDIDATE_LIST_FAILURE",
                        payload: err.response
                    });
                })
            )
        )
    );

export const addCandidateListEpic = (action$) =>
    action$.pipe(
        ofType("ADD_CANDIDATE_ATTEMPT"),
        mergeMap((action) =>
            from(api.hitApi("/candidate", action.formData, "POST", true)).pipe(
                mergeMap((response) => {
                    if (action.cb) action.cb(null, response?.data);
                    return of({
                        type: "ADD_CANDIDATE_SUCCESS",
                        payload: response.data
                    },
                        {
                            type: "VIEW_CANDIDATE_LIST_ATTEMPT",
                            payload: action.filters
                        });
                }),
                catchError((err) => {
                    if (action.cb) action.cb(err);
                    return of({
                        type: "ADD_CANDIDATE_FAILURE",
                        payload: err.response
                    });
                })
            )
        )
    );

export const deleteCandidateListEpic = (action$) =>
    action$.pipe(
        ofType("DELETE_CANDIDATE_ATTEMPT"),
        mergeMap((action) =>
            from(api.hitApi(`/candidate/${action?.payload.id}`, {}, "DELETE")).pipe(
                mergeMap((response) => {
                    if (action.cb) action.cb(null);
                    return of({
                        type: "DELETE_CANDIDATE_SUCCESS",
                        payload: response.data
                    },
                        {
                            type: "VIEW_CANDIDATE_LIST_ATTEMPT",
                            payload: action.filters
                        });
                }),
                catchError((err) => {
                    if (action.cb) action.cb(true);
                    return of({
                        type: "DELETE_CANDIDATE_FAILURE",
                        payload: err.response
                    });
                })
            )
        )
    );


export const editCandidateListEpic = (action$) =>
    action$.pipe(
        ofType("EDIT_CANDIDATE_ATTEMPT"),
        mergeMap((action) =>
            from(api.hitApi(`/candidate/${action.id}`, action.formData, "PUT", true)).pipe(
                mergeMap((response) => {
                    if (action.cb) action.cb(null, response?.data);
                    return of({
                        type: "EDIT_CANDIDATE_SUCCESS",
                        payload: response.data
                    },
                        {
                            type: "VIEW_CANDIDATE_LIST_ATTEMPT",
                            payload: action.filters
                        });
                }),
                catchError((err) => {
                    if (action.cb) action.cb(err);
                    return of({
                        type: "EDIT_CANDIDATE_FAILURE",
                        payload: err.response
                    });
                })
            )
        )
    );
