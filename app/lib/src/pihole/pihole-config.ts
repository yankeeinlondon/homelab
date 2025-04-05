import type { PiholeConfig } from "~/types";
import { piholeApiCall } from "./piholeApiCall";


export async function piholeConfigApi(
  address: string,
  sid: string,
) {
  const api = await piholeApiCall(address, sid);

  return {
    getConfig<D extends boolean = false>(
            detailed: D = false as D,
    ) {
      return api<[{ detailed: boolean }, PiholeConfig]>(
        "GET",
        "getConfig",
        "config",
        {
          qp: { detailed },
        },
      );
    },
  };
}
