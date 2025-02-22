import { piholeApiCall } from "../../utils/api";

export function piholeFtlApi(
  address: string,
  sid: string,
) {
  const api = piholeApiCall(address, sid);

  return {
    getEndpoints() {
      return api(
        "GET",
        "getEndpoints",
        "endpoints",
      );
    },

    clientInfo() {
      return api(
        "GET",
        "clientInfo",
        "info/client",
      );
    },

    databaseInfo() {
      return api(
        "GET",
        "databaseInfo",
        "info/database",
      );
    },

    hostInfo() {
      return api(
        "GET",
        "hostInfo",
        "info/host",
      );
    },

    loginInfo() {
      return api(
        "GET",
        "loginInfo",
        "info/login",
      );
    },

    messages() {
      return api(
        "GET",
        "messages",
        "info/messages",
      );
    },

    /**
     * [Remove Message](https://ftl.pi-hole.net/master/docs/#delete-/info/messages/-message_id-)
     *
     * Remove one or more messages by passing the message id's
     */
    removeMessage(
      /** the message ID's for the messages you'd like to remove */
      ...messages: number[]
    ) {
      return api(
        "DELETE",
        "removeMessage",
        `info/messages/${encodeURI(messages.join(","))}`,
      );
    },

    messageCount() {
      return api(
        "GET",
        "messageCount",
        "info/messages/count",
      );
    },

    ftlInfo() {
      return api(
        "GET",
        "getEndpoints",
        "info/ftl",
      );
    },

    systemInfo() {
      return api(
        "GET",
        "getEndpoints",
        "info/system",
      );
    },

    metricsInfo() {
      return api(
        "GET",
        "getEndpoints",
        "info/metrics",
      );
    },

    sensorInfo() {
      return api(
        "GET",
        "getEndpoints",
        "info/sensors",
      );
    },

    versionInfo() {
      return api(
        "GET",
        "getEndpoints",
        "info/version",
      );
    },

    dnsmasqLogs() {
      return api(
        "GET",
        "getEndpoints",
        "logs/dnsmasq",
      );
    },

    ftlLogs() {
      return api(
        "GET",
        "getEndpoints",
        "logs/ftl",
      );
    },
    webserverLogs() {
      return api(
        "GET",
        "getEndpoints",
        "logs/webserver",
      );
    },
  };
}
