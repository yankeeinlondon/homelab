import type {
  PiholeAuthReponse__FAILURE,
  PiholeAuthResp,
  PiholeAuthResponse__SUCCESS,
} from "~/types";
import { isDefined } from "inferred-types";
import { FailedAuth, RequirementMissing } from "~/errors";
import { isError } from "~/type-guards";
import { endpoint } from "~/utils";
import { piholeActionsApi } from "./pihole-actions";
import { piholeClientApi } from "./pihole-client";
import { piholeDnsApi } from "./pihole-dns";
import { piholeDomainApi } from "./pihole-domain";
import { piholeFtlApi } from "./pihole-ftl";
import { piholeGroupApi } from "./pihole-group";
import { piholeListApi } from "./pihole-list";
import { piholeMetricsApi } from "./pihole-metrics";
import { piholeNetworkApi } from "./pihole-network";

function isSuccessfulPiholeAuth(resp: PiholeAuthResp): resp is PiholeAuthResponse__SUCCESS {
  return !("error" in (resp as PiholeAuthReponse__FAILURE));
}

async function authorize(address: string): Promise<Error | PiholeAuthResponse__SUCCESS> {
  let password: string = "";
  if (address.includes("dns")) {
    const envVar = address.split(".")[0].toUpperCase().replace("-", "_");
    if (isDefined(process.env[envVar])) {
      password = process.env[envVar];
    }
    else if (isDefined(process.env.PASSWORD)) {
      password = process.env.PASSWORD;
    }
    else {
      return RequirementMissing(`Pihole could not authorize because no password is known for the address: ${address}`);
    }
  }
  const url = endpoint(address, "auth"); 
  const req = JSON.stringify({
    password,
  });

  const resp = await fetch(url, { method: "POST", body: req });

  if (resp.ok) {
    const result = await resp.json() as PiholeAuthResp;
    if (isSuccessfulPiholeAuth(result)) {
      return result;
    }
    else {
      return FailedAuth(`Failed to authorize to Pihole server at ${url}`, {
        url,
        error: result.error,
      });
    }
  }
  else {
    return FailedAuth(`Failed to authorize to Pihole server at ${url}`, {
      url,
      code: resp.status,
      msg: resp.statusText,
    });
  }
}

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
