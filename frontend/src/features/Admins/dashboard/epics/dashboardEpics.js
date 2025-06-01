import { catchError, mergeMap } from "rxjs/operators";
import { from, of } from "rxjs";
import { ofType } from "redux-observable";

import Api from "../../../../helpers/BaseUrlProvider";
const api = new Api();

export const dashboardEpic = (action$) =>
    action$.pipe(
        ofType("VIEW_DASHBOARD_ATTEMPT"),
        mergeMap((action) =>
            from(api.hitApi("/dashboard", {}, "GET")).pipe(
                mergeMap((response) => {
                    if (action.cb) action.cb(null, response?.data);
                    return of({
                        type: "VIEW_DASHBOARD_SUCCESS",
                        payload: response.data
                    });
                }),
                catchError((err) => {
                    if (action.cb) action.cb(err);
                    return of({
                        type: "VIEW_DASHBOARD_FAILURE",
                        payload: err.response
                    });
                })
            )
        )
    );
