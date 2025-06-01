import { catchError, mergeMap } from "rxjs/operators";
import { from, of } from "rxjs";
import { ofType } from "redux-observable";

import Api from "../../../../helpers/BaseUrlProvider";
const api = new Api();

export const getOrganiationListEpic = (action$) =>
    action$.pipe(
        ofType("VIEW_ORGANISATION_LIST_ATTEMPT"),
        mergeMap((action) =>
            from(api.hitApi("/organisation", action.payload, "GET")).pipe(
                mergeMap((response) => {
                    if (action.cb) action.cb(null, response?.data);
                    return of({
                        type: "VIEW_ORGANISATION_LIST_SUCCESS",
                        payload: response.data
                    });
                }),
                catchError((err) => {
                    if (action.cb) action.cb(err);
                    return of({
                        type: "VIEW_ORGANISATION_LIST_FAILURE",
                        payload: err.response
                    });
                })
            )
        )
    );

export const addOrganiationListEpic = (action$) =>
    action$.pipe(
        ofType("ADD_ORGANISATION_ATTEMPT"),
        mergeMap((action) =>
            from(api.hitApi("/organisation", action.payload, "POST")).pipe(
                mergeMap((response) => {
                    if (action.cb) action.cb(null, response?.data);
                    return of({
                        type: "ADD_ORGANISATION_SUCCESS",
                        payload: response.data
                    },
                        {
                            type: "VIEW_ORGANISATION_LIST_ATTEMPT",
                            payload: action.filters
                        }
                    );
                }),
                catchError((err) => {
                    if (action.cb) action.cb(err);
                    return of({
                        type: "ADD_ORGANISATION_FAILURE",
                        payload: err.response
                    });
                })
            )
        )
    );

export const updateOrganiationListEpic = (action$) =>
    action$.pipe(
        ofType("UPDATE_ORGANISATION_ATTEMPT"),
        mergeMap((action) =>
            from(api.hitApi(`/organisation/${action.orgId}`, action.payload, "PUT")).pipe(
                mergeMap((response) => {
                    if (action.cb) action.cb(null, response?.data);
                    return of({
                        type: "UPDATE_ORGANISATION_SUCCESS",
                        payload: response.data
                    },
                        {
                            type: "VIEW_ORGANISATION_LIST_ATTEMPT",
                            payload: action.filters
                        }
                    );
                }),
                catchError((err) => {
                    if (action.cb) action.cb(err);
                    return of({
                        type: "UPDATE_ORGANISATION_FAILURE",
                        payload: err.response
                    });
                })
            )
        )
    );

export const deleteOrganiationListEpic = (action$) =>
    action$.pipe(
        ofType("REMOVE_ORGANISATION_ATTEMPT"),
        mergeMap((action) =>
            from(api.hitApi(`/organisation/${action.orgId}`, {}, "DELETE")).pipe(
                mergeMap((response) => {
                    if (action.cb) action.cb(null, response?.data);
                    return of({
                        type: "REMOVE_ORGANISATION_SUCCESS",
                        payload: response.data
                    },
                        {
                            type: "VIEW_ORGANISATION_LIST_ATTEMPT",
                            payload: action.filters
                        }
                    );
                }),
                catchError((err) => {
                    if (action.cb) action.cb(err);
                    return of({
                        type: "REMOVE_ORGANISATION_FAILURE",
                        payload: err.response
                    });
                })
            )
        )
    );
