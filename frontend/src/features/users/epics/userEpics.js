import { catchError, mergeMap } from "rxjs/operators";
import { from, of } from "rxjs";
import { ofType } from "redux-observable";

import Api from "../../../helpers/BaseUrlProvider";
const api = new Api();

export const getUserListEpic = (action$) =>
    action$.pipe(
        ofType("VIEW_USER_LIST_ATTEMPT"),
        mergeMap((action) =>
            from(api.hitApi("/auth/user", action.payload, "GET")).pipe(
                mergeMap((response) => {
                    if (action.cb) action.cb(null, response?.data);
                    return of({
                        type: "VIEW_USER_LIST_SUCCESS",
                        payload: response.data
                    });
                }),
                catchError((err) => {
                    if (action.cb) action.cb(err);
                    return of({
                        type: "VIEW_USER_LIST_FAILURE",
                        payload: err.response
                    });
                })
            )
        )
    );

export const updateUserRoleEpic = (action$) =>
    action$.pipe(
        ofType("UPDATE_USER_ROLE_ATTEMPT"),
        mergeMap((action) =>
            from(api.hitApi(`/auth/user/role/${action.userId}`, { role: action.role }, "PUT")).pipe(
                mergeMap((response) => {
                    if (action.cb) action.cb(null, response?.data);
                    return of({
                        type: "UPDATE_USER_ROLE_SUCCESS",
                        payload: response.data
                    },
                        {
                            type: "VIEW_USER_LIST_ATTEMPT",
                            payload: action.payload
                        });
                }),
                catchError((err) => {
                    if (action.cb) action.cb(err);
                    return of({
                        type: "UPDATE_USER_ROLE_FAILURE",
                        payload: err.response
                    });
                })
            )
        )
    );

export const updateUserStatusEpic = (action$) =>
    action$.pipe(
        ofType("UPDATE_USER_STATUS_ATTEMPT"),
        mergeMap((action) =>
            from(api.hitApi(`/auth/user/status/${action.userId}`, { status: action.status }, "PUT")).pipe(
                mergeMap((response) => {
                    if (action.cb) action.cb(null, response?.data);
                    return of({
                        type: "UPDATE_USER_STATUS_SUCCESS",
                        payload: response.data
                    },
                        {
                            type: "VIEW_USER_LIST_ATTEMPT",
                            payload: action.payload
                        });
                }),
                catchError((err) => {
                    if (action.cb) action.cb(err);
                    return of({
                        type: "UPDATE_USER_STATUS_FAILURE",
                        payload: err.response
                    });
                })
            )
        )
    );


export const getFeaturePermissionListEpic = (action$) =>
    action$.pipe(
        ofType("VIEW_FEATURE_PERMISSION_LIST_ATTEMPT"),
        mergeMap((action) =>
            from(api.hitApi("/auth/feature", action.payload, "GET")).pipe(
                mergeMap((response) => {
                    if (action.cb) action.cb(null, response?.data);
                    return of({
                        type: "VIEW_FEATURE_PERMISSION_LIST_SUCCESS",
                        payload: response.data
                    });
                }),
                catchError((err) => {
                    if (action.cb) action.cb(err);
                    return of({
                        type: "VIEW_FEATURE_PERMISSION_LIST_FAILURE",
                        payload: err.response
                    });
                })
            )
        )
    );

export const addUserFeaturePermissionEpic = (action$) =>
    action$.pipe(
        ofType("ADD_USER_FEATURE_PERMISSION_ATTEMPT"),
        mergeMap((action) =>
            from(api.hitApi("/auth/user/permission", action.payload, "POST")).pipe(
                mergeMap((response) => {
                    if (action.cb) action.cb(null, response?.data);
                    return of({
                        type: "ADD_USER_FEATURE_PERMISSION_SUCCESS",
                        payload: response.data
                    },
                        {
                            type: "VIEW_FEATURE_PERMISSION_LIST_ATTEMPT",
                            payload: action.payload.userId

                        });
                }),
                catchError((err) => {
                    if (action.cb) action.cb(err);
                    return of({
                        type: "ADD_USER_FEATURE_PERMISSION_FAILURE",
                        payload: err.response
                    });
                })
            )
        )
    );


export const uploadOrganisationUsersEpic = (action$) =>
    action$.pipe(
        ofType("UPLOAD_ORGANISATION_USERS_ATTEMPT"),
        mergeMap((action) =>
            from(api.hitApi("/auth/organisation/upload", action.formData, "POST", true)).pipe(
                mergeMap((response) => {
                    if (action.cb) action.cb(null, response?.data);
                    return of({
                        type: "UPLOAD_ORGANISATION_USERS_SUCCESS",
                        payload: response.data
                    });
                }),
                catchError((err) => {
                    if (action.cb) action.cb(err);
                    return of({
                        type: "UPLOAD_ORGANISATION_USERS_FAILURE",
                        payload: err.response
                    });
                })
            )
        )
    );