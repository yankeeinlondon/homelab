import { piholeApiCall } from "../../utils/api";

/**
 * Methods used to trigger certain actions on your Pi-hole
 */
export function piholeActionsApi(
  address: string,
  sid: string,
) {
  const api = piholeApiCall(address, sid);

  return {

    /**
     * [Flush ARP](https://ftl.pi-hole.net/master/docs/#post-/action/flush/arp)
     *
     * Flushes the network table. This includes emptying the ARP table and
     * removing both all known devices and their associated addresses.
     */
    flushArp() {
      return api<[never, { status: string; took: number }]>(
        "POST",
        "flushArp",
        "actions/flush/arp",
      );
    },

    /**
     * [Flush Logs](https://ftl.pi-hole.net/master/docs/#post-/action/flush/logs)
     *
     * Flushes the DNS logs. This includes emptying the DNS log file and purging
     * the most recent 24 hours from both the database and FTL's internal memory.
     */
    flushLogs() {
      return api<[never, { status: string; took: number }]>(
        "POST",
        "flushArp",
        "actions/flush/logs",
      );
    },

    /**
     * [Sync Gravity](https://ftl.pi-hole.net/master/docs/#post-/action/gravity)
     *
     * Update Pi-hole's adlists by running pihole -g. The output of the process
     * is streamed with chunked encoding.
     */
    syncGravity() {
      return api<[never, ReadableStream<string>]>(
        "POST",
        "flushArp",
        "actions/gravity",
      );
    },

    /**
     * [Restart DNS](https://ftl.pi-hole.net/master/docs/#post-/action/restartdns)
     *
     * Restarts the pihole-FTL service.
     */
    restartDns() {
      return api<[never, { status: string; took: number }]>(
        "POST",
        "flushArp",
        "actions/gravity",
      );
    },

  };
}
