import { catchError, mergeMap } from "rxjs/operators";
import { from, of } from "rxjs";
import { ofType } from "redux-observable";
import Api from "../helpers/BaseUrlProvider";

;
const api = new Api();


export const hasUserPermissionFeaturesEpic = (action$) =>
    action$.pipe(
        ofType("GET_USER_PERMISSION_FEATURES"),
        mergeMap((action) =>
            from(api.hitApi("/auth/user/permission", {}, "GET")).pipe(
                mergeMap((response) => {
                    if (action.cb) action.cb(null, response?.data);
                    return of({
                        type: "GET_USER_PERMISSION_SUCCESS",
                        payload: response.data
                    });
                }),
                catchError((err) => {
                    if (action.cb) action.cb(err, null);
                    return of({
                        type: "GET_USER_PERMISSION_FAILURE",
                        payload: err.response
                    });
                })
            )
        )
    );