import type { PiholeClient } from "~/types";
import { piholeApiCall } from "../../utils/api";

export interface PiholeAddClientReq {
  /** the client's IP, MAC, hostname, or interface */
  client: string | string[];
  comment?: string;
  groups?: number[];
}

export interface PiholeAddClientResponse {
  clients: PiholeClient[];
  processed:
      null |
          { success: { item: string }[] } |
          { errors: { item: string; error: string }[] };
  took: number;
}

export interface PiholeReplaceClientReq {
  comment?: string;
  groups?: number[];
}

export interface PiholeClientSuggestionsResponse {
  clients: {
    hwaddr: string;
    macVendor: string;
    lastQuery: string;
    addresses: string;
    names: string;
    [key: string]: string;
  }[];
  took: number;
}

export function piholeClientApi(
  address: string,
  sid: string,
) {
  const api = piholeApiCall(address, sid);

  return {
    /**
     * **getClients**`([client])`
     *
     * gets _all_ clients by default or a particular client if
     * a client is passed in.
     */
    async getClients(client?: string) {
      return api(
        "GET",
        "getClients",
        client ? `clients/${client}` : "clients",
      );
    },

    /**
     * **[Add Client]()**
     *
     * Creates a new client in the clients object. The {client} itself is
     * specified in the request body (POST JSON).
     *
     * Note that client recognition by IP addresses (incl. subnet ranges) is
     * preferred over MAC address, host name or interface recognition as the two
     * latter will only be available after some time. Furthermore, MAC address
     * recognition only works for devices at most one networking hop away from
     * your Pi-hole.
     *
     * - On success, a new resource is created at /clients/{client}.
     * - The database_error with message UNIQUE constraint failed error
     * indicates that this client already exists.
     */
    async addClient(
      client: string | string[],
      comment?: string,
            groups: number[] = [],
    ) {
      return api<[PiholeAddClientReq, PiholeAddClientResponse]>(
        "POST",
        "addClient",
        "clients",
        {
          body: {
            client,
            comment,
            groups,
          },
        },
      );
    },

    /**
     * **[Remove Client](https://ftl.pi-hole.net/master/docs/#delete-/clients/-client-)**
     *
     * Deletes a client from the Pihole server.
     */
    async removeClient(
      client: string,
    ) {
      return api<[never, void]>(
        "DELETE",
        "removeClient",
        `clients/${encodeURI(client)}`,
      );
    },

    async clientSuggestions() {
      return api<[never, PiholeClientSuggestionsResponse]>(
        "GET",
        "removeClient",
        `clients/_suggestions`,
      );
    },

    /**
     * [Replace Client](https://ftl.pi-hole.net/master/docs/#put-/clients/-client-)
     *
     * Items may be updated by replacing them.
     */
    async replaceClient(
      client: string,
      body: { comment?: string; groups: number[] },
    ) {
      return api<[PiholeReplaceClientReq, PiholeAddClientResponse]>(
        "PUT",
        "removeClient",
        `clients/${encodeURI(client)}`,
        {
          body,
        },
      );
    },
  };
}
