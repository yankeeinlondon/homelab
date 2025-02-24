import type { Integer } from "inferred-types";
import type { Domain, PiholeClient__History, PiholeClientHistoryTimestamp, PiholeHistory, PiholeQuery, PiholeQueryCountsByTypes, PiholeQueryOptions, PiholeStatsSummary, PiholeTopClient } from "~/types";
import { isUndefined } from "inferred-types";
import { piholeApiCall } from "../../utils/api";

export type PiholeQueriesResponse = {
  queries: PiholeQuery[];
  cursor: Integer;
  recordsTotal: Integer;
  recordsFilters: Integer;
  draw: Integer;
  took: number;
}

export type PiholeQuerySuggestionsResponse = {
  suggestions: {
    domain: string[];
    client_ip: string[];
    client_name: string[];
    upstream: string[];
    type: string[];
    status: string[];
    reply: string[];
    dnssec: string[];
  };
  took: number;
}

export type PiholeTopReq = {
  blocked?: boolean;
  count?: number;
}

export type PiholeTopDomainsResponse = {
  domains: { domain: Domain; count: Integer }[];
  total_queries: Integer;
  blocked_queries: Integer;
  took: number;
}

export type PiholeTopClientsResponse = {
  clients: PiholeTopClient[];
  total_queries: number;
  blocked_queries: number;
  took: number;
}

export type PiholeClientHistoryResponse = {
  clients: PiholeClient__History;
  history: PiholeClientHistoryTimestamp[];
  took: number;
}

export function piholeMetricsApi(
  address: string,
  sid: string,
) {
  const api = piholeApiCall(address, sid);

  return {

    /**
     * [Get Queries](https://ftl.pi-hole.net/master/docs/#get-/queries)
     *
     * Request query details.
     *
     * This callback allows for fine-grained filtering by various parameters.
     * All query parameters are all optional and can be combined in any way:
     *
     * - Only show queries from a given timestamp on: Use parameter `from`
     * - Only show queries until a given timestamp: Use parameter `until`
     * - Only show queries sent to a specific upstream destination (may also be cache or blocklist): Use parameter `upstream`
     * - Only show queries for specific domains: Use parameter `domain`
     * - Only show queries for specific clients: Use parameter `client`
     *
     * You can also limit the _number_ of results you want back. By default
     * this call will return 100 queries but you can adjust with the
     * `length` parameter.
     */
    getQueries(qp: PiholeQueryOptions) {
      return api<[PiholeQueryOptions, PiholeQueriesResponse]>(
        "GET",
        "getQueries",
        "queries",
        {
          qp,
        },
      );
    },

    /**
     * [Get Query Suggestions](https://ftl.pi-hole.net/master/docs/#get-/queries/suggestions)
     *
     * provides suggestions for filters suitable to be used with Queries
     */
    getQuerySuggestions() {
      return api<[never, PiholeQuerySuggestionsResponse]>(
        "GET",
        "getQueries",
        "queries/suggestions",
      );
    },

    /**
     * [Get Upstreams](https://ftl.pi-hole.net/master/docs/#get-/stats/upstreams)
     *
     * Gets all the upstream providers which this **Pihole** server
     * will go out to to resolve DNS names (including cache).
     */
    getUpstreams() {
      return api<[never, PiholeQuerySuggestionsResponse]>(
        "GET",
        "getUpstreams",
        "stats/upstreams",
      );
    },

    /**
     * [Get Top Domains](https://ftl.pi-hole.net/master/docs/#get-/stats/top_domains)
     */
    getTopDomains(
      qp: PiholeTopReq,
    ) {
      if (isUndefined(qp.count)) {
        qp = {
          ...qp,
          count: 10,
        };
      }
      return api<[PiholeTopReq, PiholeTopDomainsResponse]>(
        "GET",
        "getTopDomains",
        "stats/top_domains",
        {
          qp,
        },
      );
    },

    /**
     * [Get Top Clients](https://ftl.pi-hole.net/master/docs/#get-/stats/top_clients)
     */
    getTopClients(
      qp: PiholeTopReq,
    ) {
      if (isUndefined(qp.count)) {
        qp = {
          ...qp,
          count: 10,
        };
      }
      return api<[PiholeTopReq, PiholeTopClientsResponse]>(
        "GET",
        "getTopClients",
        "stats/top_clients",
        {
          qp,
        },
      );
    },

    /**
     * [Get Recently Blocked](https://ftl.pi-hole.net/master/docs/#get-/stats/recent_blocked)
     */
    getRecentlyBlocked(
            count: number = 10,
    ) {
      return api<[{ count: number }, { blocked: string[]; took: number }]>(
        "GET",
        "getRecentlyBlocked",
        "stats/recent_blocked",
        {
          qp: { count },
        },
      );
    },

    getQueryTypes() {
      return api<[never, { types: PiholeQueryCountsByTypes; took: number }]>(
        "GET",
        "getQueryTypes",
        "stats/query_types",
      );
    },

    /**
     * [Get History](https://ftl.pi-hole.net/master/docs/#get-/history)
     *
     * Request data needed to generate the "Query over last 24 hours" graph. The
     * sum of the values in the individual data arrays may be smaller than the
     * total number of queries for the corresponding timestamp. The remaining
     * queries are queries that do not fit into the shown categories (e.g.
     * database busy, unknown status queries, etc.).
     */
    getHistory() {
      return api<[never, { history: PiholeHistory; took: number }]>(
        "GET",
        "getHistory",
        "history",
      );
    },

    /**
     * [Get Stats Summary](https://ftl.pi-hole.net/master/docs/#get-/stats/summary)
     *
     * Request various query, system, and FTL properties
     */
    getStatsSummary() {
      return api<[never, PiholeStatsSummary]>(
        "GET",
        "getHistory",
        "stats/summary",
      );
    },

    /**
     * [Get Client History](https://ftl.pi-hole.net/master/docs/#get-/history/clients)
     *
     * Request data needed to generate the "Client activity over last 24 hours"
     * graph. This endpoint returns the top N clients, sorted by total number of
     * queries within 24 hours. If N is set to 0, all clients will be returned.
     * The client name is only available if the client's IP address can be
     * resolved to a hostname.
     *
     * The last client returned is a special client that contains the total
     * number of queries that were not sent by any of the other shown clients ,
     * i.e. queries that were sent by clients that are not in the top N. This
     * client is always present, even if it has 0 queries and can be identified
     * by the special name "other clients" (mind the space in the hostname) and
     * the IP address "0.0.0.0".
     */
    getClientHistory(
            maxClients: number = 20,
    ) {
      return api<[{ n: number }, PiholeClientHistoryResponse]>(
        "GET",
        "getClientHistory",
        "history/clients",
        {
          qp: { n: maxClients },
        },
      );
    },

    getDatabaseHistory() {
      return api(
        "GET",
        "getDatabaseHistory",
        "history/database",
      );
    },

    getDatabaseClientHistory() {
      return api(
        "GET",
        "getDatabaseClientHistory",
        "history/database/clients",
      );
    },

    getDatabaseTopClients() {
      return api(
        "GET",
        "getDatabaseClientHistory",
        "stats/database/top_clients",
      );
    },

    getDatabaseTopDomains() {
      return api(
        "GET",
        "getDatabaseClientHistory",
        "stats/database/top_domains",
      );
    },

    getDatabaseUpstreams() {
      return api(
        "GET",
        "getDatabaseClientHistory",
        "stats/database/upstreams",
      );
    },

  };
}
