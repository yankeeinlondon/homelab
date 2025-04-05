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
import { authorize } from "./pihole-auth";
// import { createRestApi } from "~/utils/api";

/**
 * The Pihole v6 REST API
 */
export const Pihole = {
  async authorize(address: string) {
    const auth = await authorize(address);

    if (isError(auth)) {
      return auth;
    }
    else {
      const actions = piholeActionsApi(address, auth.session.sid);
      const blocking = piholeDnsApi(address, auth.session.sid);
      const clients = piholeClientApi(address, auth.session.sid);
      const domains = piholeDomainApi(address, auth.session.sid);
      const ftl = piholeFtlApi(address, auth.session.sid);
      const groups = piholeGroupApi(address, auth.session.sid);
      const lists = piholeListApi(address, auth.session.sid);
      const metrics = piholeMetricsApi(address, auth.session.sid);
      const network = piholeNetworkApi(address, auth.session.sid);

      return {
        isAuthorized: true,
        auth,
        actions,
        blocking,
        clients,
        domains,
        ftl,
        groups,
        lists,
        metrics,
        network,
      };
    }
  },
};
