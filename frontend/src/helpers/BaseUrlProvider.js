import base_url, { VITE_BASE_URL_SITE } from "./Costant";

import axios from "axios";
import { toast } from "react-toastify";

export const HeaderData = (update = false) => {
    const token = localStorage.getItem("online_voting_access_token");
    const refreshToken = localStorage.getItem("online_voting_refresh_token");

    if (token === null) {
        return {
            "Content-Type": "application/json"
        };
    } else if (update) {
        return {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + token,
            "X-Refresh-Token": refreshToken
        };
    } else {
        return {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
            "X-Refresh-Token": refreshToken
        };
    }
}

axios.defaults.baseURL = base_url + "api/v1/";
axios.defaults.headers.common["X-Request-Origin"] = VITE_BASE_URL_SITE;

export default class Api {
    async hitApi(
        url,
        payload = {},
        method = "GET",
        multipart = false,
        responses = "json",
        action = {}
    ) {
        try {
            if (method == "POST") {
                let headers;
                if (multipart) {
                    headers = {
                        ...(await HeaderData()),
                        "Content-Type": "multipart/form-data"
                    };
                } else {
                    headers = {
                        ...(await HeaderData())
                    };
                }
                const res = await axios.post(url, payload, {
                    headers,
                    ...(responses === "blob" && { responseType: "blob" }),
                    onUploadProgress: (data) => {
                        if (action.cb) {
                            action.cb(Math.round((100 * data.loaded) / data.total));
                        }
                    }
                });
                return res;
            } else if (method == "PUT") {
                let headers;
                if (multipart) {
                    headers = {
                        ...(await HeaderData()),
                        "Content-Type": "multipart/form-data"
                    };
                } else {
                    headers = {
                        ...(await HeaderData())
                    };
                }
                const res = await axios.put(url, payload, {
                    headers
                });
                return res;
            } else if (method == "DELETE") {
                const res = await axios.delete(url, {
                    headers: await HeaderData(),
                    params: payload,
                    data: payload
                });
                return res;
            } else if (method == "PATCH") {
                const res = await axios.patch(url, payload, {
                    headers: await HeaderData()
                });
                return res;
            } else {
                const res = await axios.get(url, {
                    headers: await HeaderData(),
                    params: payload,
                    responseType: responses
                });
                return res;
            }
        } catch (err) {
            const response = err?.response;
            if (
                // only show the toast if we're actually performing an action(PUT, DELETE, POST), not receiving data
                // for GET requests, there's already the RestrictedContentBanner component that will be shown
                method !== "GET" &&
                (response?.data?.code === "PERMISSION_DENIED" || response?.status === 403)
            ) {
                toast.error(response?.data?.message ?? "Permission Denied", {
                    delay: undefined,
                    autoClose: undefined,
                    closeOnClick: true
                });
            }
            throw err;
        }
    }
    async hitDownloadApi(url, payload = {}, method = "GET", multipart = false) {
        try {
            const res = await axios.get(url, {
                headers: await HeaderData(),
                params: payload,
                responseType: "blob" // set response type to blob
            });
            return res;
        } catch (err) {
            const response = err?.response;
            if (response?.data?.code === "PERMISSION_DENIED") {
                toast.error(response?.data?.message, {
                    delay: undefined,
                    autoClose: undefined,
                    closeOnClick: true
                });
            }
            throw err;
        }
    }
}