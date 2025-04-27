import { catchError, mergeMap } from "rxjs/operators";
import { from, of } from "rxjs";
import { ofType } from "redux-observable";

import Api from "../../../helpers/BaseUrlProvider";
const api = new Api();

export const getGroupListEpic = (action$) =>
    action$.pipe(
        ofType("VIEW_GROUP_LIST_ATTEMPT"),
        mergeMap((action) =>
            from(api.hitApi("/group", action.payload, "GET")).pipe(
                mergeMap((response) => {
                    if (action.cb) action.cb(null, response?.data);
                    return of({
                        type: "VIEW_GROUP_LIST_SUCCESS",
                        payload: response.data
                    });
                }),
                catchError((err) => {
                    if (action.cb) action.cb(err);
                    return of({
                        type: "VIEW_GROUP_LIST_FAILURE",
                        payload: err.response
                    });
                })
            )
        )
    );

export const deleteGroupEpic = (action$) =>
    action$.pipe(
        ofType("DELETE_GROUP_ATTEMPT"),
        mergeMap((action) =>
            from(api.hitApi(`/group/${action.groupId}`, {}, "DELETE")).pipe(
                mergeMap((response) => {
                    if (action.cb) action.cb(null, response?.data);
                    return of({
                        type: "DELETE_GROUP_SUCCESS",
                        payload: response.data
                    }, {
                        type: "VIEW_GROUP_LIST_ATTEMPT",
                        payload: action.payload
                    });
                }),
                catchError((err) => {
                    if (action.cb) action.cb(err);
                    return of({
                        type: "DELETE_GROUP_FAILURE",
                        payload: err.response
                    });
                })
            )
        )
    );

export const addGroupEpic = (action$) =>
    action$.pipe(
        ofType("ADD_GROUP_ATTEMPT"),
        mergeMap((action) =>
            from(api.hitApi("/group", action.formData, "POST", true)).pipe(
                mergeMap((response) => {
                    if (action.cb) action.cb(null, response?.data);
                    return of({
                        type: "ADD_GROUP_SUCCESS",
                        payload: response.data
                    },
                        {
                            type: "VIEW_GROUP_LIST_ATTEMPT",
                            payload: action.filters
                        });
                }),
                catchError((err) => {
                    if (action.cb) action.cb(err);
                    return of({
                        type: "ADD_GROUP__FAILURE",
                        payload: err.response
                    });
                })
            )
        )
    );

export const editGroupEpic = (action$) =>
    action$.pipe(
        ofType("EDIT_GROUP_ATTEMPT"),
        mergeMap((action) =>
            from(api.hitApi(`/group/${action.id}`, action.formData, "PUT", true)).pipe(
                mergeMap((response) => {
                    if (action.cb) action.cb(null, response?.data);
                    return of({
                        type: "EDIT_GROUP_SUCCESS",
                        payload: response.data
                    },
                        {
                            type: "VIEW_GROUP_LIST_ATTEMPT",
                            payload: action.filters
                        });
                }),
                catchError((err) => {
                    if (action.cb) action.cb(err);
                    return of({
                        type: "EDIT_GROUP_FAILURE",
                        payload: err.response
                    });
                })
            )
        )
    );

export const getGroupAssignCandidateEpic = (action$) =>
    action$.pipe(
        ofType("GET_ASSIGN_GROUP_CANDIDATE_ATTEMPT"),
        mergeMap((action) =>
            from(api.hitApi(`/group/assign/${action.groupId}`, {}, "GET")).pipe(
                mergeMap((response) => {
                    if (action.cb) action.cb(null, response?.data);
                    return of({
                        type: "GET_ASSIGN_GROUP_CANDIDATE_SUCCESS",
                        payload: response.data
                    });
                }),
                catchError((err) => {
                    if (action.cb) action.cb(err);
                    return of({
                        type: "GET_ASSIGN_GROUP_CANDIDATE_FAILURE",
                        payload: err.response
                    });
                })
            )
        )
    );

export const addGroupAssignCandidateEpic = (action$) =>
    action$.pipe(
        ofType("ADD_ASSIGN_GROUP_CANDIDATE_ATTEMPT"),
        mergeMap((action) =>
            from(api.hitApi(`/group/assign`, action.payload, "POST")).pipe(
                mergeMap((response) => {
                    if (action.cb) action.cb(null, response?.data);
                    return of({
                        type: "ADD_ASSIGN_GROUP_CANDIDATE_SUCCESS",
                        payload: response.data
                    }, {
                        type: "VIEW_CANDIDATE_LIST_ATTEMPT",
                        payload: action.filters
                    });
                }),
                catchError((err) => {
                    if (action.cb) action.cb(err);
                    return of({
                        type: "ADD_ASSIGN_GROUP_CANDIDATE_FAILURE",
                        payload: err.response
                    });
                })
            )
        )
    );