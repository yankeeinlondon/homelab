import type { Domain, PiholeDomain, PiholeDomainKind, PiholeDomainType, PiholeProcessingResult } from "~/types";
import { piholeApiCall } from "./api";
import { isUndefined, type Suggest } from "inferred-types";

export type PiholeAddDomainReq = {
    domain: Domain | Domain[];
    comment?: string;
    groups?: number[];
    enabled?: boolean;
}
export type PiholeAddDomainResponse = {
    domains: PiholeDomain[];
    processed: PiholeProcessingResult;
    took: number
}

export type PiholeReplaceDomainReq = {
        type: PiholeDomainType;
        kind: PiholeDomainKind;
        comment?: string;
        groups?: number[];
        enabled: boolean;
}


export function piholeDomainApi(
    address: string,
    sid: string
) {
    const api = piholeApiCall(address, sid);

    return {

        /**
         * [Get Domains](https://ftl.pi-hole.net/master/docs/#get-/domains/-type-/-kind-/-domain-)
         * 
         * {type}, {kind}, and {domain} in the optional `filter` property may 
         * result in only a subset of the available data being returned.
         */
        async getDomains(
            filter: Suggest<"abc.com" | "allow" | "allow/abc.com" | "exact" | "exact/abc.com" | "deny" | "deny/exact" | "deny/exact/abc.com" | "regex" | "regex/abc.com"> = ""
        ) {
            return api(
                "GET",
                "getDomains",
                filter === "" ? "domains" : `domains/${filter}`
            )
        },

        /**
         * [Replace Domain](https://ftl.pi-hole.net/master/docs/#put-/domains/-type-/-kind-/-domain-)
         * 
         * Items may be updated by _replacing them_. {type}, {kind}, and {domain} are 
         * required as part of the "path" variable and represent the _current_ state.
         * 
         * The **body** of the message is a JSON representation of what you want to
         * replace it with. 
         * 
         * Ensure to send all the required parameters (such as comment) to ensure 
         * these properties are retained. The read-only fields id and date_added are 
         * preserved, date_modified is automatically updated on success.
         * 
         * You can move existing domains to another list type/kind by `PUT`ting the 
         * domain to the new destination by specifying the optional fields type and 
         * kind. 
         */
        async replaceDomain<T extends `${PiholeDomainType}/${PiholeDomainKind}/${Domain}`>(
            path: T,
            replacement: {
                type: PiholeDomainType;
                kind: PiholeDomainKind;
                comment?: string;
                groups?: number[];
                enabled?: boolean;
            }
        ) {
            return api<[PiholeReplaceDomainReq, PiholeAddDomainResponse]>(
                "PUT",
                "replaceDomain",
                `domains/${path}`,
                {
                    body: {
                        ...replacement,
                        enabled: isUndefined(replacement.enabled) ? true : replacement.enabled
                    }
                }
            )
        },

        /**
         * [Add Domain](https://ftl.pi-hole.net/master/docs/#post-/domains/-type-/-kind-)
         * 
         * Creates a new domain in the domains object. This may be either an exact domain or a 
         * regex, depending on {kind}. Both {type} and {kind} are mandatory for this endpoint. The 
         * {domain} itself is specified in the request body (POST JSON).
         * 
         * - On success, a new resource is created at /domains/{type}/{kind}/{domain}.
         * - The database_error with message UNIQUE constraint failed error indicates 
         * that the same entry (domain, type, kind) already exists.
         * - When adding a regular expression, ensure the request body is properly 
         * JSON-escaped.         
         */
        async addDomain(
            domain: Domain | Domain[],
            type: PiholeDomainType,
            kind: PiholeDomainKind,
            opt: {
                comment?: string,
                groups?: number[],
                enabled?: boolean
            }
        ) {
            let { comment, groups, enabled} = opt;
            if(isUndefined(enabled)) {
                enabled = true;
            }

            return api<[PiholeAddDomainReq, PiholeAddDomainResponse]>(
                "POST",
                "addDomain",
                `domains/${type}/${kind}`,
                {
                    body: {
                        domain,
                        comment,
                        groups,
                        enabled
                    }
                }
            )

        },

        /**
         * [Remove Domain](https://ftl.pi-hole.net/master/docs/#delete-/clients/-client-)
         * 
         * Note: There will be no content on success.
         */
        async removeDomain(
            domain: Domain,
            type: PiholeDomainType,
            kind: PiholeDomainKind,
        ) {

            return api<[never, void]>(
                "DELETE",
                "removeDomain",
                `domains/${type}/${kind}/${domain}`
            )

        }
    }

};
