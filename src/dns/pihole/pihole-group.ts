import type { PiholeGroup, PiholeProcessingResult } from "~/types";
import { piholeApiCall } from "./api";
import { isDefined } from "inferred-types";

export interface PiholeGroupResp {
    groups: PiholeGroup[];
}

export type PiholeAddGroupReq = {
    name: string | string[];
    comment?: string;
    enabled?: boolean;
}

export type PiholeAddGroupResp = {
    groups: PiholeGroup[];
    processed: PiholeProcessingResult;
    took: number;
}



export function piholeGroupApi(
    address: string,
    sid: string
) {
    const api = piholeApiCall(address, sid);


    return {

        /**
         * [Get Groups](https://ftl.pi-hole.net/master/docs/#get-/groups/-name-)
         * 
         * {name} is optional. Specifying it will result in only the requested 
         * group being returned.
         */
        getGroups(
            name?: string
        ) {
            return api<[never, PiholeGroupResp]>(
                "GET",
                "getGroups",
                name ? `groups/${name}` : "groups"
            )
        },

        addGroup(
            name: string | string[],
            comment?: string,
            enabled?: boolean
        ) {
            return api<[PiholeAddGroupReq, PiholeAddGroupResp]>(
                "POST",
                "addGroup",
                "groups",
                {
                    body: {
                        name,
                        comment,
                        enabled: isDefined(enabled) ? enabled : true
                    }
                }
            )
        },

        /**
         * [Remove Group](https://ftl.pi-hole.net/master/docs/#delete-/groups/-name-)
         * 
         * Note: There will be no content on success.
         */
        removeGroup(
            name: string
        ) {
            return api(
                "DELETE",
                "removeGroup",
                `groups/${name}`
            )
        }

    }
}
