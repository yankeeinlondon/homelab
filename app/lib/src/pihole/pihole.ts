import { isError } from "~/type-guards";
import { piholeActionsApi } from "./pihole-actions";
import { piholeClientApi } from "./pihole-client";
import { piholeDnsApi } from "./pihole-dns";
import { piholeDomainApi } from "./pihole-domain";
import { piholeFtlApi } from "./pihole-ftl";
import { piholeGroupApi } from "./pihole-group";
import { piholeListApi } from "./pihole-list";
import { piholeMetricsApi } from "./pihole-metrics";
import { piholeNetworkApi } from "./pihole-network";
import { authorize, type PiholeAuthOptions } from "./pihole-auth";
import { isKindError } from "@yankeeinlondon/kind-error";
import {  UnexpectedError } from "~/errors";


export type PiholeApi = {
    /** the Pihole server URL */
    server: string;
    /** the base URL for this server's API */
    baseUrl: string;
    /** this session's unique ID */
    sid: string;

    /**
     * Boolean flag which indicates whether the SSL certificate
     * validation can be _skipped_.
     */
    skipValidation: boolean;

    actions: ReturnType<typeof piholeActionsApi>;
    blocking: ReturnType<typeof piholeDnsApi>;
    /**
     * **clients**
     * 
     * Get, add, and remove clients.
     */
    clients: ReturnType<typeof piholeClientApi>;

    domains: ReturnType<typeof piholeDomainApi>;
    /**
     * **ftl**
     * 
     * get metrics info, sensor info, FTL info, logs,
     * and more.
     */
    ftl: ReturnType<typeof piholeFtlApi>;
    /**
     * **groups**
     * 
     * Get, add, and remove groups
     */
    groups: ReturnType<typeof piholeGroupApi>;
    /**
     * **lists**
     * 
     * Get the defined lists on the given PiHole server
     */
    lists: ReturnType<typeof piholeListApi>;
    /**
     * **metrics**
     * 
     * Get metrics on queries, query suggestions, history, database
     * upstreams, top clients, general stats, and more.
     */
    metrics: ReturnType<typeof piholeMetricsApi>;
    /**
     * **network**
     * 
     * Get devices, interfaces, routes, etc.
     */
    network: ReturnType<typeof piholeNetworkApi>;
}


/**
 * The Pihole v6 REST API
 */
export const Pihole = {
    async authorize(opt?: PiholeAuthOptions) {
        const auth = await authorize(opt);

        if (isError(auth)) {
            if(isKindError(auth)) {
                return auth;
            } else {
                return UnexpectedError.proxy(auth)
            }
        }
        else {
            const actions = piholeActionsApi(auth);
            const blocking = piholeDnsApi(auth);
            const clients = piholeClientApi(auth);
            const domains = piholeDomainApi(auth);
            const ftl = piholeFtlApi(auth);
            const groups = piholeGroupApi(auth);
            const lists = piholeListApi(auth);
            const metrics = piholeMetricsApi(auth);
            const network = piholeNetworkApi(auth);

            return {
                /** the pihole server */
                server: auth.server,
                /** the base URL for all API calls */
                baseUrl: `${auth.server}/api`,
                sid: auth.session.sid,
                auth,
                skipValidation: opt?.skipValidation,

                actions,
                blocking,
                clients,
                domains,
                ftl,
                groups,
                lists,
                metrics,
                network,
            } as PiholeApi;
        }
    },
};
