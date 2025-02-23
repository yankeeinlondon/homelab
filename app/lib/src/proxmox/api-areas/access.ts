import { proxmoxApiCall } from "../proxmoxApiCall";



export function proxmoxAccessApi(
    host: string,
    key: string
) {
    const api = proxmoxApiCall(host, key);

    return {
        getDomains() {
            return api(
                "GET",
                "getDomains",
                "access/domains"
            )
        },
        getGroups() {
            return api(
                "GET",
                "getGroups",
                "access/groups"
            )
        },

        getOpenId() {
            return api(
                "GET",
                "getOpenId",
                "access/openid"
            )
        },
        getRoles() {
            return api(
                "GET",
                "getRoles",
                "access/roles"
            )
        },

        getTFA() {
            return api(
                "GET",
                "getTFA",
                "access/tfa"
            )
        },

        getUsers() {
            return api(
                "GET",
                "getUsers",
                "access/users"
            )
        },

        getACL() {
            return api(
                "GET",
                "getACL",
                "access/acl"
            )
        },

        getPermissions(userid?: string) {
            return api(
                "GET",
                "getPermissions",
                userid ? `access/Permissions/${encodeURI(userid)}` : `access/Permissions`
            )
        },
    }

}
