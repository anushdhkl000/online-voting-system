import { catchError, mergeMap } from "rxjs/operators";
import { from, of } from "rxjs";
import { ofType } from "redux-observable";
import Api from "../../../../helpers/BaseUrlProvider";
;
const api = new Api();

export const adminLoginEpic = (action$) =>
    action$.pipe(
        ofType("ADMIN_LOGIN_ATTEMPT"),
        mergeMap((action) =>
            from(api.hitApi("/auth/sign-in", action.payload, "POST")).pipe(
                mergeMap((response) => {
                    if (action.cb) action.cb(null, response?.data);
                    return of({
                        type: "ADMIN_LOGIN_SUCCESS",
                        payload: response.data
                    });
                }),
                catchError((err) => {
                    if (action.cb) action.cb(err.response, null);
                    return of({
                        type: "ADMIN_LOGIN_FAILURE",
                        payload: err.response
                    });
                })
            )
        )
    );

export const checkSecurityQuestionEpic = (action$) =>
    action$.pipe(
        ofType("CHECK_SECURITY_QUESTION"),
        mergeMap((action) =>
            from(api.hitApi("/auth/security-question", action.payload, "POST")).pipe(
                mergeMap((response) => {
                    if (action.cb) action.cb(null, response?.data);
                    return of({
                        type: "CHECK_SECURITY_QUESTION_SUCCESS",
                        payload: response.data
                    });
                }),
                catchError((err) => {
                    if (action.cb) action.cb(err.response?.data, null);
                    return of({
                        type: "CHECK_SECURITY_QUESTION_FAILURE",
                        payload: err.response
                    });
                })
            )
        )
    );


export const hasUserSecurityQuestionEpic = (action$) =>
    action$.pipe(
        ofType("HAS_USER_SECURITY_QUESTION"),
        mergeMap((action) =>
            from(api.hitApi("/auth/security-question", {}, "GET")).pipe(
                mergeMap((response) => {
                    if (action.cb) action.cb(null, response?.data);
                    return of({
                        type: "HAS_USER_SECURITY_QUESTION_SUCCESS",
                        payload: response.data
                    });
                }),
                catchError((err) => {
                    if (action.cb) action.cb(err, null);
                    return of({
                        type: "HAS_USER_SECURITY_QUESTION_FAILURE",
                        payload: err.response
                    });
                })
            )
        )
    );

export const addSecurityQuestionEpic = (action$) =>
    action$.pipe(
        ofType("ADD_SECURITY_QUESTION"),
        mergeMap((action) =>
            from(api.hitApi("/auth/security-question/add", action.payload, "POST")).pipe(
                mergeMap((response) => {
                    if (action.cb) action.cb(null, response?.data);
                    return of({
                        type: "ADD_SECURITY_QUESTION_SUCCESS",
                        payload: response.data
                    });
                }),
                catchError((err) => {
                    if (action.cb) action.cb(err, null);
                    return of({
                        type: "ADD_SECURITY_QUESTION_FAILURE",
                        payload: err.response
                    });
                })
            )
        )
    );

export const userRegisterEpic = (action$) =>
    action$.pipe(
        ofType("USER_REGISTER_ATTEMPT"),
        mergeMap((action) =>
            from(api.hitApi("/auth/signup", action.formData, "POST", true)).pipe(
                mergeMap((response) => {
                    if (action.cb) action.cb(null, response?.data);
                    return of({
                        type: "USER_REGISTER_SUCCESS",
                        payload: response.data
                    });
                }),
                catchError((err) => {
                    if (action.cb) action.cb(err.response, null);
                    return of({
                        type: "USER_REGISTER_FAILURE",
                        payload: err.response
                    });
                })
            )
        )
    );

export const userVerifyEmailEpic = (action$) =>
    action$.pipe(
        ofType("VERIFY_USER_EMAIL"),
        mergeMap((action) =>
            from(api.hitApi("/auth/verify-email", action.payload, "POST")).pipe(
                mergeMap((response) => {
                    if (action.cb) action.cb(false, true);
                    return of({
                        type: "VERIFY_USER_EMAIL_SUCCESS",
                        payload: response.data
                    });
                }),
                catchError((err) => {
                    if (action.cb) action.cb(true, false);
                    return of({
                        type: "VERIFY_USER_EMAIL_FAILURE",
                        payload: err.response
                    });
                })
            )
        )
    )


export const viewOrganisationListEpic = (action$) =>
    action$.pipe(
        ofType("VIEW_ORGANISATION"),
        mergeMap((action) =>
            from(api.hitApi("/organisation/view", {}, "GET")).pipe(
                mergeMap((response) => {
                    if (action.cb) action.cb(null, response?.data);
                    return of({
                        type: "VIEW_ORGANISATION_SUCCESS",
                        payload: response.data
                    });
                }),
                catchError((err) => {
                    if (action.cb) action.cb(err, null);
                    return of({
                        type: "VIEW_ORGANISATION_FAILURE",
                        payload: err.response
                    });
                })
            )
        )
    );