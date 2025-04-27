import { catchError, mergeMap } from "rxjs/operators";
import { from, of } from "rxjs";
import { ofType } from "redux-observable";

import Api from "../../../helpers/BaseUrlProvider";
const api = new Api();

export const getElectionListEpic = (action$) =>
    action$.pipe(
        ofType("VIEW_ELECTION_LIST_ATTEMPT"),
        mergeMap((action) =>
            from(api.hitApi("/election", action.payload, "GET")).pipe(
                mergeMap((response) => {
                    if (action.cb) action.cb(null, response?.data);
                    return of({
                        type: "VIEW_ELECTION_LIST_SUCCESS",
                        payload: response.data
                    });
                }),
                catchError((err) => {
                    if (action.cb) action.cb(err);
                    return of({
                        type: "VIEW_ELECTION_LIST_FAILURE",
                        payload: err.response
                    });
                })
            )
        )
    );

export const addElectionEpic = (action$) =>
    action$.pipe(
        ofType("ADD_ELECTION_ATTEMPT"),
        mergeMap((action) =>
            from(api.hitApi("/election", action.payload, "POST")).pipe(
                mergeMap((response) => {
                    if (action.cb) action.cb(null, response?.data);
                    return of({
                        type: "ADD_ELECTION_SUCCESS",
                        payload: response.data
                    },
                        {
                            type: "VIEW_ELECTION_LIST_ATTEMPT"
                        });
                }),
                catchError((err) => {
                    if (action.cb) action.cb(err);
                    return of({
                        type: "ADD_ELECTION_FAILURE",
                        payload: err.response
                    });
                })
            )
        )
    );

export const deleteElectionEpic = (action$) =>
    action$.pipe(
        ofType("DELETE_ELECTION_ATTEMPT"),
        mergeMap((action) =>
            from(api.hitApi(`/election/${action.payload.id}`, {}, "DELETE")).pipe(
                mergeMap((response) => {
                    if (action.cb) action.cb(null, response?.data);
                    return of({
                        type: "DELETE_ELECTION_SUCCESS",
                        payload: response.data
                    }, {
                        type: "VIEW_ELECTION_LIST_ATTEMPT"
                    });
                }),
                catchError((err) => {
                    if (action.cb) action.cb(err);
                    return of({
                        type: "DELETE_ELECTION_FAILURE",
                        payload: err.response
                    });
                })
            )
        )
    );


export const editElectionEpic = (action$) =>
    action$.pipe(
        ofType("EDIT_ELECTION_ATTEMPT"),
        mergeMap((action) =>
            from(api.hitApi(`/election/${action.payload.id}`, action.payload, "PUT")).pipe(
                mergeMap((response) => {
                    if (action.cb) action.cb(null, response?.data);
                    return of({
                        type: "EDIT_ELECTION_SUCCESS",
                        payload: response.data
                    }, {
                        type: "VIEW_ELECTION_LIST_ATTEMPT"
                    });
                }),
                catchError((err) => {
                    if (action.cb) action.cb(err);
                    return of({
                        type: "EDIT_ELECTION_FAILURE",
                        payload: err.response
                    });
                })
            )
        )
    );